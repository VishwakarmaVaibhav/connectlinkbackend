// controllers/user.controller.js
import mongoose from "mongoose";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

/**
 * Suggest users the current user is not connected to.
 * - Excludes self
 * - Excludes existing connections
 * - Optional ?limit=3
 */
export const getSuggestedConnections = async (req, res) => {
  try {
    const current = await User.findById(req.user._id).select("connections");
    const existing = current?.connections || [];

    const limit = Math.max(1, Math.min(10, Number(req.query.limit) || 3));

    const suggestions = await User.find({
      _id: { $ne: req.user._id, $nin: existing },
    })
      .select("name username profilePicture headline")
      .limit(limit);

    return res.json(suggestions);
  } catch (error) {
    console.error("getSuggestedConnections error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Permanently delete the current user's profile.
 * Note: If you store posts, likes, etc., consider cascading deletes here.
 */
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // TODO (optional): remove this user from other users' connections,
    // delete Cloudinary assets, posts, etc.

    return res.json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error("deleteProfile error:", error);
    return res.status(500).json({ message: "Error deleting profile" });
  }
};

/**
 * Public profile by username
 */
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (error) {
    console.error("getPublicProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update profile. Handles base64 images with Cloudinary and
 * prevents duplicate username/email.
 */
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "profilePicture",
      "bannerImg",
      "skills",
      "experience",
      "education",
      "socialLinks",
      "miniProjects",
      "domain",
      // Optional email change support below (see validation)
      "email",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Enforce unique username/email if they are being changed
    if (updates.username) {
      updates.username = String(updates.username).trim();
      const exists = await User.findOne({
        _id: { $ne: req.user._id },
        username: updates.username,
      }).select("_id");
      if (exists) return res.status(409).json({ message: "Username is already taken" });
    }

    if (updates.email) {
      updates.email = String(updates.email).toLowerCase().trim();
      const exists = await User.findOne({
        _id: { $ne: req.user._id },
        email: updates.email,
      }).select("_id");
      if (exists) return res.status(409).json({ message: "Email is already registered" });
    }

    // If images are base64, upload to Cloudinary
    if (typeof updates.profilePicture === "string" && updates.profilePicture.startsWith("data:image/")) {
      const up = await cloudinary.uploader.upload(updates.profilePicture);
      updates.profilePicture = up.secure_url;
    }
    if (typeof updates.bannerImg === "string" && updates.bannerImg.startsWith("data:image/")) {
      const up = await cloudinary.uploader.upload(updates.bannerImg);
      updates.bannerImg = up.secure_url;
    }

    // Defensive: only set provided fields; keep validators
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json(user);
  } catch (error) {
    // Catch unique key races as a fallback
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || { username: 1 })[0];
      return res.status(409).json({ message: `${field} is already taken` });
    }
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
