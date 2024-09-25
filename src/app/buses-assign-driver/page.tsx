'use client';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: string;
  bus: {
    id: string;
    busName: string;
    busNumber: string;
    capacity: string;
    status: string;
  };
}

const BusesAssignDriver: React.FC = () => {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    router.push('/buses');
  };

  const handleCreateClick = () => {
    router.push('/buses-create-driver'); // Redirects to the create driver page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/drivers/index'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const driversResult: Driver[] = await response.json();
        setDrivers(driversResult);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ProtectedComponent restrictedRoles={['user']}>
      <div className="container mx-auto mt-20 p-4">
        <div className="flex justify-between mb-4">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleBackClick}
          >
            Back
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCreateClick}
          >
            Create Driver
          </button>
        </div>

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
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Assigned Route
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Bus Number
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
              {drivers.map((driver, index) => (
                <tr key={driver.id}>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {index + 1}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {driver.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {driver.bus ? driver.bus.busName : 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {driver.bus ? driver.bus.busNumber : 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {driver.bus ? driver.bus.status : 'N/A'}
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

export default BusesAssignDriver;
