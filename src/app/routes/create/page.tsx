"use client"
import React, { useState } from 'react';
import { LatLngExpression } from 'leaflet';
import DrawRoute from '@/components/ui/DrawRoute';
import { useRouter } from 'next/navigation'

const RouteForm: React.FC = () => {
    const router = useRouter();
    const [routeName, setRouteName] = useState('');
    const [routeColor, setRouteColor] = useState(''); // Default color
    const [latlngs, setLatlngs] = useState<{ pointOrder: number; latitude: number; longitude: number }[]>([]);
  
    const handleSubmit = async (e: React.FormEvent) => {
        console.log(latlngs)
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
  
        <DrawRoute onUpdateLatLngs={setLatlngs} color={routeColor} />
  
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