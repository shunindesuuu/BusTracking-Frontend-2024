'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import Burger from '/public/assets/ICON.png';
import ExitBurger from '/public/assets/X_ICON.png';
import SelectComponent from './SelectComponent';
import ProgressDemo from './ProgessBar';

const NavigationBar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAnimating, setAnimating] = useState(false);

  const toggleDropdown = () => {
    setAnimating(true);
    setDropdownOpen(!isDropdownOpen);
  };

  const handleTransitionEnd = () => {
    setAnimating(false);
  };

  return (
    <div className="relative">
      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 lg:hidden"
        >
          <div className="w-2/3 h-full bg-white ">
            <div className="mt-12">
              <div className="p-5">
                <p className="">Routes</p>
                <SelectComponent />

                <p className="mt-5 mb-2">Bus Information</p>
                <div className="bg-white h-52 w-full rounded-md border">
                  <div className="bg-white border-b w-full h-1/4 flex items-center justify-between p-2 rounded-t-md">
                    <div className="flex flex-col">
                      <p>Bus Number: 12345</p>
                      <p className="underline text-green-400">Toril Line</p>
                    </div>
                  </div>

                  <div className="h-3/4 flex flex-col">
                    <div className="w-full h-fit flex flex-col p-2">
                      <p className="mb-1">Bus Capacity: 50</p>
                      <p className="text-sm ">Taken: 30</p>
                      <p className="text-sm">Available: 20</p>
                    </div>
                    <div className="flex flex-col justify-center align-middle h-1/2 p-2">
                      <ProgressDemo />
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
            </div>
          </div>
        </div>
      )}
      <div
        className={`fixed top-0 w-full z-50 ${isDropdownOpen ? 'bg-[#34C759]' : 'bg-[#34C759]'}`}
      >
        <div className="lg:pl-5 lg:pr-5 pl-5  pr-3 flex flex-col lg:flex-row justify-between items-start">
          <div className="w-full flex justify-between items-center">
            <div className="w-[7.8125rem] py-1 flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="h-[2.8125rem] justify-start items-center inline-flex relative">
                <Link href="/">
                  <p className="flex justify-center whitespace-nowrap text-lg ml-8 text-white font-semibold">
                    Davao Bus Tracker
                  </p>
                </Link>
              </div>
            </div>

            {/* {isDropdownOpen&&(
                            <div className={`w-full lg:w-auto lg:mt-0 lg:hidden`}>
                            <div
                                id='NavLinks'
                                className={`flex flex-col lg:flex-row justify-start items-center transition-all duration-300 ease-in-out ${isDropdownOpen ? 'opacity-100 max-h-screen pointer-events-auto' : 'hidden pointer-events-none'} lg:opacity-100 lg:max-h-screen lg:pointer-events-auto lg:flex w-full lg:w-auto mt-4 lg:mt-0 whitespace-nowrap`}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {session && (
                                    <div className="flex flex-col items-start space-x-4 pb-3 pr-3">
                                        <p className="text-white ml-4">Welcome, {session.user?.name || session.user?.email}</p>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-white ml-4 border border-white px-3 py-1 rounded hover:bg-white hover:text-[#34C759] transition duration-150"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        )} */}
            <div className={`w-full lg:flex lg:w-auto lg:mt-0 hidden`}>
              <div
                id="NavLinks"
                className={`flex flex-col lg:flex-row justify-start items-center transition-all duration-300 ease-in-out ${isDropdownOpen ? 'opacity-100 max-h-screen pointer-events-auto' : 'hidden pointer-events-none'} lg:opacity-100 lg:max-h-screen lg:pointer-events-auto lg:flex w-full lg:w-auto mt-4 lg:mt-0 whitespace-nowrap`}
                onTransitionEnd={handleTransitionEnd}
              >
                {session && (
                  <div className="flex items-center space-x-4">
                    <p className="text-white ml-4">
                      Welcome, {session.user?.name || session.user?.email}
                    </p>
                    <button
                      onClick={() => signOut()}
                      className="text-white ml-4 border border-white px-3 py-1 rounded hover:bg-white hover:text-[#34C759] transition duration-150"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="block lg:hidden" onClick={toggleDropdown}>
              <Image
                src={isDropdownOpen ? ExitBurger : Burger}
                alt="Burger Icon"
                className="cursor-pointer sm:w-[65px] sm:h-[53px] xsm:w-[43.33px] xsm:h-[35.33px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
