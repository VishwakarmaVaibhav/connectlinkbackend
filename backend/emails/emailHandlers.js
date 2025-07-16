import { transporter, sender } from "../lib/nodemailer.js";
import {
	createCommentNotificationEmailTemplate,
	createConnectionAcceptedEmailTemplate,
	createWelcomeEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
	try {
		const html = createWelcomeEmailTemplate(name, profileUrl);
		await transporter.sendMail({
			from: sender,
			to: email,
			subject: "Welcome to ConnectLink",
			html,
		});
		console.log("✅ Welcome Email sent");
	} catch (error) {
		console.error("❌ Error sending Welcome Email:", error);
	}
};

export const sendCommentNotificationEmail = async (
	recipientEmail,
	recipientName,
	commenterName,
	postUrl,
	commentContent
) => {
	try {
		const html = createCommentNotificationEmailTemplate(
			recipientName,
			commenterName,
			postUrl,
			commentContent
		);
		await transporter.sendMail({
			from: sender,
			to: recipientEmail,
			subject: "New Comment on Your Post",
			html,
		});
		console.log("✅ Comment Notification Email sent");
	} catch (error) {
		console.error("❌ Error sending Comment Notification Email:", error);
	}
};

export const sendVerificationEmail = async (email, name, verificationUrl) => {
	const html = `
	  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
		<h2>Hello ${name},</h2>
		<p>Thank you for signing up for ConnectLink!</p>
		<p>Please verify your email by clicking the button below:</p>
		<a href="${verificationUrl}" 
		   style="display:inline-block; padding: 12px 24px; background:#0044cc; color:#fff; border-radius: 6px; text-decoration:none;">
		  Verify Email
		</a>
		<p>If you did not sign up for ConnectLink, please ignore this email.</p>
		<p>Best regards,<br/>The ConnectLink Team</p>
	  </div>
	`;
  
	try {
	  await transporter.sendMail({
		from: sender,
		to: email,
		subject: "Verify Your Email for ConnectLink",
		html,
	  });
	  console.log("✅ Verification Email sent to", email);
	} catch (error) {
	  console.error("❌ Error sending verification email:", error);
	}
  };

  export const sendResetPasswordEmail = async (email, name, resetUrl) => {
	const html = `
	  <h2>Hello ${name},</h2>
	  <p>You requested to reset your password. Click below to continue:</p>
	  <a href="${resetUrl}" style="padding: 10px 20px; background: #0044cc; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
	  <p>This link will expire in 1 hour.</p>
	  <p>If you didn’t request this, ignore this email.</p>
	`;
  
	await transporter.sendMail({
	  from: sender,
	  to: email,
	  subject: "Reset Your ConnectLink Password",
	  html,
	});
  };
  
  

export const sendConnectionAcceptedEmail = async (
	senderEmail,
	senderName,
	recipientName,
	profileUrl
) => {
	try {
		const html = createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl);
		await transporter.sendMail({
			from: sender,
			to: senderEmail,
			subject: `${recipientName} accepted your connection request`,
			html,
		});
		console.log("✅ Connection Accepted Email sent");
	} catch (error) {
		console.error("❌ Error sending Connection Accepted Email:", error);
	}
};
