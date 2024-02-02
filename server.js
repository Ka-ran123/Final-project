import express from "express";
import { PORT } from "./src/config/config.js";
import connectDB from "./src/database/conn.js"

const app = express();

connectDB()
app.listen(PORT,()=>{
    console.log(`Server start at port:${PORT} 🚀`);
})