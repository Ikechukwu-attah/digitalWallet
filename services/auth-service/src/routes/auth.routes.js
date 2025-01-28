import express from "express";
import {
    validateAndSanitizeUser,
    validateLoginUserInput,
} from "../middleware/authUserInputValidation.js";
import { login, register } from "../controller/user.js";
import { authMiddleware, authorizeRole } from "../middleware/authMiddleware.js";
import { verify2FA } from "../controller/verify2fa.js";
import { enable2fa } from "../controller/eneable2fa.js";

const router = express.Router();

router.post("/register", validateAndSanitizeUser, register);
router.post("/login", validateLoginUserInput, login);
router.post("/verify-2fa", verify2FA);
router.post("/enable-2fa", authMiddleware, enable2fa);

router.get("/check", authMiddleware, authorizeRole(["Admin"]), (req, res) => {
    return res.send("checking cookies here");
});
export default router;