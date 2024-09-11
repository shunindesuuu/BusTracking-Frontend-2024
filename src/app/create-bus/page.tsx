'use client';
import DrawRoute from '@/components/ui/DrawRoute';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedComponent from '@/components/ui/ProtectedComponent';

interface RouteNames {
  id: string;
  routeName: string;
}

// Commented out Driver interface
// interface Driver {
//   id: string;
//   name: string;
// }

const CreateBus: React.FC = () => {
  const [routes, setRoutes] = useState<RouteNames[]>([]);
  // Commented out drivers state
  // const [drivers, setDrivers] = useState<Driver[]>([]);

  const [isRouteOpen, setIsRouteOpen] = useState(false);
  // Commented out isDriverOpen state
  // const [isDriverOpen, setIsDriverOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<{
    id: string;
    name: string;
  } | null>(null);
  // Commented out selectedDriver state
  // const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // State for bus details
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('');

  const router = useRouter();

  const handleBackClick = () => {
    router.push('/buses');
  };

  const handleRouteButtonClick = () => {
    setIsRouteOpen(!isRouteOpen);
  };

  // Commented out handleDriverButtonClick
  // const handleDriverButtonClick = () => {
  //   setIsDriverOpen(!isDriverOpen);
  // };

  const handleRouteSelect = (route: RouteNames) => {
    setSelectedRoute({ id: route.id, name: route.routeName });
    setIsRouteOpen(false);
  };

  // Commented out handleDriverSelect
  // const handleDriverSelect = (driver: Driver) => {
  //   setSelectedDriver(driver);
  //   setIsDriverOpen(false);
  // };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:4000/routes/index');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    // Commented out fetchDrivers function
    // const fetchDrivers = async () => {
    //   try {
    //     const response = await fetch('http://localhost:4000/drivers/index');
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const result: Driver[] = await response.json();
    //     setDrivers(result);
    //   } catch (error) {
    //     setError((error as Error).message);
    //   }
    // };

    fetchRoutes();
    // Commented out fetchDrivers call
    // fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    // Create bus data
    const busData = {
      busName,
      busNumber,
      capacity,
      status,
      // Commented out driverId
      // driverId: selectedDriver ? selectedDriver.id : null,
      routeId: selectedRoute ? selectedRoute.id : null,
    };

    try {
      const response = await fetch('http://localhost:4000/buses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(busData),
      });

      if (!response.ok) {
        throw new Error('Failed to create bus');
      }

      // Optionally, you can reset the form and selected route here
      setBusName('');
      setBusNumber('');
      setCapacity('');
      setStatus('');
      setSelectedRoute(null);
      // Commented out setSelectedDriver
      // setSelectedDriver(null);
      alert('Bus created successfully!');
      router.push('/buses'); // Redirect to buses page after successful creation
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <ProtectedComponent blockedRoles={['user']}>
      <div className="container mx-auto mt-20 p-4">
        <div className="bg-white shadow-md rounded-lg w-full p-4">
          <div className="bg-green-500 text-white text-center text-lg font-semibold py-4 rounded-t-lg">
            Create Bus
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 mt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="busName"
              >
                Bus Name
              </label>
              <input
                type="text"
                id="busName"
                name="busName"
                value={busName}
                onChange={(e) => setBusName(e.target.value)} // Handle change
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="busNumber"
              >
                Bus Number
              </label>
              <input
                type="text"
                id="busNumber"
                name="busNumber"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)} // Handle change
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="capacity"
              >
                Capacity
              </label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)} // Handle change
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <input
                type="text"
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)} // Handle change
                className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Add Route
              </label>
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleRouteButtonClick}
                >
                  {selectedRoute ? selectedRoute.name : 'Add to Route'}
                </button>

                {/* Route Dropdown Menu */}
                {isRouteOpen && (
                  <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {loading && (
                        <div className="px-4 py-2 text-sm text-gray-700">
                          Loading...
                        </div>
                      )}
                      {error && (
                        <div className="px-4 py-2 text-sm text-red-600">
                          {error}
                        </div>
                      )}
                      {!loading &&
                        !error &&
                        routes.map((route) => (
                          <div
                            key={route.id}
                            onClick={() => handleRouteSelect(route)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            {route.routeName}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              {selectedRoute && (
                <div className="mt-2 text-gray-700">
                  Selected Route: {selectedRoute.name} (ID: {selectedRoute.id})
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleBackClick}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Bus
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default CreateBus;
