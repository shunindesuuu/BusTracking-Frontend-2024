'use client';
import DrawRoute from '@/components/ui/DrawRoute';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedComponent from '@/components/ui/ProtectedComponent';

const CreateBus: React.FC = () => {
  const [showDrawRoute, setShowDrawRoute] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    setShowDrawRoute(true);
  };

  const handleBackClick = () => {
    router.push('/buses');
  };

  return (
    <ProtectedComponent blockedRoles={['admin']}>
    <div className="container mx-auto mt-20 p-4">
      <div className="bg-white shadow-md rounded-lg w-full p-4">
        <div className="bg-green-500 text-white text-center text-lg font-semibold py-4 rounded-t-lg ">
          Create Bus
        </div>
        <form>
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
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="driver"
            >
              Driver
            </label>
            <input
              type="text"
              id="driver"
              name="driver"
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Add Route
            </label>
            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleButtonClick}
            >
              Draw Route
            </button>
          </div>
          {showDrawRoute && <DrawRoute />}
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleBackClick}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
    </ProtectedComponent>
  );
};

export default CreateBus;
