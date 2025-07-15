export function createWelcomeEmailTemplate(name, profileUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ConnectLink</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #0044cc, #0066ff); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://instagram.fbom3-1.fna.fbcdn.net/v/t51.2885-19/470350538_1116889710142326_5170610709372578942_n.jpg?_nc_ht=instagram.fbom3-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QFnc005P4RAfLExKlFGZsMtnZw-7rmNwoSlcyuV0b9LP4un3rRByU1gUdmB4e49y1pyKaaoR68r3W09NajkILzD&_nc_ohc=5_itvnH3_YEQ7kNvwEubUOU&_nc_gid=aNjweLAqdzFTpdV5RWl6Gw&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfRq524vvQ8FBQjwXDQjm9eq8eM5ThB3613bgY8IbwVa3g&oe=687A5090&_nc_sid=7d3ac5" alt="ConnectLink Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ConnectLink!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #0044cc;"><strong>Hello ${name},</strong></p>
      <p>We're excited to have you join ConnectLink, your platform to network, collaborate, and grow professionally.</p>
      <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0;"><strong>Get started by:</strong></p>
        <ul style="padding-left: 20px;">
          <li>Setting up your profile</li>
          <li>Connecting with professionals</li>
          <li>Joining discussions and groups</li>
          <li>Exploring new opportunities</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" style="background-color: #0044cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Complete Your Profile</a>
      </div>
      <p>Need help? Our support team is here for you.</p>
      <p>Best regards,<br>The ConnectLink Team</p>
    </div>
  </body>
  </html>
  `;
}

export function createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connection Request Accepted</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #0044cc, #0066ff); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="frontend/public/small-logo.png" alt="ConnectLink Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;"/>
      <h1 style="color: white; margin: 0; font-size: 28px;">Connection Accepted!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #0044cc;"><strong>Hello ${senderName},</strong></p>
      <p>Good news! <strong>${recipientName}</strong> has accepted your connection request on ConnectLink.</p>
      <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0;"><strong>Next steps:</strong></p>
        <ul style="padding-left: 20px;">
          <li>Check out ${recipientName}'s profile</li>
          <li>Start a conversation</li>
          <li>Discover shared connections and interests</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" style="background-color: #0044cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View ${recipientName}'s Profile</a>
      </div>
      <p>Expanding your network opens new doors. Keep connecting!</p>
      <p>Best regards,<br>The ConnectLink Team</p>
    </div>
  </body>
  </html>
  `;
}
export function createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Comment on Your Post</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #0044cc, #0066ff); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://res.cloudinary.com/demo/image/upload/v1712345678/connectlink-logo.png" alt="ConnectLink Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;" />
      <h1 style="color: white; margin: 0; font-size: 28px;">New Comment on Your Post</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #0044cc;"><strong>Hello ${recipientName},</strong></p>
      <p><strong>${commenterName}</strong> has commented on your post:</p>
      <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-style: italic; margin: 0;">"${commentContent}"</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${postUrl}" style="background-color: #0044cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">View Comment</a>
      </div>
      <p>Stay engaged and keep the conversation going!</p>
      <p>Best regards,<br />The ConnectLink Team</p>
    </div>
  </body>
  </html>
  `;
}
