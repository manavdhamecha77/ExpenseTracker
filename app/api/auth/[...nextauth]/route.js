import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  // adapter: PrismaAdapter(prisma), // Commented out for JWT strategy
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        companyId: { label: "Company ID", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.companyId) {
          return null;
        }

        // First verify company exists
        const company = await prisma.company.findUnique({
          where: {
            id: credentials.companyId
          }
        });

        if (!company) {
          throw new Error('Invalid company ID');
        }

        // Then find user within that company
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            companyId: credentials.companyId
          },
          include: {
            company: true,
            reportsTo: { include: { manager: true } },
            managerOf: { include: { employee: true } }
          }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          company: user.company
        };
      }
    })
  ],
  session: { 
    strategy: "jwt", // Temporarily using JWT for better session sync
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the user data to the token right after signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.companyId = user.companyId;
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.companyId = token.companyId;
        session.user.company = token.company;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  events: {
    async signIn(message) {
      // This event is fired when a user signs in
    },
    async signOut(message) {
      // This event is fired when a user signs out
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };