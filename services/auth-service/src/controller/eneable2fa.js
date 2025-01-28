import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { prisma } from "../config/db.js";

export const enable2fa = async(req, res) => {
    try {
        const { userId } = req.body;
        console.log("userID", userId);

        // Generate a 2FA secret
        const secret = speakeasy.generateSecret({
            length: 20,
            name: `DigitalWallet (${email})`,
            issuer: "DigitalWallet",
        });

        // Store secret in the database
        await prisma.user.update({
            where: { id: userId },
            data: { twoFASecret: secret.base32, is2FAEnabled: true },
        });

        // Generate QR Code as a Base64 image
        QRCode.toDataURL(secret.otpauth_url, (err, qrCodeUrl) => {
            if (err) {
                return res.status(500).json({ message: "QR Code Generation Failed" });
            }

            // Return QR Code as base64 image
            res.json({
                message: "2FA Enabled",
                qrCode: qrCodeUrl, // Directly viewable
                secret: secret.base32, // User can manually enter if needed
            });
        });
    } catch (error) {
        console.error("Enable 2FA Error:", error);
        res
            .status(500)
            .json({ status: "Failed", message: "Internal Server Error" });
    }
};