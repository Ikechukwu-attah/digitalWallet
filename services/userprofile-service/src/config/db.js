import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Mongodb connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
