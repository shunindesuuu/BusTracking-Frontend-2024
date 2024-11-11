import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: {
            id?: string;      // Add id to the session user
            role?: string;    // Add role to the session user
        } & DefaultSession["user"];
    }

    interface User {
        id?: string;         // Add id to the user
        role?: string;       // Add role to the user
    }
}
