import { KEYS } from "./constants/keys";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { productsRouter } from "./routes/products";
import prismaInstance, { gracefulShutdown } from "./services/db";



const app = express();
app.use(express.json())

app.use("/api/products", productsRouter)

app.use(errorHandler)


async function main() {
    try {
        await prismaInstance.$connect();
        console.log("Database connected");

        app.listen(KEYS.PORT, () => {
            console.log(`Server running on port ${KEYS.PORT}`);
        });

        process.on("SIGTERM", gracefulShutdown);
        process.on("SIGINT", gracefulShutdown);

    } catch (error) {
        console.error("Database connection error", error);
        process.exit(1);
    }
}

main();
