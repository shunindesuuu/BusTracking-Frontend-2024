import Link from 'next/link';

const Buses: React.FC = () => {
  return (
    <div className="flex justify-center container mx-auto mt-20 p-4 gap-4">
      <Link
        href="/buses-view-buses"
        className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
      >
        View Buses
      </Link>
      <Link
        href="/buses-assign-driver"
        className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
      >
        Assign Driver
      </Link>
      <Link
        href="/create-bus"
        className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
      >
        Create Bus
      </Link>
    </div>
  );
};

export default Buses;
