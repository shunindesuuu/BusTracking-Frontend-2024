'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DisplayMap = () => {

  interface Coordinate {
    latitude: number;
    longitude: number;
  }
  
  interface RouteNames {
    id: number;
    routeName: string;
    routeColor: string;
    coordinates: Coordinate[];  // Use Coordinate array for lat/long pairs
  }

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:4000/routes/index/coordinates');  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result); 
      } catch (error) {
        setError((error as Error).message);  
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();  
  }, []);

  useEffect(() => {
    const map = L.map('map').setView([7.072093, 125.612058], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    routes.forEach(route => {
      const latLngs = route.coordinates.map(coord => [coord.latitude, coord.longitude] as L.LatLngExpression);
      console.log(latLngs )
      L.polyline(latLngs, { color: route.routeColor }).addTo(map);
    });

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
  }, [routes]);
  return (
    <div
      id="map"
      className="w-full bg-black cursor-default"
      style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}
    ></div>
  );
};

export default DisplayMap;
