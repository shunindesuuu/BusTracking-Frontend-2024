"use client";

import React, { useState } from 'react';
import { LatLngExpression } from 'leaflet';
import DrawRoute from '@/components/ui/DrawRoute';
import { useRouter } from 'next/navigation';
import { Dialog, DialogOverlay, DialogContent, DialogClose } from '@radix-ui/react-dialog';

const RouteForm: React.FC = () => {

  type LatLng = {
    pointOrder: number;
    latitude: number;
    longitude: number;
  };
  
  // Define the PathArray type
  type PathArray = {
    pathNumber: number;
    coordinates: LatLng[];
  };
    const router = useRouter();
    const [routeName, setRouteName] = useState('');
    const [routeColor, setRouteColor] = useState(''); // Default color
    const [latlngs, setLatlngs] = useState<LatLng[]>([]);
    const [pathArray, setPathArray] = useState<PathArray[]>([]);

    const updatePathArray = () => {
      setPathArray(prevPathArray => {
        // Set pathNumber to the current length of pathArray
        const pathNumber = prevPathArray.length + 1;
    
        // Create a new coordinates array based on latlngs
        const newCoordinates = [...latlngs];
    
        // Create the new path object
        const newPath: PathArray = {
          pathNumber,
          coordinates: newCoordinates,
        };
    
        // Return the updated path array with the new path added
        return [...prevPathArray, newPath];
      });
    };

    const [isOpen, setIsOpen] = useState(false);

   
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
                paths: pathArray,
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
            <div className="flex gap-4 w-full">
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

            {pathArray &&(
              pathArray.map((path=>(
              <div className='flex gap-1'> 
               <div>Path</div>
               <div> {path.pathNumber}</div>
              </div>)))
            )}

            {/* Add Path Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gray-200 w-fit h-fit px-10 py-3 rounded-md hover:bg-gray-300 active:bg-gray-200"
            >
                Add Path
            </button>

            {/* Modal with DrawRoute component */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                <DialogContent className="fixed top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-md shadow-md w-[95vw] h-[80vh] max-w-5xl flex flex-col">
                    {/* DrawRoute component in the modal */}
                    <div className="flex-1">
                        <DrawRoute 
                            onUpdateLatLngs={setLatlngs} 
                            color={routeColor} 
                        />
                    </div>

                    <DialogClose asChild>
                        <button className="mt-4 bg-gray-300 px-4 py-2 rounded-md w-fit hover:bg-gray-400"
                        onClick={updatePathArray}
                        >
                            Close
                        </button>
                    </DialogClose>
                </DialogContent>
            </Dialog>

            {/* Create Route Button */}
            <button
                type="submit"
                onClick={handleSubmit}
                className="bg-gray-200 w-fit h-fit px-10 py-3 rounded-md hover:bg-gray-300 active:bg-gray-200"
            >
                Create
            </button>
        </div>
    );
};

export default RouteForm;
