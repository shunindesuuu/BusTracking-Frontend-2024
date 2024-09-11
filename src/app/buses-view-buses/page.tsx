'use client';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Bus {
  id: number;
  busNumber: string;
  busName: string; // Added busName property
  capacity: number;
  passengerCount: number;
  driver: string;
  status: string;
}

const BusesViewBuses: React.FC = () => {
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    router.push('/buses');
  };

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch('http://localhost:4000/buses/index'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Bus[] = await response.json();
        setBuses(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ProtectedComponent blockedRoles={['user']}>
      <div className="container mx-auto mt-20 p-4">
        <button
          type="button"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleBackClick}
        >
          Back
        </button>
        <div className="bg-white shadow-md rounded-lg w-full p-4">
          <table
            className="min-w-full leading-normal border-2 border-gray-100"
            style={{ backgroundColor: '#f2f2f2' }}
          >
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  #
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Bus Number
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Bus Name {/* Added Bus Name Header */}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Passenger Count
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {buses.map((bus, index) => (
                <tr key={bus.id}>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {index + 1}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.busNumber}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.busName} {/* Added Bus Name Value */}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.capacity}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.passengerCount}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.driver}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    Edit | Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default BusesViewBuses;
