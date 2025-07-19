import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: user.access_token,
          currentTier: user.current_tier,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.currentTier = user.currentTier;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.currentTier = token.currentTier;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
