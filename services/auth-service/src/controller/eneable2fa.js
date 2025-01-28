import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { prisma } from "../config/db";

export const enable2fa = async(req, res) => {
    const { userId } = req.body;

    //Generate a 2fa secret
    const secret = speakeasy.generateSecret({ length: 20 });

    // store it in the database.
    await prisma.user.update({
        where: { id: userId },
        data: { twoFASecret: secret.base32, is2FAEnabled: true },
    });

    //Generating a QR code for Google Authenticator

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err)
            return res.status(500).json({ message: "QR Code Generation Failed" });
        res.json({
            message: "2FA Enabled",
            qrCode: data_url,
            secret: secret.base32,
        });
    });
};