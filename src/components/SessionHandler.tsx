"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Login from "@/app/login/page";

const SessionHandler = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // No loading text
  }

  if (!session) {
    return <Login />; // Show login page if not logged in
  }

  // If logged in, render nothing (handles the session in the background)
  return null;
};

export default SessionHandler;
