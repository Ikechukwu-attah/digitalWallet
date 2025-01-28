import { prisma } from "../config/db";
import speakeasy from "speakeasy";

export const verify2FA = async(req, res) => {
    const { userId, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.is2FAEnabled || !user.twoFASecret) {
        return res
            .status(400)
            .json({ message: " 2FA not enabled or user not found" });
    }

    //Verifying OTP
    const isValid = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: "base32",
        token: otp,
        window: 1,
    });

    if (!isValid) {
        return res.status(401).json({ message: "Invalid Token" });
    }

    res.status(200).json({ message: "2FA verification successful" });
};