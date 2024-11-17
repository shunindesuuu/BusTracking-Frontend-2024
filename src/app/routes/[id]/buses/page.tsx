  'use client';

  import { useParams, useSearchParams } from 'next/navigation';
  import Link from 'next/link';
  import React, { useEffect, useState } from 'react';
  const Page = () => {
    const { id } = useParams(); // Access the routeId from URL

  const searchParams = useSearchParams();
  const routeName = searchParams.get('routeName') || '';
  
    interface Buses {
      id: number;
      routeId: string;
      busNumber: string;
      capacity: number;
      status: string;
      busName: string
      passCount: string
    }
  

    const [buses, setBuses] = useState<Buses[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      const fetchBuses = async () => {
        try {
          const response = await fetch(`http://3.27.197.150:4000/thingspeak/passengers/route/bus/${id}`);  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result: Buses[] = await response.json();
          setBuses(result);
          console.log(result)
        } catch (error) {
          setError((error as Error).message);  
        } finally {
          setLoading(false);
        }
      };
  
      fetchBuses();  
      
      // Set up interval to fetch buses every 15 seconds
        const intervalId = setInterval(fetchBuses, 15000);

        // Clear interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []);



    if (!id) {
      return <div>Error: Route ID is missing.</div>;
    }

    return (
      <div className="flex flex-col justify-center container mx-auto mt-16 p-5">
        <div>{routeName}</div>
        <table className="min-w-full divide-y divide-gray-200 mt-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass. Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bus.busNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.passCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`buses/${bus.id}`}>
                      View More
                    </Link>
                  </td>
                </tr>
              ))}
        </tbody>
        </table>
      </div>
    )
  }

  export default Page;
