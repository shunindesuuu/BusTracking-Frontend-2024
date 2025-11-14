'use client';
import React, { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Bus {
  id: string;
  busName: string;
}

const CreateDriver: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBusOpen, setIsBusOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');

  const router = useRouter();

  const handleBusButtonClick = () => {
    setIsBusOpen(!isBusOpen);
  };

  const handleBusSelect = (bus: Bus) => {
    setSelectedBus({ id: bus.id, name: bus.busName });
    setIsBusOpen(false);
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

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch('https://3.27.197.150:4000/buses/index');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Bus[] = await response.json();
        setBuses(result);
      } catch (error) {
        setError((error as Error).message);
        toast.error(`Error loading buses: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const driverData = {
      firstName,
      middleName,
      lastName,
      phone,
      status,
      busId: selectedBus ? selectedBus.id : null,
    };

    try {
      const response = await fetch('https://3.27.197.150:4000/drivers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driverData),
      });

      if (!response.ok) {
        throw new Error('Failed to create driver');
      }

      const createdDriver = await response.json();
      console.log('Driver created successfully:', createdDriver);
      toast.success('Driver created successfully');

      setFirstName('');
      setMiddleName('');
      setLastName('');
      setPhone('');
      setStatus('');
      setSelectedBus(null);
      alert('Driver created successfully!');
      router.push('/buses/buses-view-driver');
    } catch (error) {
      console.error('Error creating driver:', error);
      toast.error(`Error creating driver: ${(error as Error).message}`);
    }
  };

  return (
    <ProtectedComponent restrictedRoles={['user']}>
      <div className="container mx-auto mt-20 p-4">
        <Toaster position="top-center" />
        <div className="bg-white shadow-md rounded-lg w-full p-4">
          <div className="bg-green-500 text-white text-center text-lg font-semibold py-4 rounded-t-lg">
            Create Driver
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 mt-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="middleName"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Bus Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Assign Bus
              </label>
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleBusButtonClick}
                >
                  {selectedBus ? selectedBus.name : 'Select Bus'}
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
              {selectedBus && (
                <div className="mt-2 text-gray-700">
                  Selected Bus: {selectedBus.name} (ID: {selectedBus.id})
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => router.push('/buses-assign-driver')}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Driver
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default CreateDriver;
