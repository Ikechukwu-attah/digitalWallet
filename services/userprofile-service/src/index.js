import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import profileRoute from "./routes/user.route.js";
import { connectRabbitMQ } from "../rabbitmq/connection.js";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//RabbitMQ
connectRabbitMQ();
// Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// Profile Routes
app.use("/profile", profileRoute);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
