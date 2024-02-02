import mongoose from "mongoose"
import { DB_ATLAS } from "../config/config.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(DB_ATLAS)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB