import express from 'express'
import { HttpError, ResponseObject } from 'src/middlewares/errorHandler'
import prismaInstance, { MediaByIdsResult } from 'src/services/db'
import { Request, Response } from 'express'
import { KEYS } from 'src/constants/keys'
import jwt from 'jsonwebtoken'
import { generatePdf, generateTicketHTML, ProductWithAmount } from 'src/controllers/tickets'

export const purchaseRouter = express.Router()

export class PurchaseProduct {
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

purchaseRouter.post("/", async (req: Request, res: Response) => {
    const { products, username } = req.body
    if (!products) {
        throw new HttpError(400, "Missing products")
    }
    if (!username) {
        throw new HttpError(400, "Missing username")
    }

    try {
        const purchaseProducts: PurchaseProduct[] = products.map((product: any) => new PurchaseProduct(product.mediaId, product.amount));
        const productsId = purchaseProducts.map((p: PurchaseProduct) => p.mediaId);
        const mediaProducts = await prismaInstance.getMediasByIds(productsId);
        const ticketProducts: ProductWithAmount[] = mediaProducts.map((p: MediaByIdsResult) => {
            const match = purchaseProducts.find((pp: PurchaseProduct) => pp.mediaId === p.mediaId);
            if (!match) {
                throw new HttpError(400, `No matching product found for mediaId ${p.mediaId}`);
            }

            return {
                ...p,
                amount: match.amount
            };
        });

        const ticketDate = new Date()
        const ticketDB = await prismaInstance.createTicket(username,
            ticketProducts,
            ticketDate
        );
        const ticketHtml = await generateTicketHTML({ products: ticketProducts, username, print: false, date: ticketDate });

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

        const [ticketProducts, ticketDate] = await Promise.all([
            prismaInstance.getProductsFromTicket(ticketId),
            prismaInstance.getTicketDate(ticketId)
        ])
        const ticketHtml = await generateTicketHTML({
            products: ticketProducts,
            username: false,
            print: true,
            date: ticketDate
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