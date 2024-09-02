'use client'
import React from 'react'
import { useParams } from 'next/navigation';
import Link from 'next/link';

const page = () => {
  const params = useParams();
  const { id } = params;

  if (!id) {
    return <div>Error: Route ID is missing.</div>;
  }

  return (
    <div className="flex flex-col justify-center container mx-auto mt-20">
      <div>Route {id}</div>
      <div className="flex justify-center container mx-auto gap-4 mt-3">
      <Link
        href={`${id}/buses`}
        className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
      >
        <div>Buses</div>
        <div>10</div>
      </Link>
      <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
        <div>Capacity</div>
        <div>1000</div>
      </div>
      <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
        <div>Passengers</div>
        <div>800</div>
      </div>
      <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
        <div>Stops</div>
        <div>8</div>
      </div>
      </div>
    </div>
  );
}


export default page