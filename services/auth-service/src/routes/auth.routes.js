import express from "express";
import passport from "passport";
import {
    validateAndSanitizeUser,
    validateLoginUserInput,
} from "../middleware/authUserInputValidation.js";
import { login, register } from "../controller/user.js";
import { authMiddleware, authorizeRole } from "../middleware/authMiddleware.js";
import { verify2FA } from "../controller/verify2fa.js";
import { enable2fa } from "../controller/eneable2fa.js";
import { refreshAccessToken } from "../controller/refreshAccessToken.js";

const router = express.Router();

router.post("/register", validateAndSanitizeUser, register);
router.post("/login", validateLoginUserInput, login);
router.post("/verify-2fa", verify2FA);
router.post("/enable-2fa", authMiddleware, enable2fa);
router.post("/refresh-token", refreshAccessToken);
//Google OAuth
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
//Google OAuth callback route
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        successRedirect: "/home",
    }),
    (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Google authentication successful",
            user: req.user,
        });
    }
);

router.get("/check", authMiddleware, authorizeRole(["Admin"]), (req, res) => {
    return res.send("checking cookies here");
});
export default router;