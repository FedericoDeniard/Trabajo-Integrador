import express from 'express'
import { HttpError, ResponseObject } from 'src/middlewares/errorHandler'
import prismaInstance from 'src/services/db'
import { Request, Response } from 'express'
import ejs from 'ejs'
import { MediaByIdsResult } from 'src/scripts/loadDataDb'

const __dirname = import.meta.dirname

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
    const { products } = req.body
    if (!products) {
        throw new HttpError(400, "Missing products")
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

        res.status(201).json(new ResponseObject(true, ticketId, "Purchase successfully created"))
        return
    }
    catch (error) {
        throw new HttpError(500, "Error creating purchase")
    }
})

purchaseRouter.get("/ticket/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    res.render("ticket", {
        v: lastProduct
    });
});

