'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const page = () => {
  const params = useParams();
  const { id } = params;

  const searchParams = useSearchParams();
  const routeName = searchParams.get('routeName') || '';
  // Define the Route interface
interface Route {
  id: string;
  routeName: string;
  routeColor: string;
}
  interface Buses {
    id: number;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string
    route:Route
  }

  const [buses, setBuses] = useState<Buses[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [totalCapacity, setTotalCapacity] = useState<number>(0);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`http://localhost:4000/buses/index/route/${id}`);  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Buses[] = await response.json();
        setBuses(result);
        console.log(result)

        // Calculate total capacity
        const total = result.reduce((sum, bus) => sum + bus.capacity, 0);
        setTotalCapacity(total);
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();  
  }, []);

  if (!id) {
    return <div>Error: Route ID is missing.</div>;
  }

  // const routeName = buses[0]?.route.routeName;


  return (
    <div className="flex flex-col justify-center container mx-auto mt-16 p-5">
      <div>{routeName}</div>
      <div className="flex justify-center container mx-auto gap-4 mt-3">
      <Link
        href={`${id}/buses?routeName=${encodeURIComponent(routeName)}`}
        className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
      >
        <div>Buses</div>
        <div>{buses.length}</div>
      </Link>
      <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
        <div>Capacity</div>
        <div>{totalCapacity}</div>
      </div>
      <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
        <div>Passengers</div>
        <div>TBA</div>
      </div>
      <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
        <div>Stops</div>
        <div>TBA</div>
      </div>
      </div>
    </div>
  );
}


export default page