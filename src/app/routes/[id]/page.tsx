'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const page = () => {
  const params = useParams();
  const { id } = params;

  const searchParams = useSearchParams();
  const routeName = searchParams.get('routeName') || '';
  // Define the Route interface
interface Route {
  id: string;
  routeName: string;
  routeColor: string;
}
  interface Buses {
    id: number;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string
    route:Route
  }

  interface RouteChannel {
    id: string,
    apiKey: string,
    channelId: string,
    fieldNumber: string,
  }
  // Define the structure for the feed data
interface Feed {
  created_at: string;
  entry_id: number;
  [key: string]: any; // This allows for dynamic fields (e.g., field1, field2, etc.)
}

  // Define the type for the data you expect to fetch
interface ChannelData {
  channel: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    field1: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: Array<{
    created_at: string;
    entry_id: number;
    field1: string;
  }>;
}


  const [buses, setBuses] = useState<Buses[]>([]);
  const [channel, setChannel] = useState<RouteChannel | undefined>(undefined);
  const [data, setData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [totalCapacity, setTotalCapacity] = useState<number>(0);
  // const latestPassengers = data?.feeds.length ? data.feeds[0].field1 : '0';
  const [latestPassengers, setLatestPassengers] = useState(null);



  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`http://localhost:4000/buses/index/route/${id}`);  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Buses[] = await response.json();
        setBuses(result);

        // Calculate total capacity
        const total = result.reduce((sum, bus) => sum + bus.capacity, 0);
        setTotalCapacity(total);
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    };

    const fetchThingSpeakChannel = async () => {
      try {
        const response = await fetch(`http://localhost:4000/thingspeak/channel/${id}`);  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteChannel = await response.json();
        setChannel(result);
        // console.log(result.channelId)
  
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    }

    

    fetchThingSpeakChannel();
    fetchBuses();  
  }, []);

  useEffect(() => {
    if (channel?.id && channel?.fieldNumber) {
      fetch(`https://api.thingspeak.com/channels/${channel.channelId}/fields/${channel.fieldNumber}.json?results=20`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Find the latest non-null value
          const nonNullFeeds = data.feeds.filter((feed: Feed) => feed[`field${channel.fieldNumber}`] !== null);
          if (nonNullFeeds.length > 0) {
            setLatestPassengers(nonNullFeeds[nonNullFeeds.length - 1][`field${channel.fieldNumber}`]);
          } else {
            setLatestPassengers(null); // No valid data found
          }
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  }, [channel]);

  if (!id) {
    return <div>Error: Route ID is missing.</div>;
  }

  // const routeName = buses[0]?.route.routeName;


  return (
    <div className="flex flex-col justify-center container mx-auto mt-16 p-5">
      <div className='flex justify-between items-center'>
      <div>{routeName}</div>
      <Link id='editbutton' href={`${id}/update/${id}`} className='bg-gray-200 hover:bg-gray-100 active:bg-gray-200 h-fit w-fit px-5 py-1 rounded-md'>Edit</Link>
      </div>
      <div className="flex justify-center container mx-auto gap-4 mt-3">
        <Link
          href={`${id}/buses?routeName=${encodeURIComponent(routeName)}`}
          className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
        >
          <div>Buses</div>
          <div>{buses.length}</div>
        </Link>
        <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
          <div>Capacity</div>
          <div>{totalCapacity}</div>
        </div>
        <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
          <div>Passengers</div>
          <div>{latestPassengers}</div>
        </div>
        <div className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all">
          <div>Stops</div>
          <div>TBA</div>
        </div>
      </div>

      <div className="w-full mt-5 h-fit flex gap-3 flex-col">
        <div>
          <div>Live Passenger Count</div>
            {channel ? (
              <iframe
              src={`https://api.thingspeak.com/channels/${channel?.channelId}/charts/${channel?.fieldNumber}?dynamic=true`}
              className="w-full  h-[250px] border"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            )
            :(
              <div className="w-full h-60 bg-gray-100 rounded-lg flex justify-center items-center text-red-500">Not Connected</div>
            )}

        </div>

        <div>
          <div>Average Per Hour</div>
          {channel ? (
              <iframe
                src={`https://api.thingspeak.com/channels/${channel.channelId}/charts/${channel.fieldNumber}?dynamic=true&average=60&title=Average%20Per%20Hour`}
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
            {channel ?(<iframe
              src={`https://api.thingspeak.com/channels/${channel?.channelId}/charts/${channel?.fieldNumber}?dynamic=true&average=daily&title=Average%20Per%20Day`}
              className="w-full h-[250px] border"
              frameBorder="0"
              allowFullScreen
            ></iframe>):(
              <div className="w-full h-60 bg-gray-100 rounded-lg flex justify-center items-center text-red-500">Not Connected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default page