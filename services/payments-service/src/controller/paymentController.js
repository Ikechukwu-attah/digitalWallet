import { prisma } from "../config/db.js";

export const getWalletBalance = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid user ID required" });
    }

    console.log({ userId });
    if (!userId) return res.status(400).json({ message: "id required" });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userId },
    });

    console.log({ wallet });
    if (!wallet) return res.status(401).json({ message: "user not found" });
    return res.status(200).json({ status: "Success", data: wallet.balance });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error });
  }
};

export const addFund = async (req, res) => {
  console.log(req.body);
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) return res.json("fields required");

    const formattedUserId = parseInt(userId, 10);
    console.log({ formattedUserId });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: formattedUserId },
    });

    if (!wallet) return res.status(404).json("Wallet not found");

    const updateWallet = await prisma.wallet.update({
      where: { userId: formattedUserId },
      data: {
        balance: wallet.balance + parseFloat(amount),
      },
    });

    return res
      .status(200)
      .json({ message: "Wallet successfully funded", data: updateWallet });
  } catch (error) {
    res.status(500).json({ message: "Server error ", error: error });
  }
};

export const withdrawalFund = async (req, res) => {
  console.log(req.body);
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount)
      return res.status(400).json({ message: "fields are required" });

    const formattedUserId = parseInt(userId, 10);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: formattedUserId },
    });

    if (!wallet) {
      return res.status(400).json({ message: "wallet not found" });
    }

    const formattedAmount = parseFloat(amount);
    console.log("balance", wallet.balance);
    console.log({ amount, formattedAmount, wallet: wallet.balance });
    if (formattedAmount > wallet.balance)
      return res.status(402).json({ message: "Insufficient fund" });

    const updatedatedWallet = await prisma.wallet.update({
      where: { userId: formattedUserId },
      data: {
        balance: wallet.balance - formattedAmount,
      },
    });

    return res
      .status(200)
      .json({ message: "Withdrawal was successful", data: updatedatedWallet });
  } catch (error) {
    console.log("error withdrawing", error);
    res.status(500).json({ message: "server error", error: error });
  }
};
