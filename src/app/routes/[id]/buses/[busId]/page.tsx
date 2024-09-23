'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id: routeId, busId } = useParams(); // Access both routeId and busId

  type BusDetails = {
    id: string;
    busNumber: string;
    capacity: number;
    passengerCount: number;
    dailyAverage: number;
  };
  
  const busData: BusDetails[] = [
    { id: "84383809-ee09-482c-9c89-bc643494ec06", busNumber: "101", capacity: 50, passengerCount: 40, dailyAverage: 37 },
    { id: "fe67db45-3925-490a-a999-b2de6a4ff659", busNumber: "202", capacity: 60, passengerCount: 55, dailyAverage: 52 },
    { id: "3", busNumber: "303", capacity: 45, passengerCount: 42, dailyAverage: 39 },
    { id: "4", busNumber: "404", capacity: 55, passengerCount: 50, dailyAverage: 48 },
  ];

  if (!busId) {
    return <div>Error: Bus ID is missing.</div>;
  }

  const busDetails = busData.find(bus => bus.id === busId);

  if (!busDetails) {
    return <div>Bus not found.</div>;
  }

  return (
    <div className="flex flex-col justify-start container mx-auto mt-16 p-4">
     <div className='flex'>
        <p>Route {routeId}/</p>
        <p>Bus {busDetails.busNumber}</p>
     </div>
      <p className='mt-2'>Capacity: {busDetails.capacity}</p>  

      {/* Additional Full-Width Containers */}
      <div className="flex flex-col bg-gray-100 p-4 mt-4 rounded-md shadow-sm">
          <p className="font-medium text-gray-800">Container 1</p>
          <p className="text-gray-600">Content for container 1.</p>
        </div>
        <div className="flex flex-col bg-gray-100 p-4 mt-4 rounded-md shadow-sm">
          <p className="font-medium text-gray-800">Container 2</p>
          <p className="text-gray-600">Content for container 2.</p>
        </div>
        <div className="flex flex-col bg-gray-100 p-4 mt-4 rounded-md shadow-sm">
          <p className="font-medium text-gray-800">Container 3</p>
          <p className="text-gray-600">Content for container 3.</p>
        </div>
    </div>
  );
}

export default Page;
    