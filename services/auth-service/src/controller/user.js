import { prisma } from "../config/db";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { email, firstname, lastname, middlename, password } = req.body;

    const checkEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (checkEmail) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email all exist" });
    }
    const hashedPassword = bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        middlename,
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
      status: "Failed",
      message: "User creation failed",
      error: error.message,
    });
  }
};
