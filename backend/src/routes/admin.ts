import express from "express";
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import path from "node:path"
import { ResponseObject } from "src/middlewares/errorHandler";
import { generarteAdminJwt } from "src/controllers/admin";
import prismaInstance from "src/services/db";
import { adminAuth } from "src/middlewares/auth";
import { validateProduct } from "src/controllers/products";

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
        res.status(200).cookie("admin", jwt, { httpOnly: true }).redirect("/api/admin/products")
        return
    }
    res.status(401).redirect("/api/admin/login")
})

adminRouter.post("/logout", (req, res) => {
    res.clearCookie("admin").redirect("/api/admin/login")
})

adminRouter.get("/login", (req, res) => {
    res.render("admin/login")
})

adminRouter.get("/products", adminAuth, async (req, res) => {
    const products = await prismaInstance.getAllProducts();
    res.render("admin/products", { products })
})

adminRouter.post("/edit/:id", adminAuth, async (req, res) => {
    const { id } = req.params;
    const product = await prismaInstance.getMediaById(Number(id))
    res.render("admin/edit", { p: product })
})

adminRouter.post("/update/:id", adminAuth, async (req, res) => {
    const data = req.body;
    const updatedProduct = validateProduct(data)
    try {
        const dbResponse = await prismaInstance.updateProduct(updatedProduct)
        res.render("admin/info", { title: "Producto actualizado", message: "Producto actualizado correctamente", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })

    } catch (error) {
        res.render("admin/info", { title: "Error actualizando producto", message: "Error actualizando producto", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    }
})

adminRouter.post("/delete/:id", adminAuth, async (req, res) => {
    const { id } = req.params;
    console.log(id)
    res.status(200).json(new ResponseObject(true, null, "Product deleted successfully"))
})
