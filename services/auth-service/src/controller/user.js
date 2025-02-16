import { prisma } from "../config/db.js";
import speakeasy from "speakeasy";
import bcrypt from "bcryptjs";
import { generateToken, refreshToken } from "../services/generateToken.js";
import { comparePassword, findUserByEmail } from "../services/userService.js";

import { publishQueue } from "../../rabbitmq/publisher.js";

export const register = async (req, res) => {
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
        username,
        firstname,
        lastname,
        email,
        middlename: middlename || null,
        password: hashedPassword,
      },
    });

    //message to be sent to the userprofile service
    const message = {
      username,
      firstname,
      lastname,
      email,
      middlename,
      userId: newUser.id,
    };

    publishQueue("user_registered", message);
    console.log(`Sent user registration event to RabbitMQ: ${message}`);

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

export const login = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Email or password required" });
    }

    const checkEmail = await findUserByEmail(email);
    if (!checkEmail)
      return res
        .status(401)
        .json({ status: "Failed", message: "Incorrect email or password" });

    const passwordMatch = await comparePassword(password, checkEmail.password);
    if (!passwordMatch)
      return res
        .status(401)
        .json({ status: "Failed", message: "Incorrect email or password" });

    //if 2fa is enabled
    if (checkEmail.is2FAEnabled) {
      if (!otp) return res.status(400).json({ message: "OTP required" });

      const isValidOtp = speakeasy.totp.verify({
        secret: checkEmail.twoFASecret,
        encoding: "base32",
        token: otp,
        window: 1,
      });

      if (!isValidOtp) return res.status(401).json({ message: "Invalid OTP" });
    }

    const token = generateToken({
      id: checkEmail.id,
      role: checkEmail.role,
      firstname: checkEmail.firstname,
    });
    const refresh_token = refreshToken({
      id: checkEmail.id,
      role: checkEmail.role,
      firstname: checkEmail.firstname,
    });

    res.cookie("token", token, {
      httpOnly: true,
      samesite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      samesite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600000,
    });

    return res.status(200).json({
      status: "success",
      message: "User successfully logged in",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Not successful",
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    samesite: "Strict",
  });
  res.clearCookie("refresh_token");

  res.json({ message: "Logged out successfully" });
};
