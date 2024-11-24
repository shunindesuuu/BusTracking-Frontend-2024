'use client';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Driver {
  id: string; // Unique identifier for the driver
  userId: string; // ID of the associated user
  busId: string; // ID of the bus associated with the driver
  bus: Bus; // The bus object associated with the driver
}

// Interface for User
interface User {
  id: string; // Unique identifier for the user
  name: string; // Name of the user
  email: string; // Email address of the user
  role: string; // Role of the user (e.g., driver, admin)
  driver: Driver; // The driver object associated with the user
}

interface Bus {
  id: string; // Changed from number to string to match your data structure
  busNumber: string;
  busName: string;
  capacity: string; // Updated to string to match the fetched data
  status: string;
  passCount: string
  driver: User | null; // Adjusted to handle cases where a driver may not be assigned
}

const BusesViewBuses: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }
  if (!session) {
    redirect('/login');
  }
  if (session.user?.role !== 'admin') {
    redirect('/');
  }

  const router = useRouter();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  


  const handleBackClick = () => {
    router.push('/buses');
  };

  const fetchData = async () => {
    try {
      const [busesResponse, driversResponse] = await Promise.all([
        fetch('https://3.27.197.150:4000/thingspeak/all-bus-passengers'), // Adjust the endpoint as needed
        fetch('https://3.27.197.150:4000/drivers/index'), // Adjust the endpoint as needed
      ]);

      if (!busesResponse.ok || !driversResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const busesResult: Bus[] = await busesResponse.json();
      const driversResult: User[] = await driversResponse.json();
      console.log(driversResult )


      // Map drivers to buses
      const busesWithDrivers = busesResult.map((bus) => {
        const assignedDriver =
          driversResult.find((driver) => driver.driver?.busId === bus.id) || null;
        return { ...bus, driver: assignedDriver };
      });

      setBuses(busesWithDrivers);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // setLoading(true); // Show loading initially

    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch updated bus data every 5 seconds (5000 ms)
    }, 15000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const confirmArchive = async () => {
    try {
      const response = await fetch(`https://3.27.197.150:4000/buses/archive/${selectedBus?.id}`);
      console.log(selectedBus?.id)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setModalVisible(false)
      fetchData();

    } catch (error) {
      setError((error as Error).message);  
    } finally {
      setLoading(false);
    }
  };
  // if (loading) return <div>Loading...</div>;
  if (error) return <div className="container mx-auto mt-20 p-4">Error: {error}</div>;

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
                    {bus.passCount}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.driver
                      ? `${bus.driver.name}`
                      : 'No Driver Assigned'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                    {bus.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-500 text-sm text-black flex gap-3">
                    <Link
                      href={`buses-update-buses/${bus.id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        setModalVisible(true); // First action
                        setSelectedBus(bus); // Second action
                      }}
                    >
                      Archive
                    </button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
           {/* Modal */}
       {modalVisible && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold">Confirm Archive</h2>
              <p>
                Are you sure you want to archive {selectedBus?.busName} route?
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmArchive}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default BusesViewBuses;
