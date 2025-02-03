import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import "./config/passport.js";
import { connectRabbitMQ } from "../rabbitMQ/connection.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectRabbitMQ();

app.use("/user", authRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
