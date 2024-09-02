import Link from 'next/link';

const Buses: React.FC = () => {
    let routes: {id:string,routeName:string}[] = [
        { id: "111111", routeName: "Route 1" },
        { id: "222222", routeName: "Route 2" },
        { id: "333333", routeName: "Route 3" }
      ]

  return (
    <div className="flex justify-center container mx-auto mt-20 p-4 gap-4">
        {routes.map((route)=>(
            <Link
            id={route.id}
            href={`/routes/${route.id}`}
            className="flex-grow h-20 bg-gray-100 flex items-center justify-center text-center rounded-md shadow-md hover:bg-gray-200 transition-all"
          >
           {route.routeName}
          </Link>

        ))}
      
     
    </div>
  );
};

export default Buses;
