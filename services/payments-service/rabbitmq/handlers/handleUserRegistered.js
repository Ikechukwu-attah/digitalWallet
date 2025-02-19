import { prisma } from "../../src/config/db.js";

export const handleUserRegistered = async (message) => {
  try {
    console.log("📩 Raw Event Data:", message.content.toString()); // ✅ Log incoming event
    const userData = JSON.parse(message.content.toString());

    if (!userData.userId) {
      console.error("❌ Missing userId in event data.");
      return;
    }

    console.log(
      "✅ Processing `user_registered` event for userId:",
      userData.userId
    );

    // ✅ Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId: userData.userId },
    });

    if (existingWallet) {
      console.log(
        `⚠️ Wallet already exists for userId ${userData.userId}. Skipping.`
      );
      return;
    }

    // ✅ Create new wallet
    await prisma.wallet.create({
      data: {
        userId: userData.userId,
        balance: 0.0,
        currency: "USD",
      },
    });

    console.log(`✅ Wallet created successfully for userId ${userData.userId}`);
  } catch (error) {
    console.error("❌ Error processing `user_registered` event:", error);
  }
};
