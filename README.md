# Oddo Hackathon App 🚀

A production-ready Next.js application with authentication, modern UI, and everything you need to build amazing apps fast.

## ✨ Features

- **🔐 Complete Authentication System**
  - Email/Password (Credentials) with bcryptjs hashing
  - Google OAuth integration
  - Protected routes and session management
  - User registration with validation

- **🎨 Modern UI with ShadCN UI**
  - Beautiful, accessible components
  - Tailwind CSS for styling
  - Responsive design (mobile-first)
  - Professional homepage and dashboard

- **🗄️ Database Ready**
  - Prisma ORM with SQLite (default)
  - Easy PostgreSQL migration for production
  - User management and session storage

- **⚡ Developer Experience**
  - Next.js 14 with App Router
  - TypeScript-free (JavaScript only)
  - Hot reload and fast development

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + ShadCN UI
- **Authentication:** NextAuth.js
- **Database:** Prisma + SQLite (development)
- **Language:** JavaScript
- **Icons:** Lucide React

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd oddo-hackathon

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
```

**Required environment variables:**

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_random_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma migrate dev --name init

# Optional: View database
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

## 📁 Project Structure

```
oddo-hackathon/
├── app/                          # Next.js App Router
│   ├── api/auth/                 # Authentication API routes
│   ├── auth/                     # Login/Register pages
│   ├── dashboard/                # Protected dashboard
│   ├── layout.js                 # Root layout
│   └── page.js                   # Homepage
├── components/
│   ├── ui/                       # ShadCN UI components
│   └── Navbar.js                 # Navigation component
├── lib/
│   ├── prisma.js                 # Database client
│   └── utils.js                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
└── styles/
    └── globals.css               # Global styles
```

## 🗄️ Database Migration to PostgreSQL

### For Production (Supabase, Railway, etc.)

1. **Update Prisma schema** (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Update environment**:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

3. **Deploy schema**:
```bash
npx prisma db push
# OR for migrations
npx prisma migrate deploy
```

### Example PostgreSQL URLs:
```env
# Supabase
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Railway
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/railway"

# Local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
```

## 🔒 Authentication Flow

1. **Registration** (`/auth/register`):
   - User fills form → API validates → Password hashed → User created → Auto-login

2. **Login** (`/auth/login`):
   - Credentials or Google OAuth → NextAuth handles → Session created → Redirect to dashboard

3. **Protected Routes**:
   - Server-side session check → Redirect if not authenticated

## 🎯 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production:
- `DATABASE_URL` (PostgreSQL)
- `NEXTAUTH_SECRET` (generate new)
- `NEXTAUTH_URL` (your domain)
- `GOOGLE_CLIENT_ID` (if using)
- `GOOGLE_CLIENT_SECRET` (if using)

## 🧪 Testing Checklist

- [ ] User registration works
- [ ] Email/password login works
- [ ] Google OAuth works (if configured)
- [ ] Protected routes redirect correctly
- [ ] Session persists across page reloads
- [ ] Logout works properly
- [ ] Responsive design on mobile
- [ ] Database operations work

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [Next.js documentation](https://nextjs.org/docs)
- Visit [NextAuth.js documentation](https://next-auth.js.org/)
- Explore [ShadCN UI components](https://ui.shadcn.com/)

---

**Happy Hacking! 🎉**

Built with ❤️ for hackathons and rapid prototyping.