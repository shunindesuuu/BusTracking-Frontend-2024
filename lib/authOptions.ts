// authOptions.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import https from "https";
import fetch from "node-fetch"; // Import node-fetch

// Define the type for the database user returned by the API
interface DbUser {
  id: string;
  role: string;
}

// Create an HTTPS agent to allow self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Disable SSL verification for self-signed certificates
});

// Define the NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        try {
          // Fetch the user's role and ID from the backend API
          const response = await fetch("https://54.253.121.220:4000/users/get-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
            // Attach the custom HTTPS agent
            agent: httpsAgent,
          });

          if (response.ok) {
            const dbUser = (await response.json()) as DbUser;
            session.user.role = dbUser.role || "user"; // Default to "user" if no role is found
            session.user.id = dbUser.id; // Assign user ID to the session
          } else {
            session.user.role = "user"; // Default role
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          session.user.role = "user"; // Fallback role
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Sign in attempt");
      try {
        // Check if the user exists in the database via the backend API
        const response = await fetch("https://54.253.121.220:4000/users/get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
          // Attach the custom HTTPS agent
          agent: httpsAgent,
        });

        if (response.status === 404) {
          // User doesn't exist, create a new one
          await fetch("https://54.253.121.220:4000/users/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              role: "user", // Default role
            }),
            // Attach the custom HTTPS agent
            agent: httpsAgent,
          });
        } else if (response.ok) {
          // User exists, fetch role and ID
          const dbUser = (await response.json()) as DbUser;
          user.role = dbUser.role;
          user.id = dbUser.id; // Assign user ID to the user object
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error("Failed to handle sign-in:", error);
        return false; // Deny sign-in on error
      }
    },
  },
};
