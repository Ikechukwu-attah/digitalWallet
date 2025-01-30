import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import "./config/passport.js";

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

app.get("/", (req, res) => {
    res.send("GET request to '/' works!");
});

app.get("/kudos", (req, res) => {
    res.send("GET request to '/kudos' works!");
});

app.get("/y", (req, res) => {
    res.send("GET request to '/kudos' works!");
});

app.post("/try/hi", (req, res) => {
    console.log(req.body); // To confirm the request body is parsed correctly
    res.send("POST request to '/' works!");
});

app.use("/user", authRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});