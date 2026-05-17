import NextAuth, { NextAuthOptions } from "next-auth";
import type { AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const adapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
  adapter: {
    ...adapter,
    createUser: (data: Omit<AdapterUser, "id">) => prisma.user.create({ data: { id: randomUUID(), updatedAt: new Date(), ...data } }),
    linkAccount: (data: AdapterAccount) => prisma.account.create({ data: { id: randomUUID(), ...data } }),
    createSession: (data: AdapterSession) => prisma.session.create({ data: { id: randomUUID(), ...data } }),
    createVerificationToken: (data: VerificationToken) => prisma.verificationtoken.create({ data }),
    useVerificationToken: (identifier_token: { identifier: string; token: string }) =>
      prisma.verificationtoken.delete({
        where: { identifier_token },
      }),
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/", // Redirect to home if needed
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.email === "l3onsaiii@gmail.com" ? "admin" : "user";
      }
      // For existing tokens where role might not be set yet
      if (!token.role && token.email) {
        token.role = token.email === "l3onsaiii@gmail.com" ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
