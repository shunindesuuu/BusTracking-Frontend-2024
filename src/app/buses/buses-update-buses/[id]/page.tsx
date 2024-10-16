'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

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

  interface Driver {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  }

  // State for loading, error, and form fields
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [busName, setBusName] = useState<string>('');
  const [busNumber, setBusNumber] = useState<string>('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('');
  const [routeId, setRouteId] = useState<string>('');

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null); // Current selected driver
  const [isDriverOpen, setIsDriverOpen] = useState(false);

  const handleDriverButtonClick = () => {
    setIsDriverOpen(!isDriverOpen);
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDriverOpen(false);
  };

  // Fetch the bus data when the component loads
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`http://localhost:4000/buses/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Bus = await response.json();
        setBusName(result.busName);
        setBusNumber(result.busNumber);
        setCapacity(result.capacity);
        setStatus(result.status);
        setRouteId(result.routeId);

        // Fetch the driver based on the driver's ID from the bus data
        if (result.driver) {
          const driverResponse = await fetch(
            `http://localhost:4000/drivers/${result.driver.id}`
          );
          if (driverResponse.ok) {
            const driverData: Driver = await driverResponse.json();
            setSelectedDriver(driverData); // Set the selected driver based on the fetched data
          }
        }
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
        const result: Driver[] = await response.json();
        setDrivers(result);
      } catch (error) {
        setError((error as Error).message);
      }
    };

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
          driverId: selectedDriver ? selectedDriver.id : null, // Send the selected driver ID
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
        <div className="flex gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="busName">Bus Name</label>
            <input
              id="busName"
              placeholder="e.g. Bus 1"
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="busNumber">Bus Number</label>
            <input
              id="busNumber"
              placeholder="e.g. 1234"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              type="number"
              placeholder="e.g. 50"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="status">Status</label>
            <input
              id="status"
              placeholder="e.g. Active"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
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
                  ? `Current Driver: ${selectedDriver.firstName} ${selectedDriver.middleName ? selectedDriver.middleName + ' ' : ''}${selectedDriver.lastName}`
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
                          {`${driver.firstName} ${driver.middleName ? driver.middleName + ' ' : ''}${driver.lastName}`}
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
