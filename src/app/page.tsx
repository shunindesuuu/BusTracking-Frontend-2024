'use client';
import DisplayMap from '@/components/ui/DisplayMap';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import RouteFilter from '@/components/ui/RouteFilter';
import React, { useState } from 'react';

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState('all');

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route);
  };

  return (
    <main>
      <ProtectedComponent>
        {/* Wrap both components in ProtectedComponent */}
        <>
          <div className="absolute top-[100px] md:top-10 right-0 z-50">
            <RouteFilter onRouteSelect={handleRouteSelect} />
          </div>
          <DisplayMap selectedRoute={selectedRoute} />
        </>
      </ProtectedComponent>
    </main>
  );
}