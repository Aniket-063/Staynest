const nodemailer = require('nodemailer')

/**
 * Creates nodemailer transporter.
 * If EMAIL_USER and EMAIL_PASS are set in .env, sends real email via SMTP.
 * Otherwise logs link to console for easy development/testing without crashing.
 */
function getTransporter() {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // port 587 pe false hi rehta hai
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  return null
}

/**
 * Sends branded verification email with verification link.
 */
async function sendVerificationEmail({ to, name, verificationUrl }) {
  const transporter = getTransporter()

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your StayNest account</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .wrapper { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #f43f5e; padding: 28px 24px; text-align: center; }
        .logo { font-size: 26px; font-weight: 800; color: #ffffff; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .content { padding: 36px 32px; }
        h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
        p { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
        .btn-container { text-align: center; margin: 32px 0; }
        .btn { background-color: #f43f5e; color: #ffffff !important; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(244,63,94,0.3); }
        .notice { font-size: 13px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 28px; }
        .link-text { word-break: break-all; color: #f43f5e; font-size: 13px; }
        .footer { background: #f8fafc; text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo">🏡 StayNest</div>
        </div>
        <div class="content">
          <h1>Verify your email address</h1>
          <p>Hi <strong>${name || 'Traveler'}</strong>,</p>
          <p>Thank you for joining StayNest! To complete your registration and start booking unique stays worldwide, please confirm your email address by clicking the button below:</p>
          
          <div class="btn-container">
            <a href="${verificationUrl}" target="_blank" class="btn">Verify Email Address</a>
          </div>

          <p>This verification link is valid for <strong>24 hours</strong>. If you did not create a StayNest account, you can safely ignore this email.</p>

          <div class="notice">
            <p style="margin-bottom: 8px;">If the button above does not work, copy and paste this link into your browser:</p>
            <a href="${verificationUrl}" class="link-text">${verificationUrl}</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} StayNest Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `

  if (!transporter) {
    console.log('\n============================================================')
    console.log('📧 [EMAIL SIMULATION - SMTP NOT CONFIGURED]')
    console.log(`To: ${to}`)
    console.log(`Subject: Verify your StayNest account`)
    console.log(`🔗 Verification Link: ${verificationUrl}`)
    console.log('💡 Note: Set EMAIL_USER & EMAIL_PASS in server/.env to send real emails.')
    console.log('============================================================\n')
    return { success: true, simulated: true }
  }

  const mailOptions = {
    from: `"StayNest" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: '🏡 Verify your StayNest account',
    html: htmlContent,
  }

  const info = await transporter.sendMail(mailOptions)
  return { success: true, messageId: info.messageId }
}

module.exports = { sendVerificationEmail }
