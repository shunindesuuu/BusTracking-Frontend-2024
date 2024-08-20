'use client';
import React, { useState } from 'react';
import menu from '../utils/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GiHamburgerMenu } from 'react-icons/gi'; // Hamburger icon
import { Disclosure } from '@headlessui/react'; // Disclosure component

const SideBar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setAnimating] = useState(false);

  const toggleSidebar = () => {
    setAnimating(true);
    setSidebarOpen(!isSidebarOpen);
  };

  const handleTransitionEnd = () => {
    setAnimating(false);
  };

  return (
    <div className="relative">
      <button className="md:hidden p-4" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Open'} Menu
      </button>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        id="left-group"
        className={`fixed top-0 left-0 p-10 flex flex-col w-[250px] h-full bg-white transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flex flex-col justify-start text-base mt-16 space-y-4">
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className={`nav-item px-6 py-3 text-black hover:text-[#34C759] rounded-md ${
                pathname === item.link ? 'bg-gray-200 text-white' : ''
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
