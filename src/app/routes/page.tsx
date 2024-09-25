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
  }

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      console.log("routes page load")
      try {
        const response = await fetch('http://localhost:4000/routes/index');  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        console.log(result)
        setRoutes(result); 
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();  
  }, []);

  return (
    <ProtectedComponent blockedRoles={['user']}>
      <div className="flex  flex-col justify-center container mx-auto mt-16 p-4 gap-4">
        <Link id='createbutton' href={`/routes/create`} className='bg-gray-200 hover:bg-gray-100 active:bg-gray-200 h-fit w-fit p-2 rounded-md'>Create Route</Link>
        <div className='flex gap-4'>
        {routes.map((route) => (
          <Link
            key={route.id}  // Adding the key prop here
            href={`/routes/${route.id}?routeName=${encodeURIComponent(route.routeName)}`}  // Including routeName in the query parameters
            className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
          >
            {route.routeName}
          </Link>
        ))}
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default Buses;
