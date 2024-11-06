"use client";
import { useGlobalContext } from '@/app/Context/busContext';
import { useEffect } from 'react';

const SelectedBus = () => {
    const { data, setData } = useGlobalContext();

    // Simulate fetching sample bus data
    // useEffect(() => {
    //   const sampleBusData = {
    //     id: "1",
    //     routeId: "R123",
    //     busNumber: "12345",
    //     capacity: 50,
    //     status: "onroad",
    //     busName: "City Bus 101",
    //     passCount: "30", // Example: 30 passengers currently on board
    //   };
  
    //   // Set the sample data to context (simulate data fetch)
    //   setData(sampleBusData);
  
    //   console.log("Sample bus data set in context:", sampleBusData); // Log sample data
    // }, [setData]);

    useEffect(() => {
        console.log("Selected bus data from context:", data);
      }, [data]); 

  if (!data) {
    return <div className='bg-slate-100 p-3 h-fit rounded-md'>Selected Bus</div>; // Shows when data is null or undefined
  }

  return (
    <div className="mt-20">
      <div className="bg-slate-100 p-3 h-fit rounded-md">
        <h2 className="text-lg mb-2">Selected Bus</h2>
        <div className="border-2 mb-4"></div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <span className="font-medium">Bus Name:</span>
            <span className="ml-2">{data.busName}</span> {/* Display bus name */}
          </div>

          <div className="flex items-center">
            <span className="font-medium">Bus Number:</span>
            <span className="ml-2">{data.busNumber}</span> {/* Display bus number */}
          </div>

          <div className="flex items-center">
            <span className="font-medium">Capacity:</span>
            <span className="ml-2">{data.capacity}</span> {/* Display capacity */}
          </div>

          <div className="flex items-center">
            <span className="font-medium">Passengers:</span>
            <span className="ml-2">{data.passCount}</span> {/* Display passenger count */}
          </div>

          <div className="flex items-center">
            <span className="font-medium">Available Seats:</span>
            <span className="ml-2">{data.capacity - parseInt(data.passCount)}</span> {/* Calculate available seats */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedBus;
