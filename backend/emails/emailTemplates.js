export function createWelcomeEmailTemplate(name, profileUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ConnectLink</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; padding: 20px 10px !important; }
        .header { padding: 30px 15px !important; }
        .content { padding: 30px 20px !important; }
        .hero-text { font-size: 24px !important; }
      }
    </style>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; margin: 0; padding: 0;">
    <div style="background-color: #f3f4f6; padding: 40px 0;">
      <table class="container" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <!-- Header -->
        <tr>
          <td class="header" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
            <img src="https://instagram.fbom3-1.fna.fbcdn.net/v/t51.2885-19/470350538_1116889710142326_5170610709372578942_n.jpg?_nc_ht=instagram.fbom3-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QFnc005P4RAfLExKlFGZsMtnZw-7rmNwoSlcyuV0b9LP4un3rRByU1gUdmB4e49y1pyKaaoR68r3W09NajkILzD&_nc_ohc=5_itvnH3_YEQ7kNvwEubUOU&_nc_gid=aNjweLAqdzFTpdV5RWl6Gw&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AfRq524vvQ8FBQjwXDQjm9eq8eM5ThB3613bgY8IbwVa3g&oe=687A5090&_nc_sid=7d3ac5" alt="ConnectLink" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid rgba(255, 255, 255, 0.2); margin-bottom: 20px; display: inline-block;">
            <h1 class="hero-text" style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome Aboard! 🎉</h1>
            <p style="color: #bfdbfe; font-size: 18px; margin-top: 10px; margin-bottom: 0;">We're thrilled to have you, ${name}.</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td class="content" style="padding: 40px 40px 30px;">
            <p style="font-size: 16px; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; margin-bottom: 24px;">Thank you for joining <strong>ConnectLink</strong>. You've just taken the first step towards building a stronger professional network.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
              <p style="margin: 0; font-weight: 600; color: #1e3a8a; margin-bottom: 15px;">Here's how to get started:</p>
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td style="padding-bottom: 10px;"><span style="color: #2563eb; font-size: 20px; margin-right: 10px;">•</span> Connect with colleagues and alumni</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;"><span style="color: #2563eb; font-size: 20px; margin-right: 10px;">•</span> Showcase your latest projects</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 0;"><span style="color: #2563eb; font-size: 20px; margin-right: 10px;">•</span> Join industry conversations</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${profileUrl}" style="background-color: #2563eb; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25);">Complete Your Profile</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
              Ready to grow your career? <br> The ConnectLink Team
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} ConnectLink. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
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
    <title>Connection Accepted</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; padding: 20px 10px !important; }
      }
    </style>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; margin: 0; padding: 0;">
    <div style="background-color: #f3f4f6; padding: 40px 0;">
      <table class="container" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="background-color: #10b981; padding: 30px 20px; text-align: center;">
            <div style="background-color: rgba(255, 255, 255, 0.2); width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
               <span style="font-size: 32px; line-height: 64px; display: block;">🤝</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">New Connection!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px;">
            <p style="font-size: 16px; margin-bottom: 24px;">Hello <strong>${senderName}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 24px;">Great news! <strong>${recipientName}</strong> accepted your connection request.</p>
            
            <div style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
              <p style="color: #047857; margin: 0; font-weight: 500;">Your network is growing!</p>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${profileUrl}" style="background-color: #10b981; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);">View Profile</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              Keep the momentum going by sending a message!
            </p>
          </td>
        </tr>
      </table>
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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Comment</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; padding: 20px 10px !important; }
      }
    </style>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6; margin: 0; padding: 0;">
    <div style="background-color: #f3f4f6; padding: 40px 0;">
      <table class="container" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="background-color: #8b5cf6; padding: 30px 20px; text-align: center;">
             <div style="background-color: rgba(255, 255, 255, 0.2); width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
               <span style="font-size: 32px; line-height: 64px; display: block;">💬</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">New Comment</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${recipientName}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 24px;"><strong>${commenterName}</strong> shared their thoughts on your post:</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #8b5cf6; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
              <p style="font-style: italic; color: #4b5563; margin: 0; font-size: 16px;">"${commentContent}"</p>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${postUrl}" style="background-color: #8b5cf6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.25);">Reply Now</a>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
}
