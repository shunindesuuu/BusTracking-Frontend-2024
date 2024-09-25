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


// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const authOptions: NextAuthOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//         }),
//     ],
//     callbacks: {
//         async session({ session, token }) {
//             if (session.user) {
//                 const user = await prisma.user.findUnique({
//                     where: { email: session.user.email! },
//                 });

//                 session.user.role = user?.role || "user";
//             }
//             return session;
//         },

//         async signIn({ user, account, profile }) {
//             const email = profile?.email!;

//             // Check if user exists in the database
//             let existingUser = await prisma.user.findUnique({
//                 where: { email },
//             });

//             // If not, create a new user with "driver" or "user" role based on your requirements
//             if (!existingUser) {
//                 await prisma.user.create({
//                     data: {
//                         email,
//                         role: ["paololuisramirez@gmail.com", "mecasilum@addu.edu.ph", "sevchavez@addu.edu.ph"].includes(email)
//                             ? "admin"
//                             : "driver",  // This would create "driver" users for new entries, change as needed
//                     },
//                 });
//             } else {
//                 user.role = existingUser.role; // Assign the existing role to user
//             }

//             return true;
//         },
//     },
// };

