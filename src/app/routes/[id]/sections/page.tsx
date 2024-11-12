'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {

    const { id } = useParams();
    const searchParams = useSearchParams();
  const routeName = searchParams.get('routeName') || '';

  interface Sections {
    id: string,
    routeId: string,
    sectionName: string,
    channelId: string,
    fieldNumber: string,
    passCount: string
  }


  const [sections, setSections] = useState<Sections[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`http://localhost:4000/routes/sections/${id}`);
        console.log(response)
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }


        const result: Sections[] = await response.json();
        setSections(result);
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
        {routeName}

        <table className="min-w-full divide-y divide-gray-200 mt-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {sections.map((section) => (
                <tr key={section.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{section.sectionName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{section.passCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`sections/${section.id}?sectionName=${encodeURIComponent(section.sectionName)}`}>
                      View More
                    </Link>
                  </td>
                </tr>
              ))}
        </tbody>
        </table>
    </div>
  )
}

export default page