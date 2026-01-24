import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";
import { getPostsByUsername } from "../controllers/post.controller.js";
import {
	createPost,
	getFeedPosts,
	deletePost,
	getPostById,
	createComment,
	likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", optionalAuth, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.post("/:id/comment", protectRoute, createComment);
router.post("/:id/like", protectRoute, likePost);
router.get("/user/:username", optionalAuth, getPostsByUsername);
router.get("/:id", optionalAuth, getPostById);

export default router;
