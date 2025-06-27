import express from "express";
import { HttpError, ResponseObject } from "../middlewares/errorHandler";
import { Request, Response } from "express";
import prismaInstance, { MediaByIdsResult } from "../services/db";

export const productsRouter = express.Router();

productsRouter.get("/", async (req: Request, res: Response) => {
    const products = await prismaInstance.getProducts(false);
    res.json(new ResponseObject(true, products, "Products list successfully retrieved"))
})

productsRouter.get("/ids", async (req: Request, res: Response) => {
    const { ids } = req.query;
    if (ids && typeof ids === "string") {
        const convertedIds = ids.split(",").map((id: string) => parseInt(id));
        const products = await prismaInstance.getMediasByIds(convertedIds);
        res.json(new ResponseObject(true, products, "Products list successfully retrieved"))
    } else {
        throw new HttpError(400, "Invalid ids")
    }
})

export type PaginatedResponse = {
    products: MediaByIdsResult[],
    nextCursor: number | null,
    pageSize: number,
    hasMore: boolean,
    totalProducts: number
}

productsRouter.get("/paginated", async (req: Request, res: Response) => {
    const { cursor } = req.query;
    if (cursor) {
        const convertedCursor = parseInt(cursor as string);
        const products: PaginatedResponse = await prismaInstance.getPaginatedProducts(false, convertedCursor, 2);

        res.json(new ResponseObject(true, products, "Products list successfully retrieved"))
    } else {
        throw new HttpError(400, "Invalid cursor")
    }
})