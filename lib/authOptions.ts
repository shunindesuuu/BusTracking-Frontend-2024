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
        async session({ session, token }) {
            if (session.user) {
                // Fetch the user's role from the Express API using the email
                try {
                    const response = await fetch("http://localhost:4000/users/get-user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: session.user.email }),
                    });

                    if (response.ok) {
                        const user = await response.json();
                        session.user.role = user.role || "user"; // Default to "user" if no role is found
                    } else {
                        session.user.role = "user"; // Default role
                    }
                } catch (error) {
                    console.error("Failed to fetch user role:", error);
                    session.user.role = "user"; // Fallback role
                }
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            console.log("sign in attemp")
            try {
                // Check if the user exists in the database via Express API
                const response = await fetch("http://localhost:4000/users/get-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: user.email }),
                });

                if (response.status === 404) {
                    // If user doesn't exist, create a new one
                    await fetch("http://localhost:4000/users/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            role: "user", // Default role, change as needed
                        }),
                    });
                } else if (response.ok) {
                    // If user exists, assign role to user object
                    const dbUser = await response.json();
                    user.role = dbUser.role;
                }

                return true;
            } catch (error) {
                console.error("Failed to handle sign-in:", error);
                return false; // Return false to deny sign-in if there's an error
            }
        },
    },
};
