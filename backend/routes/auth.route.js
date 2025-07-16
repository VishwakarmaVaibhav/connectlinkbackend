import express from "express";
import { login, logout, signup, getCurrentUser,verifyEmail ,forgotPassword , resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// routes/auth.route.js
router.get("/verify-email", verifyEmail);
// routes/auth.routes.js
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


router.get("/me", protectRoute, getCurrentUser);

export default router;
