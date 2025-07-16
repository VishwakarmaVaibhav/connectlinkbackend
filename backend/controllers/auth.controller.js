import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail , sendVerificationEmail } from "../emails/emailHandlers.js";
import crypto from "crypto";
import validator from "validator"; // install with `npm i validator`

const isProduction = process.env.NODE_ENV === "production";


export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Basic validation (add more as needed)
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format (assumed already done)

    // Check if user/email exists (assumed already done)

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Create user with email verification token
    const user = new User({
      name: name.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken,
    });

    await user.save();

    // Prepare verification URL — make sure CLIENT_URL has trailing slash handled
    const verificationUrl = `${process.env.CLIENT_URL.replace(/\/$/, "")}/verify-email?token=${emailVerificationToken}`;

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationUrl);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    // Send success response
    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const login = async (req, res) => {
	try {
		const { usernameOrEmail, password } = req.body;

		const user = await User.findOne({
			$or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		if (!user.isEmailVerified) {
			return res.status(401).json({ message: "Please verify your email before logging in." });
		  }
		  

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

		res.cookie("jwt-ConnectLink", token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? "None" : "Lax",
			maxAge: 3 * 24 * 60 * 60 * 1000,
		});

		res.json({ message: "Logged in successfully" });
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
  
	  if (!user) {
		return res.status(400).json({ message: "Invalid or expired token" });
	  }
  
	  user.isEmailVerified = true;
	  user.emailVerificationToken = null;
	  await user.save();
  
	  res.json({ message: "Email verified successfully!" });
	} catch (error) {
	  res.status(500).json({ message: "Server error" });
	}
  };
  
  import { sendResetPasswordEmail } from "../emails/emailHandlers.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendResetPasswordEmail(user.email, user.name, resetUrl);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
	const { token, newPassword } = req.body;
  
	try {
	  const user = await User.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() },
	  });
  
	  if (!user) {
		return res.status(400).json({ message: "Invalid or expired token" });
	  }
  
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
	  user.password = hashedPassword;
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
