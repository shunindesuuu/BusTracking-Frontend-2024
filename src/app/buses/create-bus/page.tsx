'use client';
import DrawRoute from '@/components/ui/DrawRoute';
import React, { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface RouteNames {
  id: string;
  routeName: string;
}

interface Driver {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

interface Bus {
  id: string;           // Unique identifier for the bus
  routeId: string;     // Identifier for the route
  busName: string;     // Name of the bus
  busNumber: string;   // Bus number
  capacity: number;    // Maximum capacity of the bus
  status: string;      // Current status of the bus (e.g., onroad, maintenance)
}

// Interface for the Driver
interface Driver {
  id: string;          // Unique identifier for the driver
  userId: string;     // ID of the associated user
  busId: string;      // ID of the bus associated with the driver
  bus: Bus;           // The bus object associated with the driver
}

// Interface for the User
interface User {
  id: string;         // Unique identifier for the user
  name: string;      // Name of the user
  email: string;     // Email address of the user
  role: string;      // Role of the user (e.g., driver, admin)
  driver: Driver;    // The driver object associated with the user
}

const CreateBus: React.FC = () => {

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [driver, setDriver] = useState<string | null>(null);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isDriverOpen, setIsDriverOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedDriver, setSelectedDriver] = useState<User | null>(null);

  // State for bus details
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('');

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [driverId, setDriverId] = useState<string>('');


  const [busLocationChannel, setBusChannel] = useState('');
  const [latFieldNumber, setLatFieldNumber] = useState('');
  const [longFieldNumber, setLongFieldNumber] = useState('');
  const [busPassengerChannel, setBusPassengerChannel] = useState('');
  const [fieldNumber, setFieldNumber] = useState('');

  const router = useRouter();

  const handleBackClick = () => {
    router.push('/buses');
  };

  const { data: session } = useSession();

  if (status === 'loading') {
    return null;
  }
  if (!session) {
    redirect('/login');
  }
  if (session.user?.role !== 'admin') {
    redirect('/');
  }

  const handleRouteButtonClick = () => {
    setIsRouteOpen(!isRouteOpen);
  };

  const handleDriverButtonClick = () => {
    setIsDriverOpen(!isDriverOpen);
  };

  const handleRouteSelect = (route: RouteNames) => {
    setSelectedRoute({ id: route.id, name: route.routeName });
    setIsRouteOpen(false);
  };

  const handleDriverSelect = (driver: User) => {
    setSelectedDriver(driver);
    setIsDriverOpen(false);
  };

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
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    

    const fetchDriver = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://3.27.197.150:4000/drivers/index`);
        if (!response.ok) {
          throw new Error('Failed to fetch driver data');
        }
        
        const result: User[] = await response.json(); // Expecting a User object
        console.log(result)
        setDrivers(result)
        // setDriverId(result.id)
        // setName(result.name);

      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    

    fetchRoutes();
    fetchDriver();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    // Validation
    if (!busName.trim()) {
      toast.error('Please enter a bus name');
      return;
    }
    if (!busNumber.trim()) {
      toast.error('Please enter a bus number');
      return;
    }
    if (!capacity.trim()) {
      toast.error('Please enter the bus capacity');
      return;
    }
    if (!status.trim()) {
      toast.error('Please enter the bus status');
      return;
    }
    if (!selectedRoute) {
      toast.error('Please select a route');
      return;
    }

    // Create bus data
    const busData = {
      busName,
      busNumber,
      busLocationChannel,
      latFieldNumber,
      longFieldNumber,
      busPassengerChannel,
      fieldNumber,
      capacity,
      status,
      driverId: selectedDriver ? selectedDriver.driver.id : null,
      routeId: selectedRoute ? selectedRoute.id : null,
    };

    try {
      const response = await fetch('https://3.27.197.150:4000/buses/create', {
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
      setBusChannel('');
      setLatFieldNumber('');
      setLongFieldNumber('');
      setCapacity('');
      setStatus('');
      setSelectedRoute(null);
      setSelectedDriver(null);
      toast.success('Bus created successfully!');
      router.push('/buses'); // Redirect to buses page after successful creation
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <ProtectedComponent restrictedRoles={['user']}>
      <div className="container mx-auto mt-20 p-4">
        <Toaster position="top-center" />
        <div className="bg-white shadow-md rounded-lg w-full p-4">
          <div className="bg-green-500 text-white text-center text-lg font-semibold py-4 rounded-t-lg">
            Create Bus
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-4 mt-4">
              <div className="flex-1">
                <div className="mb-4">
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
                    onChange={(e) => setBusName(e.target.value)}
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
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="capacity"
                  >
                    Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
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
                    onChange={(e) => setStatus(e.target.value)}
                    className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="block text-gray-700 text-sm font-bold">
                Bus Location Channel
              </h2>
              <div className="flex gap-4 mb-4 mt-2">
                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-xs font-normal mb-2"
                    htmlFor="busChannel"
                  >
                    Channel ID
                  </label>
                  <input
                    type="text"
                    id="busChannel"
                    name="busChannel"
                    value={busLocationChannel}
                    onChange={(e) => setBusChannel(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-xs font-normal mb-2"
                    htmlFor="latFieldNumber"
                  >
                    Bus Latitude Number
                  </label>
                  <input
                    type="text"
                    id="latFieldNumber"
                    name="latFieldNumber"
                    value={latFieldNumber}
                    onChange={(e) => setLatFieldNumber(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-xs font-normal mb-2"
                    htmlFor="longFieldNumber"
                  >
                    Bus Longitude Number
                  </label>
                  <input
                    type="text"
                    id="longFieldNumber"
                    name="longFieldNumber"
                    value={longFieldNumber}
                    onChange={(e) => setLongFieldNumber(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <h2 className="block text-gray-700 text-sm font-bold">
                Bus Passenger Channel
              </h2>
              <div className="flex gap-4 mb-4 mt-4">
                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-xs font-normal mb-2"
                    htmlFor="passengerChannel"
                  >
                    Channel ID
                  </label>
                  <input
                    type="text"
                    id="passengerChannel"
                    name="passengerChannel"
                    value={busPassengerChannel}
                    onChange={(e) => setBusPassengerChannel(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex-1">
                  <label
                    className="block text-gray-700 text-xs font-normal mb-2"
                    htmlFor="fieldNumber"
                  >
                    Field Number
                  </label>
                  <input
                    type="text"
                    id="fieldNumber"
                    name="fieldNumber"
                    value={fieldNumber}
                    onChange={(e) => setFieldNumber(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
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
                  <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
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
            {/* Driver Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Add Driver
              </label>
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleDriverButtonClick}
                >
                  {selectedDriver
                    ? `${selectedDriver.name}`
                    : 'Select Driver'}
                </button>

                {isDriverOpen && (
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
                        drivers.map((driver) => (
                          <div
                            key={driver.id}
                            onClick={() => handleDriverSelect(driver)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer z-50"
                          >
                            {driver.name}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              {selectedDriver && (
                <div className="mt-2 text-gray-700">
                  Selected Driver:{' '}
                  {selectedDriver.name}
                  (ID: {selectedDriver.id})
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
