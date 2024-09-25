'use client';
import { useState, useEffect } from 'react';
import DisplayMap from '@/components/ui/DisplayMap';

interface RouteNames {
  id: number;
  routeName: string;
  routeColor: string;
}

const Driver = () => {
  const [selectedRoute, setSelectedRoute] = useState<RouteNames | null>(null);
  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the routes from the backend API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/routes/index/coordinates'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result);
        if (result.length > 0) {
          setSelectedRoute(result[0]); // Default to the first route
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Handle route selection
  const handleRouteSelect = (route: RouteNames) => {
    setSelectedRoute(route);
  };

  // Fake bus data for seat display
  const busCapacity = 100;
  const takenSeats = 75;
  const availableSeats = busCapacity - takenSeats;

  // Generate seat grid
  const seatGrid = Array.from({ length: busCapacity }).map((_, index) => (
    <div
      key={index}
      className={`w-6 h-6 m-1 ${
        index < takenSeats ? 'bg-green-500' : 'bg-gray-300'
      }`}
    ></div>
  ));

  // Display error or loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center bg-white p-4 min-h-screen">
      {/* Header */}
      <header className="w-full flex justify-between items-center bg-green-500 p-2">
        <h1 className="text-white font-bold">Bus Number 4132</h1>
        <button className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 7h5m0 0V2m0 5l-6 6m0 0l-6 6M9 13h5m0 0l-6 6m0 0V2"
            />
          </svg>
        </button>
      </header>

      {/* Route Selection */}
      <div className="my-4">
        <label className="block text-black font-bold mb-2">
          Change Destination
        </label>
        <div className="flex space-x-4">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => handleRouteSelect(route)}
              className={`p-2 rounded border ${
                selectedRoute?.id === route.id
                  ? route.routeColor
                  : 'bg-gray-200'
              } text-white`}
            >
              {route.routeName}
            </button>
          ))}
        </div>
      </div>

      {/* Seat Availability Legend */}
      <div className="flex justify-around w-full mb-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 mr-2"></div>
          <span>Taken</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 mr-2"></div>
          <span>Available</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-10 gap-2 mb-4">{seatGrid}</div>

      {/* Seat Details */}
      <div className="text-center">
        <p>Bus Capacity: {busCapacity}</p>
        <p>Taken: {takenSeats}</p>
        <p>Available: {availableSeats}</p>
        <p className="text-red-600 font-bold">
          Warning: {Math.round((takenSeats / busCapacity) * 100)}% Bus Capacity
        </p>
      </div>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 w-full bg-green-500 flex justify-around py-2">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19l7-7-7-7"
            />
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </footer>

      {/* Display Map Component */}
      <DisplayMap selectedRoute={selectedRoute?.routeName || ''} />
    </div>
  );
};

export default Driver;
