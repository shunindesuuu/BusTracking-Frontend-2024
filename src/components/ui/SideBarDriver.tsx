import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";

interface Bus {
    id: string;
    routeId: string;
    busNumber: string;
    capacity: number;
    busName: string;
    passCount: string;
  }

const SideBarDriver = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    

//   const [selectedRoute, setSelectedRoute] = useState<RouteNames | null>(null);
//   const [routes, setRoutes] = useState<RouteNames[]>([]);
   const [bus, setBus] = useState<Bus | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBus = async () => {
    try {
      const response = await fetch(`https://3.27.197.150:4000/buses/driver/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: Bus = await response.json();
  
      // Second API call using result.id
      const passengerResponse = await fetch(`https://3.27.197.150:4000/thingspeak/bus-passenger/${result.id}`);
      if (!passengerResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const passengerData: Bus = await passengerResponse.json();
  
      // Set the bus state with the passengerData (which is the bus)
      setBus(passengerData);
  
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Call fetchBus immediately when the component mounts
    fetchBus();
  
    // Set interval to call fetchBus every 15 seconds (15000ms)
    const intervalId = setInterval(fetchBus, 15000);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div>
        <header className="w-full flex justify-between items-center mt-24 bg-green-500 p-2">
                <h1 className="text-white font-bold">Bus Number {bus?.busNumber}</h1>
              </header>
              {/* <div className="my-4">
                <label className="block text-black font-bold mb-2 text-center">
                  Change Destination
                </label>
                <div className="flex justify-center items-center space-x-4">
                  {routes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => handleRouteSelect(route)}
                      className={`p-2 rounded border ${selectedRoute?.id === route.id
                        ? 'bg-green-700 text-white'
                        : 'bg-green-500 text-white'
                        }`}
                    >
                      {route.routeName}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Seat Details */}
              <div className="text-center">
                <p>Bus Capacity: {bus?.capacity}</p>
                <p>Taken: {bus?.passCount}</p>
                <p>Available: {((bus?.capacity ?? 0) - (Number(bus?.passCount) || 0))}</p>
                {Math.round(((Number(bus?.passCount) || 0) / (bus?.capacity ?? 1)) * 100) >= 75 && (
                <p className="text-red-600 font-bold">
                    Warning: {Math.round(((Number(bus?.passCount) || 0) / (bus?.capacity ?? 1)) * 100)}% Bus Capacity
                </p>
                )}
              </div>
    </div>
  )
}

export default SideBarDriver