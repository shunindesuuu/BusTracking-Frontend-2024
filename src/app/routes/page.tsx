"use client"
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Buses: React.FC = () => {
  interface RouteNames {
    id: number;
    routeName: string;
    routeColor: string;
    buses: Buses[]
  }

  interface Buses {
    id: number;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string
    route: RouteNames
  }
  const [routes, setRoutes] = useState<RouteNames[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('https://3.27.197.150:4000/routes/index');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result);
      } catch (error) {
        console.error('Failed to fetch routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <ProtectedComponent restrictedRoles={['user']}>
      <div className="flex flex-col min-w-[320px] mx-auto mt-24 lg:mt-20 px-3 xs:px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex w-full">
          <Link
            id='createbutton'
            href={`/routes/create`}
            className='w-full sm:w-auto bg-gray-200 hover:bg-gray-100 active:bg-gray-200 px-4 py-3 sm:py-2 rounded-md text-sm sm:text-base transition-colors duration-200 text-center'
          >
            Create Route
          </Link>
        </div>

        <div className='grid grid-cols-1 gap-3 xs:gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
          {routes.map((route) => {
            const totalCapacity = route.buses.reduce((acc, bus) => acc + bus.capacity, 0);
            return (
              <Link
                key={route.id}
                href={`/routes/${route.id}?routeName=${encodeURIComponent(route.routeName)}`}
                className="bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200 flex flex-col justify-between min-h-[120px]"
              >
                <div className='p-3 xs:p-4 sm:p-5'>
                  <div className='text-base sm:text-lg font-semibold mb-3 sm:mb-4'>
                    {route.routeName}
                  </div>
                  <div className='space-y-2 sm:space-y-3'>
                    <div className='flex justify-between items-center text-sm sm:text-base'>
                      <span className="text-gray-600">Number of Buses:</span>
                      <span className="font-medium">{route.buses.length}</span>
                    </div>
                    <div className='flex justify-between items-center text-sm sm:text-base'>
                      <span className="text-gray-600">Route Capacity:</span>
                      <span className="font-medium">{totalCapacity}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default Buses;