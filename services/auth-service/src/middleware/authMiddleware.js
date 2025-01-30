import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async(req, res, next) => {
    const access_token = req.cookies.token;
    if (!access_token)
        return res.status(400).json({ status: "Failed", message: "Unauthorized" });
    console.log("access_token", access_token);

    try {
        //Verify token
        const decoded = jwt.verify(access_token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access toke expired" });
        }
        res.status(401).json({
            status: "Failed",
            error: error.message,
            message: "invalid token",
        });
    }
};

export const authorizeRole = (role) => (req, res, next) => {
    if (!req.user || !role.includes(req.user.role)) {
        return res.status(403).json({ message: "insufficient permission" });
    }
    next();
};