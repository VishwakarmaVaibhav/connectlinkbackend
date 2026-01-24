import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
	try {
		const cookieToken = req.cookies?.["jwt-ConnectLink"];
		const auth = req.headers.authorization;
		const headerToken = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : null;
		const token = cookieToken || headerToken;

		if (!token) {
			req.user = null;
			return next();
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (e) {
			// Invalid token, treat as guest
			req.user = null;
			return next();
		}

		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			req.user = null;
			return next();
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Error in optionalAuth middleware:", error);
		// Be safe, treat as guest on error, or fail? Failing might be safer for "optional" but 
		// strictly speaking if it crashes we might want to know. 
		// For optional auth, letting it proceed as guest is usually fine if something obscure fails.
		req.user = null;
		next();
	}
};
