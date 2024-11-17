'use client';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Interface for Route
interface Route {
  id: string; // Unique identifier for the route
  routeName: string; // Name of the route
  routeColor: string; // Color associated with the route
}

// Interface for Bus
interface Bus {
  id: string; // Unique identifier for the bus
  routeId: string; // Identifier for the associated route
  busName: string; // Name of the bus
  busNumber: string; // Bus number
  capacity: number; // Maximum capacity of the bus
  status: string; // Current status of the bus (e.g., onroad, maintenance)
  route: Route; // The route object associated with the bus
}

// Interface for Driver
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

const BusesAssignDriver: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const handleBackClick = () => {
    router.push('/buses');
  };

  const handleCreateClick = () => {
    router.push('/buses/buses-create-driver');
  };

  useEffect(() => {
    // Redirect if not admin
    if (status === 'authenticated' && session.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://3.27.197.150:4000/drivers/index');
        if (!response.ok) throw new Error('Network response was not ok');
        const usersResult: User[] = await response.json();
        setUsers(usersResult);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session.user?.role === 'admin') {
      fetchData();
    }
  }, [status, session]);

  if (status === 'loading') return null; // Wait for session status
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
                {[
                  '#',
                  'Name',
                  'Email',
                  'Assigned Bus',
                  'Bus Number',
                  'Status',
                  'Actions',
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-gray-500">
                    No users available.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                      {index + 1}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                      {user.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                      {user.email}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                      {user.driver ? user.driver.bus.busName : 'N/A'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                      {user.driver ? user.driver.bus.busNumber : 'N/A'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                      {user.driver ? user.driver.bus.status : 'N/A'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                      <Link
                        href={`buses-update-driver/${user.id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default BusesAssignDriver;
