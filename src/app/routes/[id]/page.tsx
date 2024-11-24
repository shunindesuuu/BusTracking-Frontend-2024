'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';


const page = () => {
  const params = useParams();
  const { id } = params;

  const searchParams = useSearchParams();
  const routeName = searchParams.get('routeName') || '';

  const router = useRouter();

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
    route: Route
  }

  interface RouteChannel {
    id: string,
    channelId: string,
    fieldNumber: string,
  }

  interface Feed {
    created_at: string;
    entry_id: number;
    [key: string]: any; // Allows for dynamic fields like field1, field2, etc.
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
    feeds: Feed[];
  }


  const [buses, setBuses] = useState<Buses[]>([]);
  const [channel, setChannel] = useState<RouteChannel | undefined>(undefined);
  const [data, setData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [totalCapacity, setTotalCapacity] = useState<number>(0);
  const [latestPassengers, setLatestPassengers] = useState<string | null>(null)

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);



  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`https://3.27.197.150:4000/buses/index/route/${id}`);
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
        const response = await fetch(`https://3.27.197.150:4000/thingspeak/channel/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteChannel = await response.json();
        setChannel(result);
        console.log(result)

      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }



    fetchThingSpeakChannel();
    fetchBuses();
  }, []);

  // Function to fetch data from ThingSpeak
  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.thingspeak.com/channels/${channel?.channelId}/fields/${channel?.fieldNumber}.json?results=20`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setData(data); // Update the state with the fetched data
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  function getLastNonNullValue(feeds: Feed[], routeChannel: RouteChannel): string | null {
    const dynamicField = "field" + routeChannel.fieldNumber;

    // Iterate from the last element to the first
    for (let i = feeds.length - 1; i >= 0; i--) {
      const feed = feeds[i];
      const fieldValue = feed[dynamicField];

      // Check if the value is not `null` or the string `"null"`
      if (fieldValue !== null && fieldValue !== "null" && fieldValue !== undefined) {
        return fieldValue; // Return the first non-null value found
      }
    }
    return null; // Return null if no non-null value is found
  }



  useEffect(() => {
    fetchData(); // Initial fetch

    // Set up interval to fetch data every 15 seconds
    const intervalId = setInterval(fetchData, 15000);

    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [channel]);

  // Example: Getting the last non-null value when data and channel are available
  useEffect(() => {
    if (data && channel) {
      const lastNonNullValue = getLastNonNullValue(data.feeds, channel);
      setLatestPassengers(lastNonNullValue)
      console.log('Last non-null value for', channel.fieldNumber, ':', lastNonNullValue);
    }
  }, [data, channel]);

  const confirmArchive = async () => {
    try {
      const response = await fetch(`https://3.27.197.150:4000/routes/archive/${id}`);
      console.log(response)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.push('/routes'); 

    } catch (error) {
      setError((error as Error).message);  
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return <div>Error: Route ID is missing.</div>;
  }

  // const routeName = buses[0]?.route.routeName;


  return (
    <div className="flex flex-col min-w-[320px] mx-auto mt-24 lg:mt-20 px-3 xs:px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      <div className='flex justify-between items-center'>
        <div>{routeName}</div>
        <div className='flex gap-2'>
        <Link id='editbutton' href={`${id}/update/${id}`} className='bg-gray-200 hover:bg-gray-100 active:bg-gray-200 h-fit w-fit px-5 py-1 rounded-md'>Edit</Link>
        <button className='bg-red-500 hover:bg-red-300 active:bg-red-200 h-fit w-fit px-5 py-1 rounded-md text-white' onClick={(e) => setModalVisible(true)}>Archive</button>
        </div>
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
        <Link
          href={`${id}/sections?routeName=${encodeURIComponent(routeName)}`}
          className="flex-grow flex-col h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
        >
          <div>Sections</div>
        </Link>
      </div>

      <div className="w-full mt-5 h-fit flex gap-3 flex-col">
        <div>
          <div>Live Passenger Count</div>
          {channel ? (
            <iframe
              src={`https://api.thingspeak.com/channels/${channel?.channelId}/charts/${channel?.fieldNumber}?dynamic=true&width=auto&height=auto&yaxis=Number%20of%20Passengers`}
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
          {channel ? (
            <iframe
              src={`https://api.thingspeak.com/channels/${channel.channelId}/charts/${channel.fieldNumber}?dynamic=true&average=60&title=Average%20Per%20Hour&width=auto&height=auto&yaxis=Number%20of%20Passengers`}
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
            {channel ? (
              <iframe
                src={`https://api.thingspeak.com/channels/${channel?.channelId}/charts/${channel?.fieldNumber}?dynamic=true&average=daily&title=Average%20Per%20Day&width=auto&height=auto&yaxis=Number%20of%20Passengers`}
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

       {/* Modal */}
       {modalVisible && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold">Confirm Archive</h2>
              <p>
                Are you sure you want to archive {routeName} route?
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setModalVisible(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmArchive}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );

}


export default page