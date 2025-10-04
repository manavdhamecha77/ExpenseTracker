# Admin Dashboard System - Setup Guide

## 🎯 Overview

The ExpenseFlow admin dashboard system allows companies to:
- Register and create their organization
- Verify email with 6-digit hexadecimal company ID
- Manage employees with role-based access
- Send auto-generated passwords via email
- Track employee-manager relationships

## 📁 Files Created

### Pages
- `/app/company/create/page.js` - Company registration with email verification
- `/app/company/login/page.js` - Company admin login
- `/app/company/forgot-password/page.js` - Password reset functionality
- `/app/admin/dashboard/page.js` - Employee management dashboard

### API Routes
- `/app/api/company/create/route.js` - Handle company registration
- `/app/api/company/verify-email/route.js` - Email verification and company ID generation
- `/app/api/admin/employees/route.js` - GET/POST employee data
- `/app/api/admin/employees/[id]/route.js` - DELETE employee
- `/app/api/admin/send-password/route.js` - Send auto-generated passwords

### Utilities
- `/lib/email.js` - NodeMailer configuration and email templates

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install nodemailer
```

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# SMTP Email Configuration (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# NextAuth URL
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Gmail Setup (Recommended)

1. Enable 2-factor authentication on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an "App Password" for "Mail"
4. Use the 16-character password as `SMTP_PASS`

### 4. Alternative SMTP Providers

#### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

#### Mailgun
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-smtp-user"
SMTP_PASS="your-mailgun-smtp-password"
```

#### AWS SES
```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-smtp-user"
SMTP_PASS="your-ses-smtp-password"
```

### 5. Update NextAuth Configuration

Update `/app/api/auth/[...nextauth]/route.js` to include company ID in credentials:

```javascript
CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: "Email", type: "email" },
    companyId: { label: "Company ID", type: "text" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    // Verify company ID along with email and password
    const user = await prisma.user.findFirst({
      where: {
        email: credentials.email,
        companyId: credentials.companyId,
      },
      include: { company: true }
    })
    
    if (user && await bcrypt.compare(credentials.password, user.password)) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      }
    }
    return null
  }
})
```

### 6. Run Database Migration

```bash
npx prisma generate
npx prisma db push
```

### 7. Start Development Server

```bash
npm run dev
```

## 🚀 User Flow

### Company Registration
1. Navigate to `/company/create`
2. Fill in company name, email, password
3. Receive 6-digit verification code via email
4. Enter code to verify email
5. Receive company ID via email (6-digit hexadecimal)
6. Use email, company ID, and password to sign in

### Admin Dashboard
1. Navigate to `/company/login`
2. Sign in with email, company ID, password
3. Access admin dashboard at `/admin/dashboard`
4. View employee statistics
5. Add employees with roles (Employee, Manager, Approver)
6. Assign managers to employees
7. Click "Send Password" to email auto-generated credentials

### Employee Onboarding
1. Admin adds employee via dashboard
2. Admin clicks "Send Password" button
3. Employee receives email with:
   - Email address
   - Company ID
   - Temporary 8-character password
4. Employee signs in at `/auth/login`
5. Employee can change password using "Forgot Password"

## 🎨 Design Features

All pages maintain consistency with the homepage design:
- ✅ Playfair Display font for headings
- ✅ Deep Blue (#0A2540) primary color
- ✅ Teal (#00D4B3) accent color
- ✅ Animated gradient backgrounds
- ✅ Blur orbs and glassmorphism effects
- ✅ Smooth transitions and hover states
- ✅ Responsive design for mobile/tablet/desktop

## 📧 Email Templates

The system sends 3 types of emails:

1. **Verification Email** - 6-digit code for email verification
2. **Company ID Email** - Success message with company ID
3. **Employee Password Email** - Login credentials for new employees

All emails feature:
- Professional HTML templates
- ExpenseFlow branding
- Clear call-to-action buttons
- Security notices
- Responsive design

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Email verification before company creation
- ✅ Unique 6-digit hexadecimal company IDs
- ✅ Auto-generated secure passwords (8 characters)
- ✅ Role-based access control (RBAC)
- ✅ Session-based authentication
- ✅ Admin-only API endpoints

## 📊 Database Schema

The system uses the existing Prisma schema with:
- `Company` model with custom ID
- `User` model with role and company relationship
- `EmployeeManager` model for manager assignments
- Role enum: ADMIN, MANAGER, EMPLOYEE, APPROVER

## 🐛 Troubleshooting

### Email not sending
- Verify SMTP credentials in `.env`
- Check if 2FA is enabled (Gmail)
- Ensure app password is correct
- Check spam/junk folder

### Company ID collision
- System automatically regenerates if collision detected
- Uses crypto-secure random generation

### Authentication issues
- Verify company ID is uppercase
- Check database for user record
- Ensure password is hashed correctly

## 📝 Next Steps

1. Test email functionality with your SMTP provider
2. Customize email templates in `/lib/email.js`
3. Add password complexity requirements
4. Implement password reset via email
5. Add employee profile pictures
6. Enhance role permissions
7. Add audit logging for admin actions

## 🎯 Testing

Test the complete flow:

```bash
# 1. Create company
Visit: http://localhost:3000/company/create

# 2. Check email for verification code
# 3. Verify email and receive company ID
# 4. Sign in
Visit: http://localhost:3000/company/login

# 5. Access dashboard
Auto-redirect to: http://localhost:3000/admin/dashboard

# 6. Add employees and send passwords
```

## 📚 Additional Resources

- [NodeMailer Documentation](https://nodemailer.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
