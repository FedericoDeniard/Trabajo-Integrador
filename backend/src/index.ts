import { KEYS } from "./constants/keys";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { productsRouter } from "./routes/products";
import prismaInstance from "./services/db";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json())

app.use((req, res, next) => {
  res.cookie("url_base", `http://localhost:${KEYS.PORT}`, { httpOnly: false })
  next();
})
app.use(express.static(path.join(__dirname, 'frontend')));

app.use("/api/products", productsRouter)

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


