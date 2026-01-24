import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { isValidEmail } from "../lib/validation.js";

export const getSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("connections");
    const already = currentUser?.connections || [];

    const suggestedUser = await User.find({
      _id: { $ne: req.user._id, $nin: already },
    })
      .select("name username profilePicture headline")
      .limit(3);

    res.json(suggestedUser);
  } catch (error) {
    console.error("Error in getSuggestedConnections controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Error deleting profile" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("connections", "name username profilePicture headline");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error in getPublicProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name", "username", "headline", "about", "location", "profilePicture", "bannerImg",
      "skills", "experience", "education", "socialLinks", "miniProjects", "domain",
    ];

    const updatedData = {};
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) updatedData[f] = req.body[f];
    }

    // Media uploads if base64 (using helper check if needed, but keeping inline for now primarily for Cloudinary logic)
    if (updatedData.profilePicture && updatedData.profilePicture.startsWith("data:image/")) {
      const result = await cloudinary.uploader.upload(updatedData.profilePicture);
      updatedData.profilePicture = result.secure_url;
    }
    if (updatedData.bannerImg && updatedData.bannerImg.startsWith("data:image/")) {
      const result = await cloudinary.uploader.upload(updatedData.bannerImg);
      updatedData.bannerImg = result.secure_url;
    }

    // Prevent duplicate username/email if changed
    if (updatedData.username) {
      const exists = await User.findOne({ username: updatedData.username, _id: { $ne: req.user._id } });
      if (exists) return res.status(409).json({ message: "Username is already taken" });
    }

    if (updatedData.email) {
      const mail = updatedData.email.toLowerCase().trim();
      if (!isValidEmail(mail)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const exists = await User.findOne({ email: mail, _id: { $ne: req.user._id } });
      if (exists) return res.status(409).json({ message: "Email is already registered" });
      updatedData.email = mail;
    }

    console.log("Updating user with:", updatedData);

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true })
      .select("-password");

    res.json(user);
  } catch (error) {
    console.error("❌ Error in updateProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
