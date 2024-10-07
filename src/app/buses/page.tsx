import ProtectedComponent from '@/components/ui/ProtectedComponent';
import Link from 'next/link';

const Buses: React.FC = () => {
  return (
    <ProtectedComponent restrictedRoles={['user']}>
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
