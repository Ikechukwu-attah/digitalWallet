import { prisma } from "../config/db";

export const profile = async (req, res) => {
  return res.status(200).json({ message: "Testing them now" });
};

export const updateUserProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const updateData = req.body;

    const updateProfile = await prisma.userProfile.update({
      where: { email: email },
      data: updateData,
    });

    return res
      .status(200)
      .json({
        message: "Profile updated successfully",
        profile: updateProfile,
      });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
