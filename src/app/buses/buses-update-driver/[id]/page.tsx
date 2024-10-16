'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const DriverForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Driver Interface
  interface Bus {
    id: string;
    busName: string;
  }

  interface Driver {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phone: string;
    status: string;
    bus: Bus | null; // Driver can have no bus assigned
  }

  // State for loading, error, and form fields
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [busId, setBusId] = useState<string | null>(null);

  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isBusOpen, setIsBusOpen] = useState(false);

  const handleBusButtonClick = () => {
    setIsBusOpen(!isBusOpen);
  };

  const handleBusSelect = (bus: Bus) => {
    setSelectedBus(bus);
    setIsBusOpen(false);
  };

  // Fetch the driver data when the component loads
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`http://localhost:4000/drivers/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Driver = await response.json();
        setFirstName(result.firstName);
        setMiddleName(result.middleName || '');
        setLastName(result.lastName);
        setPhone(result.phone);
        setStatus(result.status);
        setBusId(result.bus?.id || null);
        console.log(result);

        if (result.bus) {
          const busResponse = await fetch(
            `http://localhost:4000/buses/${result.bus.id}`
          );
          if (busResponse.ok) {
            const busData: Bus = await busResponse.json();

            setSelectedBus(busData); // Set the selected bus based on the fetched data
          }
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBuses = async () => {
      try {
        const response = await fetch('http://localhost:4000/buses/index');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Bus[] = await response.json();
        setBuses(result);
      } catch (error) {
        setError((error as Error).message);
        toast.error(`Error loading buses: ${(error as Error).message}`);
      }
    };

    fetchDriver();
    fetchBuses();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!firstName.trim()) {
      toast.error('Please enter a first name');
      return;
    }
    if (!lastName.trim()) {
      toast.error('Please enter a last name');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter a phone number');
      return;
    }
    if (!status.trim()) {
      toast.error('Please enter a status');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/drivers/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          firstName,
          middleName,
          lastName,
          phone,
          status,
          busId: selectedBus ? selectedBus.id : null, // Send the selected bus ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update driver');
      }

      const updatedDriver = await response.json();
      console.log('Driver updated successfully:', updatedDriver);
      toast.success('Driver updated successfully');

      // Redirect to the drivers page after successful update
      router.push('/buses/buses-view-driver');
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error(`Error updating driver: ${(error as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col justify-start container mx-auto mt-16 p-4 gap-4 h-[calc(100vh-4rem)]">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="middleName">Middle Name</label>
            <input
              id="middleName"
              placeholder="e.g. Doe"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              placeholder="e.g. Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              placeholder="e.g. 09123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

        {/* Bus Selection */}
        <div className="flex flex-col mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Current Bus
          </label>
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleBusButtonClick}
            >
              {selectedBus
                ? `Current Bus: ${selectedBus.busName}`
                : 'Select Bus'}
            </button>

            {isBusOpen && (
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
                    buses.map((bus) => (
                      <div
                        key={bus.id}
                        onClick={() => handleBusSelect(bus)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {bus.busName}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-gray-200 w-fit h-fit px-10 py-3 rounded-md hover:bg-gray-300 active:bg-gray-200"
        >
          Update Driver
        </button>
      </form>
    </div>
  );
};

export default DriverForm;
