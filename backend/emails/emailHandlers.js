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
