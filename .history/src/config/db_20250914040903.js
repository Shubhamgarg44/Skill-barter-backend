import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () =>{
    try{
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI is not set in .env");

          // Optional: adjust mongoose options if needed
    mongoose.set("strictQuery", true);
    }
}
