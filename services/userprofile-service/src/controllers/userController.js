import { prisma } from "../config/db.js";
import { ObjectId } from "mongodb";

export const profile = async (req, res) => {
  return res.status(200).json({ message: "Testing them now" });
};

export const updateUserProfile = async (req, res) => {
  try {
    console.log("🟡 Received Update Request:", req.body);

    let userId = req.user.id; // Extract user ID from token
    console.log("🔍 Searching for user in database with ID:", userId);

    if (!userId) {
      console.log("❌ No User ID found in request.");
      return res.status(400).json({ error: "User ID required" });
    }

    // ✅ Convert numeric ID to string to match MongoDB _id format
    let userProfileId = String(userId);

    // ✅ Check if user exists in MongoDB
    let existingProfile = await prisma.userProfile.findUnique({
      where: { id: userProfileId },
    });

    console.log("🔍 Existing Profile:", existingProfile);

    if (!existingProfile) {
      console.log("⚠️ No user found. Creating new profile...");

      // ✅ Create a new profile with default values
      existingProfile = await prisma.userProfile.create({
        data: {
          id: userProfileId, // Store numeric ID as string
          email: req.body.email,
          username: req.body.username || "",
          firstname: req.body.firstname || "",
          lastname: req.body.lastname || "",
          phone: req.body.phone || "",
          address: req.body.address || "",
          dateOfBirth: req.body.dateOfBirth || null,
          profilePicture: req.body.profilePicture || "",
          bio: req.body.bio || "",
        },
      });

      console.log("✅ New Profile Created:", existingProfile);
    }

    // ✅ Update user profile with new data
    const updatedProfile = await prisma.userProfile.update({
      where: { id: userProfileId },
      data: req.body,
    });

    console.log("✅ Profile Updated Successfully:", updatedProfile);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
