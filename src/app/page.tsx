import SessionHandler from "@/components/SessionHandler";
import PassengerSidebar from "@/components/ui/PassengerSidebar";
import React from "react";

export const metadata = {
  title: 'Bus Tracking System Using ESP32 and GPS Module',
  description: 'The project is a bus tracking system that uses an ESP32 and a GPS module to track the location of a bus in real-time.',
};

export default function Home() {
  return (
    <main className="flex flex-row w-full">
      {/* add sections here */}
      <PassengerSidebar/>

      <SessionHandler />
    </main>
  );
}
