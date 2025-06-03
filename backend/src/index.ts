import { KEYS } from "./constants/keys";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { productsRouter } from "./routes/products";
import prismaInstance from "./services/db";



const app = express();
app.use(express.json())

app.use(express.static('../frontend/'));

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


