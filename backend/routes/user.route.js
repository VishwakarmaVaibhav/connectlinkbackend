import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
  deleteProfile, // Import the deleteProfile controller
} from "../controllers/user.controller.js";

const router = express.Router();

// Existing routes
router.get("/suggestions", protectRoute, getSuggestedConnections);
router.get("/:username", protectRoute, getPublicProfile);
router.put("/profile", protectRoute, updateProfile);

// New route for deleting profile
router.delete("/profile", protectRoute, deleteProfile);

export default router;
