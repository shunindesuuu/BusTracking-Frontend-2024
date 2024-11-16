"use client"
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Buses: React.FC = () => {
  //get route name
  interface RouteNames {
    id: number;
    routeName: string;
    routeColor: string;
    buses:Buses[]
  }

  interface Buses {
    id: number;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string
    route:RouteNames
  }
  const [buses, setBuses] = useState<Buses[]>([]);
  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [totalCapacity, setTotalCapacity] = useState<number>(0);


  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://3.27.197.150:4000/routes/index');  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result); 
        console.log(result[0])
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();  
  }, []);

  return (
    <ProtectedComponent restrictedRoles={['user']}>
      <div className="flex flex-col justify-center container mx-auto mt-16 p-4 gap-4">
        <Link id='createbutton' href={`/routes/create`} className='bg-gray-200 hover:bg-gray-100 active:bg-gray-200 h-fit w-fit p-2 rounded-md'>Create Route</Link>
        <div className='grid grid-cols-3 gap-2'>
        {routes.map((route) => {
            const totalCapacity = route.buses.reduce((acc, bus) => acc + bus.capacity, 0);
          return(
            <Link
              key={route.id}  // Adding the key prop here
              href={`/routes/${route.id}?routeName=${encodeURIComponent(route.routeName)}`}  // Including routeName in the query parameters
              className="bg-gray-100 pt-5 justify-between text-center rounded-md shadow-md hover:bg-gray-200 h-fit flex flex-col"
            >
              <div className='text-lg font-semibold'>{route.routeName}</div>
              <div className='p-5 w-full flex flex-col justify-start items-start'>
              <div className='text-md font-thin flex gap-3  w-full justify-between'>
                <div>Number of Buses:</div>
                <div>{route.buses.length}</div>
              </div>
              <div className='text-md font-thin flex  w-full justify-between gap-3'>
                <div>Route Capacity:</div>
                <div>{totalCapacity}</div> {/* Display the total route capacity here */}
              </div>
              </div>
            </Link>
          )
        }
        )}
      </div>

      </div>
    </ProtectedComponent>
  );
};

export default Buses;
