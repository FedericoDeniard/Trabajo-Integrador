import { KEYS } from "./constants/keys";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { productsRouter } from "./routes/products";

const app = express();
app.use(express.json())

app.use("/api/products", productsRouter)

app.use(errorHandler)

app.listen(KEYS.PORT, () => {
    console.log(`Server running on port ${KEYS.PORT}`);
});
