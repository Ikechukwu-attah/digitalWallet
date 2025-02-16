import { prisma } from "../../src/config/db.js";

export const handleUserProfileUpdated = async (message) => {
  try {
    const data = JSON.parse(message.content.toString());
    const { userId, firstname, lastname, middlename } = data;
    const userIdInt = parseInt(userId, 10);

    if (isNaN(userIdInt)) {
      throw new Error(`Invalid userId: ${userId}`);
    }

    //update only the auth service
    await prisma.user.update({
      where: { id: userIdInt },
      data: {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(middlename && { middlename }),
      },
    });
    console.log(
      `User profile updated in the auth-service for userId:${userId}`
    );
  } catch (error) {
    console.error("Error updating user in auth-service", error);
  }
};
