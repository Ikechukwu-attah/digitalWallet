import express from "express";
import {
  deleteUser,
  profile,
  updateUserProfile,
} from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user-profile", profile);
router.put("/update/:userId", authenticateUser, updateUserProfile);
router.delete("/delete-user/:userId", authenticateUser, deleteUser);

export default router;
