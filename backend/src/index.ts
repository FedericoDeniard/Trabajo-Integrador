import { KEYS } from "./constants/keys";
import express from "express";

const app = express();

app.listen(KEYS.PORT, () => {
    console.log(`Server running on port ${KEYS.PORT}`);
});
