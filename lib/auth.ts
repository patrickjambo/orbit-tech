import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mock validation for now until Prisma DB has seeded users
        if (credentials?.email === "admin@orbittech.rw" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin User", email: "admin@orbittech.rw", role: "admin" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_local_dev_orbit',
};
