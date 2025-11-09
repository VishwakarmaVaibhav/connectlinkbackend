// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Accept cookie OR Authorization header
    const cookieToken = req.cookies?.["jwt-ConnectLink"];
    const auth = req.headers.authorization;
    const headerToken = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      const msg =
        e.name === "TokenExpiredError" || e.name === "JsonWebTokenError"
          ? "Unauthorized - Invalid or expired token"
          : "Unauthorized";
      return res.status(401).json({ message: msg });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    return next();
  } catch (err) {
    console.error("protectRoute error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
