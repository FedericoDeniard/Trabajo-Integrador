import express from "express";
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { generarteAdminJwt } from "src/controllers/admin";
import prismaInstance from "src/services/db";
import { adminAuth } from "src/middlewares/auth";
import { validateProduct } from "src/controllers/products";
import { deleteThumbnail, mediaThumbnailUpload } from "src/constants/multer";

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

adminRouter.post("/update/:id", adminAuth, mediaThumbnailUpload.single("thumbnail"), async (req, res) => {
    const data = req.body;
    const updatedProduct = validateProduct(data)
    const image = req.file
    try {
        const updated = await prismaInstance.updateProduct({ ...updatedProduct, thumbnail: image?.path })
        res.render("admin/info", { title: "Producto actualizado", message: "Producto actualizado correctamente", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })

    } catch (error) {
        if (image) {
            await deleteThumbnail(image.path)
        }
        res.render("admin/info", { title: "Error actualizando producto", message: "Error actualizando producto", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    }
})

adminRouter.post("/delete/:id", adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        await prismaInstance.disableProduct(Number(id))
        res.render("admin/info", { title: "Producto deshabilitado", message: "Producto deshabilitado correctamente", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })

    } catch (error) {
        res.render("admin/info", { title: "Error deshabilitando producto", message: "Error deshabilitando producto", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    }
})

adminRouter.post("/activate/:id", adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        await prismaInstance.activateProduct(Number(id))
        res.render("admin/info", { title: "Producto habilitado", message: "Producto habilitado correctamente", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })

    } catch (error) {
        res.render("admin/info", { title: "Error habilitando producto", message: "Error habilitando producto", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    }
})

adminRouter.get("/movie/create", adminAuth, (req, res) => {
    res.render("admin/createMovie")
})

adminRouter.get("/series/create", adminAuth, (req, res) => {
    res.render("admin/createSerie")
})

adminRouter.post("/movie/create", adminAuth, mediaThumbnailUpload.single("thumbnail"), async (req, res) => {
    console.log(req.body)
    const product = validateProduct(req.body)
    console.log(product)
    try {

        const newProduct = await prismaInstance.createProduct({ ...product, thumbnail: req.file?.path })
        console.log(newProduct)
        res.render("admin/info", { title: "Producto creado", message: "Producto creado correctamente", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    } catch (error) {
        console.log(error)
        if (req.file) {
            await deleteThumbnail(req.file?.path)
        }
        res.render("admin/info", { title: "Error creando producto", message: "Error creando producto", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    }

})

adminRouter.post("/series/create", adminAuth, mediaThumbnailUpload.single("thumbnail"), async (req, res) => {
    console.log(req.body)
    const product = validateProduct(req.body)
    console.log(product)
    console.log(req.file?.path)
    try {

        const newProduct = await prismaInstance.createProduct({ ...product, thumbnail: req.file?.path })
        console.log(newProduct)
        res.render("admin/info", { title: "Producto creado", message: "Producto creado correctamente", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    } catch (error) {
        console.log(error)
        if (req.file) {
            await deleteThumbnail(req.file?.path)
        }
        res.render("admin/info", { title: "Error creando producto", message: "Error creando producto", formAction: "/api/admin/products", formMethod: "GET", buttonText: "Volver" })
    }

})