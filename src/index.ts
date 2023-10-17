import { config } from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import {router} from "./router";
const app = express();
config({});
app.use(cors({}));
app.use(express.json());
app.use(router);

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
        app.listen(5555, () => console.log(`Server listen on port ${process.env.SERVER_PORT}`))
    } catch (e: any) {
        console.log(e.message);
    }
}


start();
