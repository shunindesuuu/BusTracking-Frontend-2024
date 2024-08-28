'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DisplayMap = () => {
  useEffect(() => {
    const map = L.map('map').setView([7.072093, 125.612058], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      // Default cursor to pointer
      mapContainer.style.cursor = 'default';

      // When the map starts being dragged, change to 'grabbing'
      map.on('dragstart', () => {
        mapContainer.style.cursor = 'grabbing';
      });

      // When the map is being dragged, change the cursor to 'grabbing'
      map.on('drag', () => {
        mapContainer.style.cursor = 'grabbing';
      });

      // When dragging ends, reset to pointer
      map.on('dragend', () => {
        mapContainer.style.cursor = 'default';
      });

      // When hovering over the map, change to 'grab'
      map.on('mouseover', () => {
        mapContainer.style.cursor = 'grab';
      });

      // Reset to pointer when not hovering over the map
      map.on('mouseout', () => {
        mapContainer.style.cursor = 'default';
      });
    }

    return () => {
      map.remove();
    };
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
