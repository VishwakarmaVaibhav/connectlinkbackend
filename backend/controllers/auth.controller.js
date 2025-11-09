// controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendResetPasswordEmail } from "../emails/emailHandlers.js";

const isProduction = process.env.NODE_ENV === "production";
const ALLOW_UNVERIFIED_LOGIN = process.env.ALLOW_UNVERIFIED_LOGIN === "true";

// Helper: safe public user
const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  username: u.username,
  email: u.email,
  profilePicture: u.profilePicture,
  headline: u.headline,
  location: u.location,
  domain: u.domain,
  isEmailVerified: u.isEmailVerified,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Pre-check duplicates (avoid E11000 -> 500 UX)
    const [u1, u2] = await Promise.all([
      User.findOne({ username: username.trim() }),
      User.findOne({ email: email.toLowerCase().trim() })
    ]);
    if (u1) return res.status(409).json({ message: "Username is already taken" });
    if (u2) return res.status(409).json({ message: "Email is already registered" });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name: name.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken,
    });

    // Respond immediately; do not block on email
    const body = { message: "User registered. Please verify your email to log in." };
    if (ALLOW_UNVERIFIED_LOGIN) {
      body.token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
      body.user = publicUser(user);
    }
    res.status(201).json(body);

    // Fire-and-forget email
    const base = (process.env.CLIENT_URL || "").replace(/\/$/, "");
    const verificationUrl = `${base}/verify-email?token=${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.name, verificationUrl)
      .catch(err => console.error("Error sending verification email:", err));

  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || { username: 1 })[0];
      return res.status(409).json({ message: `${field} is already taken` });
    }
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail.toLowerCase() }, { username: usernameOrEmail }]
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified && !ALLOW_UNVERIFIED_LOGIN) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("jwt-ConnectLink", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Also return token so FE can use Authorization header if cookies don’t stick
    res.json({ message: "Logged in successfully", token, user: publicUser(user) });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt-ConnectLink", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });
  res.json({ message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const email = (req.body.email || "").toLowerCase().trim();
  try {
    const user = await User.findOne({ email });
    // Always respond 200 to avoid user enumeration
    if (!user) return res.json({ message: "If that email exists, a reset link has been sent." });

    const raw = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1h
    await user.save({ validateBeforeSave: false });

    const base = (process.env.CLIENT_URL || "").replace(/\/$/, "");
    const resetUrl = `${base}/reset-password?token=${raw}`;

    // fire-and-forget
    sendResetPasswordEmail(user.email, user.name, resetUrl)
      .catch(err => console.error("FORGOT-PASSWORD EMAIL ERROR:", err));

    return res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    // Still say success
    return res.json({ message: "If that email exists, a reset link has been sent." });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
