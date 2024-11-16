'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Burger from '/public/assets/ICON.png';
import ExitBurger from '/public/assets/X_ICON.png';

interface NavigationBarProps {
  toggleSidebar: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleToggle = () => {
    setDropdownOpen(!isDropdownOpen);
    toggleSidebar(); // Toggle the sidebar when clicking the burger icon
  };

  return (
    <div className="relative z-[500]">
      <div className="fixed top-0 w-full z-50 bg-[#34C759]">
        <div className="p-4 flex justify-between items-center">
          {/* Container for Burger Icon and Title */}
          <div className="flex items-center">
            {/* Burger Icon */}
            <button
              className="md:hidden p-2 text-white z-50"
              onClick={handleToggle}
            >
              <Image
                src={isDropdownOpen ? ExitBurger : Burger}
                alt="Burger Icon"
                className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10"
              />
            </button>

            {/* Davao Bus Tracker Title */}
            <Link href="/">
              <p className="text-lg text-white font-semibold ml-2">
                Davao Bus Tracker
              </p>
            </Link>
          </div>

          {/* Additional content can go here for desktop view, if needed */}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;