import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async session({ session }) {
            if (session.user) {
                session.user.role =
                    session.user.email === "paololuisramirez@gmail.com"
                        ? "admin"
                        : "user";
            }
            return session;
        },
        async signIn({ user, profile }) {
            if (profile?.email === "paololuisramirez@gmail.com") {
                user.role = "admin";
            } else {
                user.role = "user";
            }
            return true;
        },
    },
};


