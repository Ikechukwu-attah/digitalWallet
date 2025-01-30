import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { Role } from "@prisma/client";

export const refreshAccessToken = (req, res) => {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
        return res
            .status(403)
            .json({ status: "Failed", message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refresh_token);

        const newAccessToken = jwt.sign({
                id: decoded.id,
                role: decoded.role,
                firstname: decoded.firstname,
            },
            process.env.TOKEN_SECRET, { expiresIn: "1h" }
        );

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: newAccessToken,
        });

        return res.status(200).json({
            status: "success",
            message: "Access token refreshed",
            token: newAccessToken,
        });
    } catch (error) {
        res.status(403).json({
            status: "Failed",
            message: "Invalid or expired refresh token",
        });
    }
};