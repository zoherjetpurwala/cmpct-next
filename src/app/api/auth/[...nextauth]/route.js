// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/db";
import userModel from "@/models/user.model";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await userModel.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        console.log(user);

        // Include other user information you want to store in the session
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          accessToken: user.accessToken,
          currentTier: user.currentTier, // example field
          // Add any other fields you need here
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken; // store accessToken
        token.currentTier = user.currentTier; // store currentTier
        // Store other fields you added to user here
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken; // add accessToken to session
      session.user.currentTier = token.currentTier; // add currentTier to session
      // Add any other fields from token to session
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
