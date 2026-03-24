import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: false, // Disable debug logs in all environments
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Disable PKCE & state cookie checks — both fail with database sessions
      // due to SameSite cookie cross-origin restrictions in Auth.js v5.
      // The database session token is the security anchor, not browser cookies.
      checks: [],
    }),
  ],
  session: {
    // Use database sessions (not JWT) — required for Prisma adapter
    strategy: "database",
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect errors back to login rather than /api/auth/error
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    }
  }
})
