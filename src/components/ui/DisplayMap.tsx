"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const DisplayMap = () => {
const { data: session } = useSession();
const pathname = usePathname();

    useEffect(() => {
        const map = L.map('map').setView([7.072093, 125.612058], 13);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        return () => {
          map.remove();
        };
      }, []);
      return (
      <div id="map" className='h-screen  w-full bg-black cursor-default mt-[70px]'></div>
    
      )
}

export default DisplayMap