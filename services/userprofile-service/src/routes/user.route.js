import express from "express";
import { profile, updateUserProfile } from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user-profile", profile);
router.put("/update", authenticateUser, updateUserProfile);

export default router;