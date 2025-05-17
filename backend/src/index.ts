import { KEYS } from "./constants/keys";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(errorHandler)

app.listen(KEYS.PORT, () => {
    console.log(`Server running on port ${KEYS.PORT}`);
});
