import { publishToQueue } from "../../rabbitmq/publisher.js";
import { prisma } from "../config/db.js";
import { ObjectId } from "mongodb";

export const profile = async (req, res) => {
  return res.status(200).json({ message: "Testing them now" });
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    console.log({ userId });

    const { firstname, lastname, middlename, ...otherFields } = updateData;

    const updatedProfile = await prisma.userProfile.update({
      where: { userId: userId },
      data: { firstname, lastname, middlename, ...otherFields },
    });

    //if firstname, lastname or middlename were updated, notify auth-service
    if (firstname || lastname || middlename) {
      const eventPayload = {
        userId,
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(middlename && { middlename }),
      };

      await publishToQueue("UserProfileUpdated", eventPayload); // Send event to RabbitMQ
    }
    return res.status(200).json({
      message: "User profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.error("Error updating user profile", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) return res.status(401).json({ message: "Id is required" });

    const user = await prisma.userProfile.findUnique({ where: { userId } });

    if (!user) return res.status(400).json({ message: "User not found" });

    await prisma.userProfile.delete({ where: { userId } });
    await publishToQueue("userDeleted", { userId });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "UserId is required" });
    const user = await prisma.userProfile.findUnique({
      where: { userId: userId },
    });
    console.log({ user });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ status: "successful", data: user });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await prisma.userProfile.findMany();
    if (!user) return res.status(404).json({ message: "Users not found" });
    res
      .status(200)
      .json({ message: "User successfully extracted", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "user extraction not successful", error: error });
  }
};
