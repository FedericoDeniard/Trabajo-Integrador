import express from 'express'
import { HttpError, ResponseObject } from 'src/middlewares/errorHandler'
import prismaInstance, { MediaByIdsResult } from 'src/services/db'
import { Request, Response } from 'express'
import { KEYS } from 'src/constants/keys'
import jwt from 'jsonwebtoken'
import { generatePdf, generateTicketHTML, ProductWithAmount } from 'src/controllers/tickets'

export const purchaseRouter = express.Router()

class PurchaseProduct {
    mediaId: number;
    amount: number;

    constructor(mediaId: number, amount: number) {
        if (typeof mediaId !== 'number' || isNaN(mediaId)) {
            throw new Error("Invalid mediaId: must be a number");
        }

        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            throw new Error("Invalid amount: must be a positive number");
        }

        this.mediaId = mediaId;
        this.amount = amount;
    }
}

let lastProduct: ProductWithAmount[] = [] // Esto es temporal, debería consultar a la db

purchaseRouter.post("/", async (req: Request, res: Response) => {
    const { products, username } = req.body
    if (!products) {
        throw new HttpError(400, "Missing products")
    }
    if (!username) {
        throw new HttpError(400, "Missing username")
    }

    try {

        const purchaseProducts = products.map((product: any) => new PurchaseProduct(product.mediaId, product.amount))
        const productsId = purchaseProducts.map((p: PurchaseProduct) => p.mediaId)
        const mediaProducts = await prismaInstance.getMediasByIds(productsId)
        const ticketProducts: ProductWithAmount[] = mediaProducts.map((p: MediaByIdsResult) => ({
            ...p,
            amount: purchaseProducts.find((pp: PurchaseProduct) => pp.mediaId === p.id).amount
        }));

        const ticketDB = await prismaInstance.createTicket(username,
            purchaseProducts.map((pp: PurchaseProduct) => ({media_id: pp.mediaId, amount: pp.amount})),
            Date.now()
        );

        //const ticketId = Math.ceil(Math.random() * 10)
        lastProduct = ticketProducts;
        const ticketHtml = await generateTicketHTML({ products: lastProduct, username, print: false });

        //const token = generateTicketJwt(ticketId)
        const token = generateTicketJwt(ticketDB.id);

        res.cookie('ticket_access', token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 }).status(201).json(new ResponseObject(true, { ticketId: ticketDB.id, html: ticketHtml }, "Purchase successfully created"))
        return
    }
    catch (error) {
        if (error instanceof HttpError) {
            throw error
        }
        throw new HttpError(500, "Error creating purchase")
    }
})

purchaseRouter.get("/ticket", async (req: Request, res: Response) => {
    const token = req.cookies.ticket_access
    if (!token) {
        throw new HttpError(401, "Unauthorized")
    }
    try {
        const { ticketId } = jwt.verify(token, KEYS.JWT_SECRET) as jwt.JwtPayload
        if (!ticketId) throw new HttpError(401, "Unauthorized");

        const ticketProducts = await prismaInstance.getProductsFromTicket(ticketId);
        const ticketHtml = await generateTicketHTML({
            products: ticketProducts,
            username: false,
            print: true
        })

        const pdf = await generatePdf(ticketHtml, { base: KEYS.URL_BASE, port: KEYS.PORT });
        res.setHeader("Content-Disposition", `attachment; filename=ticket-${ticketId}.pdf`).setHeader("Content-Type", "application/pdf").send(pdf);
    }
    catch (error) {
        if (error instanceof HttpError) throw error
        throw new HttpError(401, "Invalid token")
    }
})

const generateTicketJwt = (ticketId: number) => {
    const token = jwt.sign({ ticketId }, KEYS.JWT_SECRET, { expiresIn: '1h' })
    return token
}