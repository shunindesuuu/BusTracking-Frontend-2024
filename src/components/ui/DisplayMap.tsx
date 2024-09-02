'use client';
import React, { useEffect } from 'react';
import L, { Map, LocationEvent, ErrorEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DisplayMap: React.FC = () => {
  useEffect(() => {
    const mapContainer = document.getElementById('map') as HTMLDivElement;

    if (mapContainer) {
      // Initialize the map only if the container is available
      const map: Map = L.map(mapContainer).setView([51.505, -0.09], 13); // Fallback coordinates

      // Use geolocation to set view on the current location
      map.locate({
        setView: true,
        maxZoom: 15,
        enableHighAccuracy: true,
        timeout: 10000,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Handle location found event to place a circle with a popup
      map.on('locationfound', (e: LocationEvent) => {
        const radius = e.accuracy / 2; // Calculate the radius of the circle

        // Create a circle
        const circle = L.circle(e.latlng, {
          radius: radius,
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.2,
        }).addTo(map);

        // Bind a popup to the circle
        circle.bindPopup(`You are within ${radius} meters from this point`);
      });

      // Handle cursor change events
      mapContainer.style.cursor = 'default';

      map.on('mouseover', () => {
        mapContainer.style.cursor = 'grab';
      });

      map.on('dragstart', () => {
        mapContainer.style.cursor = 'grabbing';
      });

      map.on('dragend', () => {
        mapContainer.style.cursor = 'grab';
      });

      map.on('mouseout', () => {
        mapContainer.style.cursor = 'default';
      });

      

      // Handle location errors
      map.on('locationerror', (e: ErrorEvent) => {
        if (e.code === 1) {
          alert('Location access denied by the user.');
        } else if (e.code === 2) {
          alert('Location position unavailable.');
        } else if (e.code === 3) {
          alert('Location request timeout. Please try again.');
        } else {
          alert('An unknown error occurred.');
        }
      });

      // Cleanup on unmount
      return () => {
        map.off();
        map.remove();
      };
    }
  }, []);

  return (
    <div
      id="map"
      className="w-full bg-black cursor-default"
      style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}
    ></div>
  );
};

export default DisplayMap;
