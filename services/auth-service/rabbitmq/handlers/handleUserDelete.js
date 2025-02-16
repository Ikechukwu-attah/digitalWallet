import { prisma } from "../../src/config/db.js";

export const handleUserDelete = async (message) => {
  try {
    const { userId } = JSON.parse(message.content.toString());
    console.log("receive userDeleted event:", userId);
    if (!userId) {
      console.error("Invalid userId Received", userId);
      return;
    }
    await prisma.user.delete({ where: { id: parseInt(userId, 10) } });
  } catch (error) {
    console.log("errors", error);
  }
};
