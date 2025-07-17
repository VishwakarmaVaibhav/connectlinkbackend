import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sender = {
  name: process.env.EMAIL_FROM_NAME || "ConnectLink",
  address: process.env.EMAIL_FROM || "no-reply@connectlink.com",
};
