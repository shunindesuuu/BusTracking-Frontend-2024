'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DrawRoute = () => {
  useEffect(() => {
    const map = L.map('map').setView([7.072093, 125.612058], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const latlngs: LatLngExpression[] = [];

    const polyline = L.polyline(latlngs, { color: 'lightgreen' }).addTo(map);

    map.on('click', function (e) {
      const { lat, lng } = e.latlng;

      latlngs.push([lat, lng]);

      polyline.setLatLngs(latlngs);

      console.log(latlngs);
    });

    // Set cursor to default (black arrow) when map is idle
    document.getElementById('map')!.style.cursor = 'default';

    // Change cursor when dragging
    map.on('mousedown', () => {
      document.getElementById('map')!.style.cursor = 'grabbing';
    });

    map.on('mouseup', () => {
      document.getElementById('map')!.style.cursor = 'default';
    });

    map.on('dragstart', () => {
      document.getElementById('map')!.style.cursor = 'grabbing';
    });

    map.on('dragend', () => {
      document.getElementById('map')!.style.cursor = 'default';
    });


    return () => {
      map.remove();
    };
  }, []);
  return (
    <div id="map" className="h-screen  w-full bg-black cursor-default"></div>
  );
};

export default DrawRoute;
