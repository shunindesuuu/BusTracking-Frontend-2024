'use client';
import React, { useEffect, useState } from 'react';
import menu from '../utils/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { PiSignOutBold } from 'react-icons/pi';
import ProtectedComponent from './ProtectedComponent';
import NavigationBar from './NavBar';
import ProgressBar from './ProgessBar';
import DisplayMap from '@/app/driver-map/page';

interface RouteNames {
  id: number;
  routeName: string;
  routeColor: string;
}

const SideBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteNames | null>(null);
  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the routes from the backend API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/routes/index/coordinates'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result);
        if (result.length > 0) {
          setSelectedRoute(result[0]); // Default to the first route
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);
  // Handle route selection
  const handleRouteSelect = (route: RouteNames) => {
    setSelectedRoute(route);
  };

  // Fake bus data for seat display
  const busCapacity = 100;
  const takenSeats = 75;
  const availableSeats = busCapacity - takenSeats;

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="z-[500]">
      <ProtectedComponent restrictedRoles={['admin, user']}>
        <NavigationBar toggleSidebar={toggleSidebar} />
        <div className="relative flex h-screen">
          <div
            className={`fixed top-0 left-0 p-10 flex flex-col w-[350px] h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 md:static md:h-auto z-40`}
          >
            <ProtectedComponent restrictedRoles={['user', 'driver']}>
              <div className="flex flex-col justify-start text-base mt-24 space-y-4">
                {menu.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className={`nav-item px-6 py-3 text-black hover:text-[#34C759] rounded-md border border-1 ${
                      pathname === item.link ? 'bg-gray-200 text-green-500' : ''
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </ProtectedComponent>

            <ProtectedComponent restrictedRoles={['admin', 'driver']}>
              <div className="flex flex-col justify-start text-base mt-24 lg:mt-16 space-y-4 w-full">
                <p className="mt-10 mb-2">Bus Information</p>

                <div className="bg-white h-52 w-full rounded-md border">
                  <div className="bg-white border-b w-full h-1/4 flex items-center justify-between p-2 rounded-t-md">
                    <div className="flex gap-2">
                      <p>Bus Number:</p>
                      <p>12345</p>
                    </div>
                    <p className="underline text-green-400">Toril Line</p>
                  </div>

                  <div className="h-3/4 flex flex-col">
                    <div className="w-full h-fit flex flex-col p-2">
                      <p className="mb-1">Bus Capacity: 50</p>
                      <p className="text-sm ">Taken: 30</p>
                      <p className="text-sm">Available: 20</p>
                    </div>
                    <ProgressBar />
                    <div className="flex flex-col justify-center align-middle h-1/2 p-2">
                      <div className="flex text-xs justify-between">
                        <p>ADDU</p>
                        <p>GMALL</p>
                        <p>VPLAZA</p>
                        <p>ABRZA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedComponent>
            <ProtectedComponent restrictedRoles={['admin', 'user']}>
              <div className="flex flex-col items-center bg-white p-4 min-h-screen">
                {/* Header */}
                <header className="w-full flex justify-between items-center bg-green-500 p-2">
                  <h1 className="text-white font-bold">Bus Number 4132</h1>
                  <button className="text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 7h5m0 0V2m0 5l-6 6m0 0l-6 6M9 13h5m0 0l-6 6m0 0V2"
                      />
                    </svg>
                  </button>
                </header>

                {/* Route Selection */}
                <div className="my-4">
                  <label className="block text-black font-bold mb-2">
                    Change Destination
                  </label>
                  <div className="flex space-x-4">
                    {routes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => handleRouteSelect(route)}
                        className={`p-2 rounded border ${
                          selectedRoute?.id === route.id
                            ? 'bg-green-700 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {route.routeName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seat Details */}
                <div className="text-center">
                  <p>Bus Capacity: {busCapacity}</p>
                  <p>Taken: {takenSeats}</p>
                  <p>Available: {availableSeats}</p>
                  <p className="text-red-600 font-bold">
                    Warning: {Math.round((takenSeats / busCapacity) * 100)}% Bus
                    Capacity
                  </p>
                </div>
              </div>
            </ProtectedComponent>

            {session && (
              <div className="flex flex-col mt-auto">
                <p className="text-black border-">
                  {session.user?.name || session.user?.email}
                </p>
                <button
                  onClick={() => signOut()}
                  className="flex items-center text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-900 hover:text-[#34C759] transition duration-150 whitespace-nowrap"
                >
                  <PiSignOutBold className="mr-2" color="green" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={toggleSidebar}
            />
          )}
        </div>
      </ProtectedComponent>
    </div>
  );
};

export default SideBar;
