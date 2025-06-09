import express from "express";
import { HttpError, ResponseObject } from "../middlewares/errorHandler";
import { Request, Response } from "express";
import prismaInstance from "../services/db";

export const productsRouter = express.Router();

productsRouter.get("/", async (req: Request, res: Response) => {
    const products = await prismaInstance.getAllProducts();
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