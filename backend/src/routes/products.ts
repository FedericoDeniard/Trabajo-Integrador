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
    currentPage: number,
    pageSize: number,
    totalPages: number,
    totalProducts: number
    hasMore: boolean,
    hasPrevious: boolean,
}

productsRouter.get("/paginated", async (req: Request, res: Response) => {
    const { page = "1", limit = "10", filter = "" } = req.query;
    const pageNumber = parseInt(page as string);
    const pageLimit = parseInt(limit as string);
    const filterString = filter as string;
    if (isNaN(pageNumber) || pageNumber < 1) {
        throw new HttpError(400, "Invalid page number");
    }

    if (isNaN(pageLimit) || pageLimit < 1 || pageLimit > 100) {
        throw new HttpError(400, "Invalid limit (must be between 1 and 100)");
    }

    const products: PaginatedResponse = await prismaInstance.getPaginatedProducts(false, pageNumber, pageLimit, filterString);

    res.json(new ResponseObject(true, products, "Products list successfully retrieved"))

})