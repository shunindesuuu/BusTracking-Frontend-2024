'use client';
import SessionHandler from '@/components/SessionHandler';
import DisplayMap from '@/components/ui/DisplayMap';
import DrawRoute from '@/components/ui/DrawRoute';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import SideBar from '@/components/ui/SideBar';
import React, { useContext, useState } from 'react';

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState('all'); // State for selected route

  return (
    <main>
      {/* Add your sections here */}
      <SideBar onRouteSelect={setSelectedRoute} />
      <DisplayMap selectedRoute={selectedRoute} /> {/* Pass the selected route */}
    </main>
  );
}
