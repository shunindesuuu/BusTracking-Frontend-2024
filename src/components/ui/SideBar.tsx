'use client';
import React, { useEffect, useState } from 'react';
import menu from '../utils/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { PiSignOutBold } from 'react-icons/pi';
import ProtectedComponent from './ProtectedComponent';
import NavigationBar from './NavBar';
import SelectComponent from './SelectComponent';
import ProgressBar from './ProgessBar';

const SideBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  //get route name
  interface RouteNames {
    id: number;
    routeName: string;
    routeColor: string;
  }

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:4000/routes/index');  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result); 
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();  
  }, []); 

  return (
    <div className='z-[500]'>
      <ProtectedComponent blockedRoles={['admin, user']}>
        <NavigationBar toggleSidebar={toggleSidebar} />
        <div className="relative flex h-screen">
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 p-10 flex flex-col w-[350px] h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 md:static md:h-auto z-40`}
          >
            <ProtectedComponent blockedRoles={['user']}>
              <div className="flex flex-col justify-start text-base mt-24 space-y-4">
                {menu.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className={`nav-item px-6 py-3 text-black hover:text-[#34C759] rounded-md border border-1 ${
                      pathname === item.link ? 'bg-gray-200 text-green-500' : ''
                    }`}
                    onClick={() => setSidebarOpen(false)} // Close sidebar on link click
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </ProtectedComponent>

            <ProtectedComponent blockedRoles={['admin']}>
              <div className="flex flex-col justify-start text-base mt-24 lg:mt-16 space-y-4 w-full">
                <p className="">Routes</p>

                <SelectComponent routes={routes}/>

                <p className="mt-10 mb-2">Bus Information</p>
                <div className="bg-white h-52 w-full rounded-md border">
                  <div className="bg-white border-b w-full h-1/4 flex items-center justify-between p-2 rounded-t-md">
                    <div className="flex gap-2">
                      <p>Bus Number:</p>
                      <p>12345</p>
                    </div>
                    <p className="underline text-green-400">Toril Line</p>
                  </div>

                  <div className="h-3/4 flex flex-col">
                    <div className="w-full h-fit flex flex-col p-2">
                      <p className="mb-1">Bus Capacity: 50</p>
                      <p className="text-sm ">Taken: 30</p>
                      <p className="text-sm">Available: 20</p>
                    </div>
                    <ProgressBar/>
                    <div className="flex flex-col justify-center align-middle h-1/2 p-2">
                      <div className="flex text-xs justify-between">
                        <p>ADDU</p>
                        <p>GMALL</p>
                        <p>VPLAZA</p>
                        <p>ABRZA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedComponent>
            {session && (
              <div className="flex flex-col mt-auto">
                <p className="text-black border-">
                  {session.user?.name || session.user?.email}
                </p>
                <button
                  onClick={() => signOut()}
                  className="flex items-center text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-900 hover:text-[#34C759] transition duration-150 whitespace-nowrap"
                >
                  <PiSignOutBold className="mr-2" color="green" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Overlay when sidebar is open on mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={toggleSidebar} // Close sidebar when clicking on the overlay
            />
          )}
        </div>
      </ProtectedComponent>
    </div>
  );
};

export default SideBar;
