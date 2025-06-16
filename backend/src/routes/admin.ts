import express from "express";
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import path from "node:path"
import { ResponseObject } from "src/middlewares/errorHandler";
import { generarteAdminJwt } from "src/controllers/admin";
import prismaInstance from "src/services/db";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const adminRouter = express.Router();

const mockedUser = {
    id: 1,
    username: "admin",
    password: "administrador"
}

export type UserType = typeof mockedUser

adminRouter.post("/", (req, res) => {
    const { username, password } = req.body;
    if (username === mockedUser.username && password === mockedUser.password) {
        const jwt = generarteAdminJwt(mockedUser)
        res.status(200).cookie("admin", jwt, { httpOnly: true }).json(new ResponseObject(true, null, "Login successful"))
        return
    }
    res.status(401).json(new ResponseObject(false, null, "Usuario y/o contraseña incorrecta"))
})

adminRouter.get("/edit", async (req, res) => {
    const products = await prismaInstance.getAllProducts();
    res.render("admin/edit", { products })
})