'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Burger from '/public/assets/ICON.png';
import ExitBurger from '/public/assets/X_ICON.png';

const NavigationBar = () => {
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
                    className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    onClick={toggleDropdown}
                ></div>
            )}
            <div className={`fixed top-0 w-full z-50 ${isDropdownOpen ? 'bg-[#34C759]' : 'bg-[#34C759]'}`}>
                <div className="p-5 flex flex-col lg:flex-row justify-between items-start">
                    <div className="w-full flex justify-between items-center">
                        <div className="w-[7.8125rem] py-1 flex-col justify-start items-center gap-2.5 inline-flex">
                            <div className="h-[2.8125rem] justify-start items-center inline-flex relative">
                                <Link href="/">
                                    <p className='flex justify-center whitespace-nowrap text-lg ml-8 text-white font-semibold'>
                                      Davao Bus Tracker
                                    </p>
                                </Link>
                            </div>
                        </div>
                        <div className="block lg:hidden" onClick={toggleDropdown}>
                            <Image src={isDropdownOpen ? ExitBurger : Burger} alt='Burger Icon' className='cursor-pointer sm:w-[65px] sm:h-[53px] xsm:w-[43.33px] xsm:h-[35.33px]' />
                        </div>
                    </div>
                    <div className={`w-full lg:flex lg:w-auto lg:mt-0`}>
                        <div
                            id='NavLinks'
                            className={`flex flex-col lg:flex-row justify-start items-center transition-all duration-300 ease-in-out ${isDropdownOpen ? 'opacity-100 max-h-screen pointer-events-auto' : 'opacity-0 max-h-0 pointer-events-none'} lg:opacity-100 lg:max-h-screen lg:pointer-events-auto lg:flex w-full lg:w-auto mt-4 lg:mt-0 whitespace-nowrap`}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
