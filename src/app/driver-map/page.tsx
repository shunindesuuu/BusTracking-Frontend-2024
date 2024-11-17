'use client';
import React from 'react';

// Define the props interface
interface DisplayMapProps {
  selectedRoute: string;
}

// For client components in App Router, we don't need to use the Page type
const DisplayMap: React.FC<DisplayMapProps> = ({ selectedRoute }) => {
  return (
    <div className="h-60 w-full bg-gray-200 flex items-center justify-center">
      {/* Placeholder for your map logic */}
      <p className="text-black">Displaying map for route: {selectedRoute}</p>
    </div>
  );
};

// Create a separate page component that handles the page-level concerns
export default function DriverMapPage() {
  // You can handle route selection logic here
  const [selectedRoute, setSelectedRoute] = React.useState('default-route');

  return (
    <main>
      <DisplayMap selectedRoute={selectedRoute} />
    </main>
  );
}