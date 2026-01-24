import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	deleteNotification,
	deleteNotifications,
	getUserNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();


router.get("/", protectRoute, getUserNotifications);

router.put("/read", protectRoute, markAllNotificationsAsRead);
router.put("/:id/read", protectRoute, markNotificationAsRead);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
