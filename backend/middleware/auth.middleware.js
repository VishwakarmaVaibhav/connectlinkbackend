import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract token from Authorization header or cookies
    let token = req.cookies["jwt-ConnectLink"] || req.headers["authorization"];

    // If the token is in the Authorization header, remove the 'Bearer ' prefix
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    // If no token is found, return Unauthorized error
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging - log decoded information (useful for development)
    console.log("Decoded token:", decoded);

    // Find the user based on the decoded userId from the token
    const user = await User.findById(decoded.userId).select("-password");

    // If no user is found or the token is invalid, return Unauthorized error
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User Not Found" });
    }

    // Attach user object to the request
    req.user = user;
    next();
  } catch (error) {
    // Handle different error scenarios
    if (error.name === "JsonWebTokenError") {
      // Token is malformed
      return res.status(400).json({ message: "Unauthorized - Invalid Token" });
    }

    if (error.name === "TokenExpiredError") {
      // Token has expired
      return res.status(401).json({ message: "Unauthorized - Token Expired" });
    }

    // General error handling
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
