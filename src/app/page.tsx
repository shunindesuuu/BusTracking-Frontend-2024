import SessionHandler from "@/components/SessionHandler";
import DisplayMap from "@/components/ui/DisplayMap";
import DrawRoute from "@/components/ui/DrawRoute";
import ProtectedComponent from "@/components/ui/ProtectedComponent";

import React from "react";

export const metadata = {
  title: 'Bus Tracking System Using ESP32 and GPS Module',
  description: 'The project is a bus tracking system that uses an ESP32 and a GPS module to track the location of a bus in real-time.',
};

export default function Home() {

  return (
    <main>
      {/* add sections here */}
      {/* <SessionHandler /> */}
      <DisplayMap/> 
    </main>
  );
}
