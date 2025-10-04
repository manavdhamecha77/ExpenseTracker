# Simplified Admin Dashboard Flow

## 🎯 Overview

The admin dashboard system has been simplified to remove email verification steps. Users now go directly from onboarding to the admin dashboard.

## 📋 Updated Flow

### 1. Onboarding Process
- Navigate to `/onboard`
- Complete 4-step onboarding:
  1. **Company Details** - Company name, description, industry
  2. **Admin Account** - Admin name, email, password
  3. **Location & Currency** - Country, currency selection
  4. **Confirmation** - Review and submit

### 2. Automatic Sign-In
- After completing onboarding, user is automatically signed in
- No email verification required
- Redirects directly to `/admin/dashboard`

### 3. Admin Dashboard
- Full employee management system
- Add employees with roles (ADMIN, MANAGER, EMPLOYEE, APPROVER)
- Assign managers to employees
- Send auto-generated passwords via email
- View company statistics

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DATABASE_URL="file:./dev.db"
DB_PROVIDER="sqlite"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# SMTP Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="4322"  # Non-standard port - verify with email provider
SMTP_SECURE="false"
SMTP_USER="arshadkhatib130506@gmail.com"
SMTP_PASS="your-app-password-here"
```

### Setting Up Gmail SMTP

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA

2. **Generate App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - Create new app password for "Mail"
   - Copy the 16-character password

3. **Update .env**
   - Replace `your-app-password-here` with the generated password

### ⚠️ Important Notes

- **Port 4322**: This is a non-standard SMTP port. Standard ports are:
  - `587` - TLS (recommended)
  - `465` - SSL
  - `25` - Unencrypted
  
  If you encounter connection issues, try changing to port 587.

## 🚀 Usage

### Start the Application

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

### Access Points

- **Homepage**: http://localhost:3000
- **Onboarding**: http://localhost:3000/onboard
- **Login** (if needed): http://localhost:3000/auth/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 📧 Email Functionality

The system sends emails for:
- Employee password notifications (when admin clicks "Send Password")

Email templates are located in `/lib/email.js` and can be customized.

## 🎨 Features

### Admin Dashboard
- ✅ View company statistics (total employees, managers, active users)
- ✅ Add new employees with role selection
- ✅ Assign managers to employees
- ✅ Send auto-generated 8-character passwords
- ✅ Search and filter employees
- ✅ Edit and delete employees
- ✅ Consistent UI/UX with homepage design

### Design Elements
- Playfair Display font for headings
- Deep Blue (#0A2540) primary color
- Teal (#00D4B3) accent color
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Session-based authentication with NextAuth
- Admin-only API endpoints
- Auto-generated secure passwords

## 📝 What Was Changed

### Removed Features
- ❌ `/company/create` page (email verification process)
- ❌ `/company/login` page (separate company login)
- ❌ Email verification codes
- ❌ Company ID email notifications

### Modified Features
- ✅ Onboarding now auto-signs in user
- ✅ Direct redirect to admin dashboard after onboarding
- ✅ Simplified flow: Onboard → Dashboard

### Kept Features
- ✅ Employee password emails
- ✅ Admin dashboard functionality
- ✅ Employee management
- ✅ Role assignments
- ✅ Manager relationships

## 🐛 Troubleshooting

### Email Not Sending
1. Verify SMTP credentials in `.env`
2. Check if 2FA is enabled on Gmail
3. Confirm app password is correct
4. Try changing port to 587
5. Check spam/junk folder

### Login Issues
1. Clear browser cookies/cache
2. Verify user was created in database
3. Check console for errors
4. Ensure NextAuth is configured properly

### Database Issues
```bash
# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio
```

## 📚 Next Steps

1. Update `.env` with your actual Gmail app password
2. Test the onboarding flow
3. Test employee addition and password sending
4. Customize email templates if needed
5. Add additional features as required

## 🎯 Quick Test

1. Go to http://localhost:3000/onboard
2. Fill in all 4 steps
3. Click "Complete Setup"
4. You should be automatically redirected to /admin/dashboard
5. Try adding an employee and sending them a password

---

For more details, see the main README.md file.
