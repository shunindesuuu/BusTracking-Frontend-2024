'use client';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import { useRouter } from 'next/navigation';
import React from 'react';

const BusesAssignDriver: React.FC = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/buses');
  };
  return (
    <ProtectedComponent blockedRoles={['admin']}>
      <div className="container mx-auto mt-20 p-4">
        <button
          type="button"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleBackClick}
        >
          Back
        </button>
        <div className="bg-white shadow-md rounded-lg w-full p-4">
          <table
            className="min-w-full leading-normal border-2 border-gray-100"
            style={{ backgroundColor: '#f2f2f2' }}
          >
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  #
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Assigned Route
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Bus Number
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-500 text-left text-base font-semibold text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  1
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  John Doe
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Route A
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Bus 101
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Active
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Edit | Delete
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  2
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Jane Smith
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Route B
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Bus 102
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Inactive
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Edit | Delete
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  3
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Sam Wilson
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Route C
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Bus 103
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Active
                </td>
                <td className="px-5 py-5 border-b border-gray-500 text-sm text-black">
                  Edit | Delete
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default BusesAssignDriver;
