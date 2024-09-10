import ProtectedComponent from '@/components/ui/ProtectedComponent';
import Link from 'next/link';

const Buses: React.FC = () => {
  let routes: { id: string, routeName: string }[] = [
    { id: "111111", routeName: "Route 1" },
    { id: "222222", routeName: "Route 2" },
    { id: "333333", routeName: "Route 3" }
  ]

  return (
    <ProtectedComponent blockedRoles={['user']}>
      <div className="flex  flex-col justify-center container mx-auto mt-16 p-4 gap-4">
        <Link id='createbutton' href={`/routes/create`} className='bg-gray-200 hover:bg-gray-100 active:bg-gray-200 h-fit w-fit p-2 rounded-md'>Create Route</Link>
        <div className='flex gap-4'>
        {routes.map((route) => (
          <Link
            key={route.id}  // Adding the key prop here
            href={`/routes/${route.id}`}
            className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
          >
            {route.routeName}
          </Link>
        ))}
        </div>
      </div>
    </ProtectedComponent>
  );
};

export default Buses;
