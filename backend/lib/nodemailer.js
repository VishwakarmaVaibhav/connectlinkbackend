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
});

export const sender = {
  name: process.env.EMAIL_FROM_NAME || "ConnectLink",
  address: process.env.EMAIL_FROM || "no-reply@connectlink.com",
};