"use client"
import React, { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import DrawRoute from '@/components/ui/DrawRoute';
import { useParams, useRouter } from 'next/navigation'

const RouteForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
  const { id } = params;

    interface Coordinate {
      pointOrder: number;
    latitude: number;
    longitude: number;
  }

  interface Route {
    id: number;
    routeName: string;
    routeColor: string;
    coordinates: Coordinate[];  // Use Coordinate array for lat/long pairs
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [routeName, setRouteName] = useState('');
    const [routeColor, setRouteColor] = useState(''); // Default color
    const [latlngs, setLatlngs] = useState<{ pointOrder: number; latitude: number; longitude: number }[]>([]);
 
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(`http://localhost:4000/routes/get-route/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Route = await response.json();
        setRouteName(result.routeName);
        setRouteColor(result.routeColor)
        setLatlngs(result.coordinates)
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, []);

  // useEffect(() => {
  //   console.log(latlngs)
  // }, [latlngs]);

    
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const response = await fetch('http://localhost:4000/routes/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            routeName,
            routeColor,
            coordinates: latlngs
          }),
        });
    
        if (response.ok) {
          router.push('/routes');
        } else {
          // Handle error
        }
      };

      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error}</div>;
      }
  
    return (
      <div className="flex flex-col justify-start container mx-auto mt-16 p-4 gap-4 h-[calc(100vh-4rem)]">
        <div className="flex gap-4 w-full ">
          <div className="flex flex-col">
            <label htmlFor="routeName">Route Name</label>
            <input
              id="routeName"
              placeholder="eg. route 1"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="routeColor">Route Color</label>
            <input
              id="routeColor"
              placeholder="e.g. blue"
              value={routeColor}
              onChange={(e) => setRouteColor(e.target.value)}
              className="h-fit w-fit p-2 border-2 rounded-md"
            />
          </div>
        </div>
  
        <DrawRoute onUpdateLatLngs={setLatlngs} color={routeColor}    initialLatlngs={latlngs.length > 0 ? latlngs : undefined}/>
  
        <button
          type='submit'
          onClick={handleSubmit}
          className='bg-gray-200 w-fit h-fit px-10 py-3 rounded-md hover:bg-gray-300 active:bg-gray-200'>
          Create
        </button>
  
      </div>
    );
  };
  
  export default RouteForm;