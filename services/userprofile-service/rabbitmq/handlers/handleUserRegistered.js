import { prisma } from "../../src/config/db.js";

export const handleUserRegistered = async (message) => {
  try {
    const userData = JSON.parse(message.content.toString());
    console.log(`Received  user_registered event: ${userData}`);

    //check if user exist
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: userData.userId.toString() },
    });
    if (existingProfile) {
      console.log(
        `⚠️ Profile already exists for userId ${userData.userId}. Skipping creation.`
      );
      return;
    }

    // Create new user profile
    const newProfile = await prisma.userProfile.create({
      data: {
        userId: userData.userId.toString(),
        email: userData.email,
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        middlename: userData.middlename || null,
        phone: "",
        address: "",
        dateOfBirth: null,
        profilePicture: "",
        bio: "",
      },
    });
    console.log(
      "✅ Auto-created profile in `userProfile-service`:",
      newProfile
    );
  } catch (error) {
    console.error("❌ Error processing `user_registered` event:", error);
  }
};
