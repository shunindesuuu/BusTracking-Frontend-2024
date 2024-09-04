'use client';

import Link from 'next/link';
import React from 'react';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams(); // Access the routeId from URL

  type BusDetails = {
    id: string;
    busNumber: string;
    capacity: number;
    passengerCount: number;
    dailyAverage: number;
  };
  
  const busData: BusDetails[] = [
    { id: "1", busNumber: "101", capacity: 50, passengerCount: 40, dailyAverage: 37 },
    { id: "2", busNumber: "202", capacity: 60, passengerCount: 55, dailyAverage: 52 },
    { id: "3", busNumber: "303", capacity: 45, passengerCount: 42, dailyAverage: 39 },
    { id: "4", busNumber: "404", capacity: 55, passengerCount: 50, dailyAverage: 48 },
  ];

  if (!id) {
    return <div>Error: Route ID is missing.</div>;
  }

  return (
    <div className="flex justify-center container mx-auto mt-20 p-4 ">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass. Count</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Average</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {busData.map((bus) => (
            <tr key={bus.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bus.busNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.capacity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.passengerCount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.dailyAverage}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Link href={`buses/${bus.id}`}>
  View More
</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Page;
