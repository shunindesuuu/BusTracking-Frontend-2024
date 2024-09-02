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
                    ["paololuisramirez@gmail.com", "mecasilum@addu.edu.ph", "sevchavez@addu.edu.ph"].includes(session.user.email!)
                        ? "admin"
                        : "user";
            }
            return session;
        },
        async signIn({ user, profile }) {
            if (["paololuisramirez@gmail.com", "mecasilum@addu.edu.ph", "sevchavez@addu.edu.ph"].includes(profile?.email!)) {
                user.role = "admin";
            } else {
                user.role = "user";
            }
            return true;
        },
    },
};
