'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react';

const Statistics = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }
  if (!session) {
    redirect('/login');
  }
  if (session.user?.role !== 'admin') {
    redirect('/');
  }
  return (
    <div className="flex flex-col justify-center container mx-auto mt-16 p-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-center text-2xl font-semibold mb-8">
        Statistics for Bus 1
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Segment Elapsed Time */}
        <div className="w-full sm:w-auto p-4 bg-white border rounded-lg shadow-md max-w-lg">
          <iframe
            width="450"
            height="260"
            style={{ border: '1px solid #cccccc' }}
            src="https://thingspeak.com/channels/2722985/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&title=Segment+Elapsed+Time&type=line&api_key=KS8OU9HWP074GQ5O"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <p className="mt-4 text-sm text-gray-700">
            <strong>Segment Elapsed Time:</strong> This represents the total
            time taken (in milliseconds) to upload a data segment to ThingSpeak.
            It is the duration between the start and end of the data upload
            process, providing insight into the speed of data transmission.
          </p>
        </div>

        {/* Average Throughput */}
        <div className="w-full sm:w-auto p-4 bg-white border rounded-lg shadow-md max-w-lg">
          <iframe
            width="450"
            height="260"
            style={{ border: '1px solid #cccccc' }}
            src="https://thingspeak.com/channels/2722985/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&title=Average+Throughput&type=line&api_key=KS8OU9HWP074GQ5O"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <p className="mt-4 text-sm text-gray-700">
            <strong>Average Throughput:</strong> This measures the data transfer
            rate in bits per second (bps) for a segment upload. It indicates how
            quickly data is being uploaded, calculated by dividing the payload
            size by the elapsed time. Higher throughput means faster data
            transfer.
          </p>
        </div>

        {/* Segment Payload Size */}
        <div className="w-full sm:w-auto p-4 bg-white border rounded-lg shadow-md max-w-lg">
          <iframe
            width="450"
            height="260"
            style={{ border: '1px solid #cccccc' }}
            src="https://thingspeak.com/channels/2722985/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&title=Segment+Payload+Size&type=line&api_key=KS8OU9HWP074GQ5O"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <p className="mt-4 text-sm text-gray-700">
            <strong>Segment Payload Size:</strong> This is the size of the data
            (in bytes) being uploaded to ThingSpeak for each segment. It
            reflects the amount of information sent in one upload, helping to
            understand data usage and efficiency of each upload session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

