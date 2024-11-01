"use client";
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


const Buses: React.FC = () => {
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
    <ProtectedComponent restrictedRoles={['user, driver']}>
      <div className="flex justify-center container mx-auto mt-20 p-4 gap-4">
        <Link
          href="/buses/buses-view-buses"
          className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
        >
          View Buses
        </Link>

        <Link
          href="/buses/create-bus"
          className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
        >
          Create Bus
        </Link>

        <Link
          href="/buses/buses-view-driver"
          className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
        >
          View Drivers
        </Link>
      </div>
    </ProtectedComponent>
  );
};

export default Buses;
