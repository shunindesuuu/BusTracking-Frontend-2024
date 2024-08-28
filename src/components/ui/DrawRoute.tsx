"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
const DrawRoute = () => {
  // let map = L.map('map').setView([51.505, -0.09], 13);

  useEffect(() => {
    // Initialize the map and set its view to the specified coordinates and zoom level
    const map = L.map('map').setView([7.072093, 125.612058], 13);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define an explicitly typed latlngs array
    const latlngs: LatLngExpression[] = [];

    // Initialize the polyline with an empty latlngs array and add it to the map
    const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);

    // Add a click event to the map
    map.on('click', function (e) {
      // Get the latitude and longitude of the click
      const { lat, lng } = e.latlng;

      // Append the clicked coordinates to the latlngs array
      latlngs.push([lat, lng]);

      // Update the polyline with the new latlngs array
      polyline.setLatLngs(latlngs);

      // Log the updated latlngs array to the console for debugging
      console.log(latlngs);
    });

    // Clean up map when component unmounts
    return () => {
      map.remove();
    };
  }, []);
  return (
  
    <div id="map" className='h-screen  w-full bg-black cursor-default'>

    </div>

  )
}

export default DrawRoute