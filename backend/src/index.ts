import { KEYS } from "./constants/keys";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { productsRouter } from "./routes/products";
import prismaInstance from "./services/db";
import { purchaseRouter } from "./routes/purchase";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use((_req, res, next) => {
  res.cookie("url_base", `${KEYS.URL_BASE}${KEYS.PORT ? ":" + KEYS.PORT : ""}`, { httpOnly: false })
  next();
})

app.use('/images', express.static(path.join(__dirname, 'frontend/images'), {
  maxAge: '1y', 
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); 
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'frontend')));

app.use("/api/products", productsRouter)
app.use("/api/purchase", purchaseRouter)

app.use(errorHandler)


async function main() {
  try {
    await prismaInstance.connect();
    app.listen(KEYS.PORT, () => {
      console.log(`Server running on http://localhost:${KEYS.PORT}`)
    });


  } catch (error) {
    process.exit(1);
  }
}

main();


