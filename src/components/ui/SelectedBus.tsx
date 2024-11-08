"use client";
import { useGlobalContext } from '@/app/Context/busContext';
import { useEffect } from 'react';
import ProgressBar from './ProgessBar';

const SelectedBus = () => {
    const { data, setData } = useGlobalContext();

    let percent: number = (parseInt(data?.passCount || "0") / (data?.capacity || 1)) * 100;

    useEffect(() => {
        console.log("Selected bus data from context:", data);
      }, [data]); 

  if (!data) {
    return <div className='bg-gray-100 h-fit rounded-md border p-3 mt-16'>
              <p className="">Select Bus</p>

    </div>; // Shows when data is null or undefined
  }

  return (
    <div className="flex flex-col justify-start text-base mt-24 lg:mt-16  w-full">

  <div className="bg-white h-fit w-full border rounded-md">
    <div className="bg-white border-b w-full h-1/4 flex items-center justify-between p-2  rounded-md">
      <div className="flex gap-2">
        <p>Bus Number:</p>
        <p>{data.busNumber}</p> {/* Display bus number */}
      </div>
      <p className="underline text-green-400">{data.route}</p> {/* Display route name */}
    </div>

    <div className="h-3/4 flex flex-col p-3 rounded-b-md">
      <div className="w-full h-fit flex flex-col ">
        <p className="">Bus Capacity: {data.capacity}</p> {/* Display capacity */}
        <p className="">Taken: {data.passCount}</p> {/* Display passenger count */}
        <p className="  ">Available: {data.capacity - parseInt(data.passCount)}</p> {/* Calculate available seats */}
      </div>

      <ProgressBar data={percent} /> {/* Assuming this is a component to display bus capacity usage */}
    </div>
  </div>
</div>

  );
};

export default SelectedBus;
