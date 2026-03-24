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
      // Explicitly disable PKCE — Auth.js v5 + database sessions + PKCE
      // causes the pkceCodeVerifier cookie to be unreadable on callback.
      // This is a known issue with the Prisma adapter and database sessions.
      checks: ["state"],
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
