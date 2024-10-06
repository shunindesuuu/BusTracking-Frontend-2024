'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const BusForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Bus Interface (based on your backend structure)
  interface Bus {
    id: number;
    busName: string;
    busNumber: string;
    capacity: number;
    status: string;
    driver: string;
    routeId: string;
  }

  // State for loading, error, and form fields
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [busName, setBusName] = useState<string>('');
  const [busNumber, setBusNumber] = useState<string>('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('');
  const [driver, setDriver] = useState<string>('');
  const [routeId, setRouteId] = useState<string>('');

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
        setDriver(result.driver);
        setRouteId(result.routeId);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          driver,
          routeId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update bus');
      }

      const updatedBus = await response.json();
      console.log('Bus updated successfully:', updatedBus);

      // Redirect to the buses page after successful update
      router.push('/buses');
    } catch (error) {
      console.error('Error updating bus:', error);
    }
  };

  return (
    <div className="flex flex-col justify-start container mx-auto mt-16 p-4 gap-4 h-[calc(100vh-4rem)]">
      <div className="flex gap-4 w-full ">
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

      <div className="flex gap-4 w-full">
        <div className="flex flex-col">
          <label htmlFor="driver">Driver</label>
          <input
            id="driver"
            placeholder="e.g. John Doe"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className="h-fit w-fit p-2 border-2 rounded-md"
          />
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
        onClick={handleSubmit}
        className="bg-gray-200 w-fit h-fit px-10 py-3 rounded-md hover:bg-gray-300 active:bg-gray-200"
      >
        Update Bus
      </button>
    </div>
  );
};

export default BusForm;
