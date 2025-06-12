import express from 'express'
import { HttpError, ResponseObject } from 'src/middlewares/errorHandler'
import prismaInstance from 'src/services/db'
import { Request, Response } from 'express'
import { MediaByIdsResult } from 'src/scripts/loadDataDb'
import { KEYS } from 'src/constants/keys'
import jwt from 'jsonwebtoken'
import { generatePdf } from 'src/controllers/generatePdf'

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

let lastProduct = {} // Esto es temporal, debería consultar a la db

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
        const ticketProducts = mediaProducts.map((p: MediaByIdsResult) => ({
            ...p,
            amount: purchaseProducts.find((pp: PurchaseProduct) => pp.mediaId === p.id).amount
        }))
        const ticketId = Math.ceil(Math.random() * 10)

        lastProduct = ticketProducts
        const ticketHtml = await new Promise<string>((resolve, reject) => {
            res.render("ticket", {
                v: lastProduct,
                url: {
                    base: KEYS.URL_BASE,
                    port: KEYS.PORT
                },
                user: username,
                print: false
            }, (err, html) => {
                if (err) {
                    console.log("Error rendering ticket:", err);
                    reject(err);
                } else {
                    resolve(html);
                }
            });
        });
        const token = generateTicketJwt(ticketId)

        res.cookie('ticket_access', token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 }).status(201).json(new ResponseObject(true, { ticketId: ticketId, html: ticketHtml }, "Purchase successfully created"))
        return
    }
    catch (error) {
        throw new HttpError(500, "Error creating purchase")
    }
})

purchaseRouter.get("/ticket", async (req: Request, res: Response) => {
    const token = req.cookies.ticket_access
    console.log("hola")
    if (!token) {
        throw new HttpError(401, "Unauthorized")
    }
    try {
        const { ticketId } = jwt.verify(token, KEYS.JWT_SECRET) as jwt.JwtPayload
        console.log("la cookie: ", ticketId)
        if (!ticketId) throw new HttpError(401, "Unauthorized")
        console.log(ticketId)
        const ticketHtml = await new Promise<string>((resolve, reject) => {
            res.render("ticket", {
                v: lastProduct,
                url: {
                    base: KEYS.URL_BASE,
                    port: KEYS.PORT
                },
                user: false,
                print: true
            }, (err, html) => {
                if (err) {
                    console.log("Error rendering ticket:", err);
                    reject(err);
                } else {
                    resolve(html);
                }
            });
        });
        const pdf = await generatePdf(ticketHtml, { base: KEYS.URL_BASE, port: KEYS.PORT })
        res.setHeader("Content-Disposition", `attachment; filename=ticket-${ticketId}.pdf`).setHeader("Content-Type", "application/pdf").send(pdf);
    }
    catch (error) {
        throw new HttpError(401, "Invalid token")
    }
})

const generateTicketJwt = (ticketId: number) => {
    const token = jwt.sign({ ticketId }, KEYS.JWT_SECRET, { expiresIn: '1h' })
    return token
}