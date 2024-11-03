'use client';
import React, { useEffect, useState } from 'react';
import { redirect, useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const BusForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Bus Interface
  interface Bus {
    id: number;
    busName: string;
    busNumber: string;
    capacity: number;
    status: string;
    driver: Driver | null; // Driver ID may be null if no driver is assigned
    routeId: string;
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

  interface BusLocationChannel{
    channelId: string;
    latFieldNumber: string;
    longFieldNumber: string;
  }

  interface BusPassengerChannel{
    channelId: string;
    fieldNumber: string;
  }

  // State for loading, error, and form fields
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [busName, setBusName] = useState<string>('');
  const [busNumber, setBusNumber] = useState<string>('');

  const [busLocationChannel, setBusLocationChannel] = useState('');
  const [latFieldNumber, setLatFieldNumber] = useState('');
  const [longFieldNumber, setLongFieldNumber] = useState('');

  const [busPassengerChannel, setBusPassengerChannel] = useState('');
  const [fieldNumber, setFieldNumber] = useState('');

  const [capacity, setCapacity] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('');
  const [routeId, setRouteId] = useState<string>('');

  const [drivers, setDrivers] = useState<User[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<User | null>(null); // Current selected driver
  const [isDriverOpen, setIsDriverOpen] = useState(false);

  const handleDriverButtonClick = () => {
    setIsDriverOpen(!isDriverOpen);
  };

  const handleDriverSelect = (driver: User) => {
    setSelectedDriver(driver);
    setIsDriverOpen(false);
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

  // Fetch the bus data when the component loads
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`http://localhost:4000/buses/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Bus = await response.json();
        console.log
        setBusName(result.busName);
        setBusNumber(result.busNumber);
        setCapacity(result.capacity);
        setStatus(result.status);
        setRouteId(result.routeId);

        // Fetch the driver based on the driver's ID from the bus data
        if (result.driver) {
          const driverResponse = await fetch(
            `http://localhost:4000/drivers/${result.driver.userId}`
          );
          if (driverResponse.ok) {
            const driverData: User = await driverResponse.json();
            setSelectedDriver(driverData); // Set the selected driver based on the fetched data
          }
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBusLocChannel = async () => {
      try {
        const response = await fetch(`http://localhost:4000/buses/get-loc-channel/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: BusLocationChannel = await response.json();
        setBusLocationChannel(result.channelId)
        setLatFieldNumber(result.latFieldNumber)
        setLongFieldNumber(result.longFieldNumber)

        
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBusPassChannel = async () => {
      try {
        const response = await fetch(`http://localhost:4000/buses/get-pass-channel/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: BusPassengerChannel = await response.json();
        
        setBusPassengerChannel(result.channelId)
        setFieldNumber(result.fieldNumber)
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:4000/drivers/index');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: User[] = await response.json();
        setDrivers(result);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchBusLocChannel();
    fetchBusPassChannel();
    fetchDrivers();
    fetchBus();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!busName.trim()) {
      toast.error('Please enter a bus name');
      return;
    }
    if (!busNumber.trim()) {
      toast.error('Please enter a bus number');
      return;
    }
    if (!capacity) {
      toast.error('Please enter the bus capacity');
      return;
    }
    if (!status.trim()) {
      toast.error('Please enter the bus status');
      return;
    }
    if (!routeId.trim()) {
      toast.error('Please enter a route ID');
      return;
    }

    console.log(selectedDriver)

    try {
      const response = await fetch(`http://localhost:4000/buses/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          busName,
          busNumber,
          capacity,
          status,
          busLocationChannel,
          latFieldNumber,
          longFieldNumber,
          busPassengerChannel,
          fieldNumber,
          userId: selectedDriver ? selectedDriver.id : null, // Send the selected driver ID
          routeId,

        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update bus');
      }

      const updatedBus = await response.json();
      console.log('Bus updated successfully:', updatedBus);
      toast.success('Bus updated successfully');

      // Redirect to the buses page after successful update
      router.push('/buses');
    } catch (error) {
      console.error('Error updating bus:', error);
      toast.error(`Error loading bus data: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    console.log(selectedDriver);
  }, []);

  return (
    <div className="flex flex-col justify-start container mx-auto mt-16 p-4 gap-4 h-[calc(100vh-4rem)]">
      <Toaster position="top-center" />
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
                onChange={(e) => setCapacity(Number(e.target.value))}
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
                onChange={(e) => setBusLocationChannel(e.target.value)}
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

        <div className="flex gap-4 w-full mb-4">
          {/* Driver Selection */}
          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Driver
            </label>
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleDriverButtonClick}
              >
                {selectedDriver
                  ? `Current Driver: ${selectedDriver.name}`
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
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          {`${driver.name}`}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="routeId">Route ID</label>
            <input
              id="routeId"
              placeholder="e.g. 1"
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-gray-200 w-fit h-fit px-10 py-3 rounded-md hover:bg-gray-300 active:bg-gray-200"
        >
          Update Bus
        </button>
      </form>
    </div>
  );
};

export default BusForm;
