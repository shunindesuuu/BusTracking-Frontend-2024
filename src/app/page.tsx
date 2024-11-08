'use client';
import DisplayMap from '@/components/ui/DisplayMap';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import RouteFilter from '@/components/ui/RouteFilter';
import SideBar from '@/components/ui/SideBar';
import React, { useState } from 'react';
import { GlobalContextProvider } from './Context/busContext';

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState('all');

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route);
  };
  return (
    <main>
      <ProtectedComponent>
        <div className="absolute top-[100px] md:top-10 right-0 z-50">
          <RouteFilter onRouteSelect={handleRouteSelect} />
        </div>
      </ProtectedComponent>
      {/* Map Component */}
          <DisplayMap selectedRoute={selectedRoute} />
    </main>
  );
}
