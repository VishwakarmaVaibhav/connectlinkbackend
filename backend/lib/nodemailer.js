import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,       // smtp.gmail.com
  port: Number(process.env.MAIL_PORT), // 587
  secure: process.env.MAIL_SECURE === "true", // false
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,   // 10 seconds
});

export const sender = {
  name: process.env.EMAIL_FROM_NAME || "ConnectLink",
  address: process.env.EMAIL_FROM || "no-reply@connectlink.com",
};

// ✅ Debug: Verify connection on startup
console.log("📧 Attempting SMTP Connection with config:", {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  user: process.env.MAIL_USER ? "*****" : "MISSING",
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error);
  } else {
    console.log("✅ SMTP Server Ready from:", process.env.MAIL_HOST);
  }
});