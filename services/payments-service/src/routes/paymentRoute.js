import express from "express";
import {
  addFund,
  getWalletBalance,
  withdrawalFund,
} from "../controller/paymentController.js";

const router = express.Router();

router.get("/balance/:userId", getWalletBalance);
router.put("/addFund", addFund);
router.put("/withdrawFund", withdrawalFund);

export default router;
