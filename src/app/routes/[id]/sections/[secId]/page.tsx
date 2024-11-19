'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {

const { secId } = useParams();
const searchParams = useSearchParams();
const sectionName = searchParams.get('sectionName') || '';

interface Section {
    id: string,
    routeId: string,
    sectionName: string,
    channelId: string,
    fieldNumber: string,
    passCount: string
  }


  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`https://3.27.197.150:4000/routes/get-section/${secId}`);  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Section= await response.json();
        setSection(result);
        console.log(result)
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    };

    fetchSections();  
    
    // Set up interval to fetch buses every 15 seconds
      const intervalId = setInterval(fetchSections, 15000);

      // Clear interval on component unmount
      return () => {
          clearInterval(intervalId);
      };
  }, []);



  return (
    <div className="flex flex-col justify-center container mx-auto mt-16 p-5">
        <div>{sectionName} Section</div>

        <div className="w-full mt-5 h-fit flex gap-3 flex-col">
        <div>
          <div>Live Passenger Count</div>
          {section ? (
            <iframe
              src={`https://api.thingspeak.com/channels/${section?.channelId}/charts/${section?.fieldNumber}?dynamic=true&width=auto&height=auto&yaxis=Number%20of%20Passengers`}
              className="w-full h-[250px] border" 
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-60 bg-gray-100 rounded-lg flex justify-center items-center text-red-500">Not Connected</div>
          )}
        </div>
  
        <div>
          <div>Average Per Hour</div>
          {section ? (
            <iframe
              src={`https://api.thingspeak.com/channels/${section.channelId}/charts/${section.fieldNumber}?dynamic=true&average=60&title=Average%20Per%20Hour&width=auto&height=auto&yaxis=Number%20of%20Passengers`}
              className="w-full h-[250px] border"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-60 bg-gray-100 rounded-lg flex justify-center items-center text-red-500">Not Connected</div>
          )}
        </div>
  
        <div>
          <div>Average Per Day</div>
          <div className="w-full h-fit bg-gray-200 rounded-lg">
            {section ? (
              <iframe
                src={`https://api.thingspeak.com/channels/${section?.channelId}/charts/${section?.fieldNumber}?dynamic=true&average=daily&title=Average%20Per%20Day&width=auto&height=auto&yaxis=Number%20of%20Passengers`}
                className="w-full h-[250px] border"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-60 bg-gray-100 rounded-lg flex justify-center items-center text-red-500">Not Connected</div>
            )}
          </div> 
        </div>
      </div>
    </div>
  )
}

export default page