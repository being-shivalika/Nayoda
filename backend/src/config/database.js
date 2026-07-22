import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
    try {
        dotenv.config();

        if (!process.env.MONGO_URI) {
            console.warn("MONGO_URI is not set. Skipping MongoDB connection.");
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB;