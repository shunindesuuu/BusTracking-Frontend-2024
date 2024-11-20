"use client";
import { useGlobalContext } from '@/app/Context/busContext';
import { useEffect, useState } from 'react';
import ProgressBar from './ProgessBar';

interface Route {
  id: string;
  routeName: string;
  routeColor: string;
}

interface Bus {
  id: string;
  routeId: string;
  busNumber: string;
  capacity: number;
  status: string;
  busName: string;
  passCount: string;
  route: Route;
}

const SelectedBus = () => {
  const { data } = useGlobalContext();
  const [bus, setBus] = useState<Bus | null>(null);

  useEffect(() => {
    const fetchBusData = async () => {
      if (!data || !data.id) return;

      try {
        const response = await fetch(`https://3.27.197.150:4000/thingspeak/bus-passenger/${data.id}`);
        if (response.ok) {
          const result = await response.json();

          // Dynamically update the route if it's a string in `data`
          const transformedBus: Bus = {
            ...result,
            route: {
              id: result.route.id, // from API response
              routeName: data.route || result.route.routeName, // fallback to `data.route` if string
              routeColor: result.route.routeColor, // from API response
            }
          };

          setBus(transformedBus);
          console.log("Bus data updated");
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBusData();
    const intervalId = setInterval(fetchBusData, 15000);

    return () => clearInterval(intervalId);
  }, [data]);

  const percent = bus ? (parseInt(bus.passCount || "0") / (bus.capacity || 1)) * 100 : 0;

  if (!bus || !bus.id) {
    return (
      <div className='bg-gray-100 h-fit rounded-md border p-3 mt-20'>
        <p>Select Bus</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start text-base mt-28 lg:mt-16 w-full">
      <div className="bg-white h-fit w-full border rounded-md mt-5">
        <div className="bg-white border-b w-full h-1/4 flex items-center justify-between p-2 rounded-md">
          <div className="flex gap-2">
            <p>Bus Number:</p>
            <p>{bus.busNumber}</p>
          </div>
          <p className="ml-6 underline text-green-400">{bus.route.routeName}</p> {/* Display routeName from API */}
        </div>

        <div className="h-3/4 flex flex-col p-3 rounded-b-md">
          <div className="w-full h-fit flex flex-col">
            <p>Bus Capacity: {bus.capacity}</p>
            <p>Taken: {bus.passCount}</p>
            <p>Available: {bus.capacity - parseInt(bus.passCount)}</p>
          </div>

          <ProgressBar data={percent} />
        </div>
      </div>
    </div>
  );
};

export default SelectedBus;
