// middleware/optionalAuth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
	try {
		const token = req.cookies["jwt-ConnectLink"];

		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findById(decoded.userId).select("-password");
			if (user) {
				req.user = user; // Attach user only if valid
			}
		}
	} catch (err) {
		// If token is invalid, skip user attach
		console.warn("Optional auth: invalid token");
	}

	next(); // Always continue
};
