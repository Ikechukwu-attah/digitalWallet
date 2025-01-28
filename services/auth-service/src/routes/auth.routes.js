import express from "express";
import { validateAndSanitizeUser } from "../middleware/authUserInputValidation.js";
import { register } from "../controller/user.js";

const router = express.Router();

router.post("/register", validateAndSanitizeUser, register);
router.post("/", (req, res) => {
  res.send("Register endpoint hit!");
});

export default router;
