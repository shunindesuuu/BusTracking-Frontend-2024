'use client';
import React, { useEffect, useState } from 'react';
import menu from '../utils/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { PiSignOutBold } from 'react-icons/pi';
import ProtectedComponent from './ProtectedComponent';
import NavigationBar from './NavBar';
import ProgressBar from './ProgessBar';

import {
  GlobalContextProvider,
  useGlobalContext,
} from '@/app/Context/busContext';
import SelectedBus from './SelectedBus';
import SideBarDriver from './SideBarDriver';

const SideBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="z-[500]">
      <ProtectedComponent restrictedRoles={['admin, user']}>
        <NavigationBar toggleSidebar={toggleSidebar} />
        <div className="relative flex h-screen">
          <div
            className={`fixed top-0 left-0 p-5 flex flex-col w-[350px] h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } md:translate-x-0 md:static md:h-auto z-40`}
          >
            <ProtectedComponent restrictedRoles={['user', 'driver']}>
              <div className="flex flex-col justify-start text-base mt-24 space-y-4">
                {menu.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className={`nav-item px-6 py-3 text-black rounded-md border border-1 ${pathname === item.link
                        ? 'bg-green-500 text-white'
                        : 'hover:bg-gray-100'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}

                <SelectedBus />
              </div>
            </ProtectedComponent>

            {/* user view */}
            <ProtectedComponent restrictedRoles={['admin', 'driver']}>
              <SelectedBus />
            </ProtectedComponent>

            {/* driver view */}
            <ProtectedComponent restrictedRoles={['admin', 'user']}>
              <SideBarDriver />
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

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={toggleSidebar}
            />
          )}
        </div>
      </ProtectedComponent>
    </div>
  );
};

export default SideBar;
