import prisma from "../config/prisma.js";

const handleUserRegistered = async (data) => {
  try {
    const { email, username, firstname, lastname, middlename } = data;

    // Check if profile already exists
    let existingProfile = await prisma.userProfile.findUnique({
      where: { email },
    });

    if (existingProfile) {
      console.log(`⚠️ Profile for ${email} already exists. Skipping.`);
      return;
    }

    // Create a new profile with additional fields
    const newProfile = await prisma.userProfile.create({
      data: {
        email,
        username,
        firstname,
        lastname,
        middlename: middlename || null,
        phone: "",
        address: "",
        dateOfBirth: null,
        profilePicture: "",
        bio: "",
      },
    });

    console.log(`✅ Created profile for: ${username}`);
  } catch (error) {
    console.error("❌ Error in userRegistered handler:", error);
  }
};

export default handleUserRegistered;
