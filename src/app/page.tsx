import React from "react";
import Login from "./login/page";

export const metadata = {
  title: 'Bus Tracking System Using ESP32 and GPS Module',
  description: 'The project is a bus tracking system that uses an ESP32 and a GPS module to track the location of a bus in real-time.',
};

export default function Home() {
  return (
    <main>
      {/* add sections here */}
      <Login />
    </main>
  );
}
