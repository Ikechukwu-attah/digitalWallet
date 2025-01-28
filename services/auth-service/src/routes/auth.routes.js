import express from "express";
import {
    validateAndSanitizeUser,
    validateLoginUserInput,
} from "../middleware/authUserInputValidation.js";
import { login, register } from "../controller/user.js";
import { authMiddleware, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validateAndSanitizeUser, register);
router.post("/login", validateLoginUserInput, login);
router.get("/check", authMiddleware, authorizeRole(["Admin"]), (req, res) => {
    return res.send("checking cookies here");
});
export default router;