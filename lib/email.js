import nodemailer from 'nodemailer'

// Feature flag for email sending based on env presence
const EMAIL_ENABLED = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)

// Create reusable transporter only if email is enabled
let transporter = null
if (EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Generate random 6-digit hexadecimal company ID
export function generateCompanyId() {
  return Math.random().toString(16).substring(2, 8).toUpperCase()
}

// Generate random 8-character password
export function generateRandomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Generate random 6-digit verification code
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send company verification email
export async function sendCompanyVerificationEmail(email, companyName, verificationCode) {
  const mailOptions = {
    from: `"ExpenseFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Company - ExpenseFlow',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A2540 0%, #0A2540 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: #00D4B3; margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px solid #00D4B3; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #0A2540; letter-spacing: 5px; }
            .button { display: inline-block; background: #00D4B3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 ExpenseFlow</h1>
            </div>
            <div class="content">
              <h2>Welcome to ExpenseFlow, ${companyName}!</h2>
              <p>Thank you for creating your company account. To complete your registration, please verify your email address using the code below:</p>
              
              <div class="code-box">
                <div class="code">${verificationCode}</div>
              </div>
              
              <p>This verification code will expire in 10 minutes.</p>
              
              <p>If you didn't create this account, please ignore this email.</p>
              
              <div class="footer">
                <p>© 2025 ExpenseFlow. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  if (!EMAIL_ENABLED) {
    console.warn('[email] SMTP is not configured; skipping sendCompanyVerificationEmail')
    return
  }
  await transporter.sendMail(mailOptions)
}

// Send company ID email after successful verification
export async function sendCompanyIdEmail(email, companyName, companyId) {
  const mailOptions = {
    from: `"ExpenseFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Company ID - ExpenseFlow',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A2540 0%, #0A2540 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: #00D4B3; margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .id-box { background: white; border: 3px solid #00D4B3; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0; }
            .company-id { font-size: 36px; font-weight: bold; color: #00D4B3; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #00D4B3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Company Created Successfully!</h1>
            </div>
            <div class="content">
              <h2>Congratulations, ${companyName}!</h2>
              <p>Your company has been successfully registered on ExpenseFlow. Below is your unique Company ID:</p>
              
              <div class="id-box">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Company ID</p>
                <div class="company-id">${companyId}</div>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> Save this Company ID securely. You will need it along with your email and password to sign in to your admin dashboard.
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Sign in to your admin dashboard using your email, Company ID, and password</li>
                <li>Add your team members and assign roles</li>
                <li>Configure your approval workflows</li>
                <li>Start managing expenses efficiently!</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/company/login" class="button">Sign In Now</a>
              </div>
              
              <div class="footer">
                <p>© 2025 ExpenseFlow. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  if (!EMAIL_ENABLED) {
    console.warn('[email] SMTP is not configured; skipping sendCompanyIdEmail')
    return
  }
  await transporter.sendMail(mailOptions)
}

// Send employee password email
export async function sendEmployeePasswordEmail(email, name, password, companyId) {
  const mailOptions = {
    from: `"ExpenseFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your ExpenseFlow Account Credentials',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A2540 0%, #0A2540 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: #00D4B3; margin: 0; font-size: 28px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials-box { background: white; border: 2px solid #00D4B3; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .credential-item { padding: 10px; border-bottom: 1px solid #e0e0e0; }
            .credential-item:last-child { border-bottom: none; }
            .credential-label { color: #666; font-size: 12px; text-transform: uppercase; }
            .credential-value { color: #0A2540; font-size: 18px; font-weight: bold; font-family: 'Courier New', monospace; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #00D4B3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Welcome to ExpenseFlow!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your admin has added you to their ExpenseFlow organization. Below are your login credentials:</p>
              
              <div class="credentials-box">
                <div class="credential-item">
                  <div class="credential-label">Email</div>
                  <div class="credential-value">${email}</div>
                </div>
                <div class="credential-item">
                  <div class="credential-label">Company ID</div>
                  <div class="credential-value">${companyId}</div>
                </div>
                <div class="credential-item">
                  <div class="credential-label">Temporary Password</div>
                  <div class="credential-value">${password}</div>
                </div>
              </div>
              
              <div class="warning">
                <strong>🔒 Security Notice:</strong> For your security, please change your password immediately after your first login using the "Forgot Password" option.
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/auth/login" class="button">Sign In Now</a>
              </div>
              
              <p><strong>Getting Started:</strong></p>
              <ul>
                <li>Sign in using your email, company ID, and the temporary password above</li>
                <li>Change your password to something secure</li>
                <li>Complete your profile information</li>
                <li>Start submitting and managing expenses!</li>
              </ul>
              
              <div class="footer">
                <p>© 2025 ExpenseFlow. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  if (!EMAIL_ENABLED) {
    console.warn('[email] SMTP is not configured; skipping sendEmployeePasswordEmail')
    return
  }
  await transporter.sendMail(mailOptions)
}

export default transporter
