import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

export const comparePassword = async(inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
};

export const findUserByEmail = async(inputEmail) => {
    return await prisma.user.findUnique({ where: { email: inputEmail } });
};