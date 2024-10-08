'use client';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Driver {
  firstName: any;
  middleName: any;
  lastName: any;
  id: string;
  name: string;
  phone: string;
  status: string;
  busId: string;
}

interface Bus {
  id: string; // Changed from number to string to match your data structure
  busNumber: string;
  busName: string;
  capacity: string; // Updated to string to match the fetched data
  status: string;
  _count: {
    passengers: number; // Add the passenger count from Prisma
  };
  driver: Driver | null; // Adjusted to handle cases where a driver may not be assigned
}

const BusesViewBuses: React.FC = () => {
  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    router.push('/buses');
  };

  const fetchData = async () => {
    try {
      const [busesResponse, driversResponse] = await Promise.all([
        fetch('http://localhost:4000/buses/index'), // Adjust the endpoint as needed
        fetch('http://localhost:4000/drivers/index'), // Adjust the endpoint as needed
      ]);

      if (!busesResponse.ok || !driversResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const busesResult: Bus[] = await busesResponse.json();
      const driversResult: Driver[] = await driversResponse.json();

      // Map drivers to buses
      const busesWithDrivers = busesResult.map((bus) => {
        const assignedDriver =
          driversResult.find((driver) => driver.busId === bus.id) || null;
        return { ...bus, driver: assignedDriver };
      });

      console.log()

      setBuses(busesResult);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Show loading initially

    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch updated bus data every 5 seconds (5000 ms)
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ProtectedComponent restrictedRoles={['user']}>
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
                  Bus Name
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
                    {bus.busName}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.capacity}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus._count.passengers}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.driver
                      ? `${bus.driver.firstName} ${bus.driver.middleName ? bus.driver.middleName + ' ' : ''}${bus.driver.lastName}`
                      : 'No Driver Assigned'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    <Link
                      href={`buses-update-buses/${bus.id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </Link>
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
