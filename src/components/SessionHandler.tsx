"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Login from "@/app/login/page";

const SessionHandler = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center h-screen bg-slate-400">
        {!session ? (
          <Login />
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Welcome, {session.user?.name}!
            </h1>
            {session.user?.role === "admin" ? (
              <>
                <p className="text-lg text-green-600">You are an admin.</p>
                <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-md">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    This is a special message only visible to admins.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-lg text-blue-600">You are not an admin.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionHandler;
