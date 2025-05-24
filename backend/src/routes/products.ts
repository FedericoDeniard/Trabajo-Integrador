import express from "express";
import { getProducts } from "../controllers/products";
import { ResponseObject } from "../middlewares/errorHandler";
import { Request, Response } from "express";

export const productsRouter = express.Router();

productsRouter.get("/", (req: Request, res: Response) => {
    res.json(new ResponseObject(true, getProducts(), "Products list successfully retrieved"))
})        