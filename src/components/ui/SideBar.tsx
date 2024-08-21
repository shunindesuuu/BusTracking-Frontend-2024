'use client';
import React, { useState } from 'react';
import menu from '../utils/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa6';
import { useSession, signOut } from 'next-auth/react';
import { PiSignOutBold } from "react-icons/pi";

const SideBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative flex h-screen">
      {!isSidebarOpen && (
        <button
          className="md:hidden p-4 text-gray-800 z-50 absolute top-1/2 left-0 transform -translate-y-1/2"
          onClick={toggleSidebar}
        >
          <FaArrowRight className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 p-10 flex flex-col w-[250px] h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:h-auto z-40`}
      >
        <div className="flex flex-col justify-start text-base mt-24 space-y-4">
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className={`nav-item px-6 py-3 text-black hover:text-[#34C759] rounded-md border border-1 ${pathname === item.link ? 'bg-gray-200 text-green-500' : ''
                }`}
              onClick={() => setSidebarOpen(false)} // Close sidebar on link click
            >
              {item.title}
            </Link>
          ))}
        </div>
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
  );
};

export default SideBar;
