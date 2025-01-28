import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

export const register = async(req, res) => {
    try {
        const { email, firstname, lastname, middlename, password, username } =
        req.body;

        // Check if the email already exists
        const checkEmail = await prisma.user.findUnique({
            where: { email: email },
        });

        if (checkEmail) {
            return res
                .status(400)
                .json({ status: "failed", message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                username, // Ensure username is included if required
                firstname,
                lastname,
                email,
                middlename: middlename || null, // Handle optional middlename
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            status: "success",
            message: "User successfully created",
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "User creation failed",
            error: error.message,
        });
    }
};