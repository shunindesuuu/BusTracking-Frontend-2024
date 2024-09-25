'use client';
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DisplayMap = () => {

  interface Coordinate {
    latitude: number;
    longitude: number;
  }
  
  interface Path {
    id: string;
    routeId: string;
    coordinates: Coordinate[];  // Array of coordinates for each path
  }
  
  interface RouteNames {
    id: string;
    routeName: string;
    routeColor: string;
    paths: Path[];  // Each route contains an array of paths
  }

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null); // Ref to store the map instance

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:4000/routes/index/coordinates');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        console.log(result)
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
    const initMap = (lat: number, lng: number, zoom: number) => {
      if (!mapRef.current) {
        // Only initialize the map if it hasn't been initialized already
        const map = L.map('map').setView([lat, lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapRef.current = map; // Store the map instance in the ref
  
        // Set cursor styles
        document.getElementById('map')!.style.cursor = 'default';
        map.on('mousedown', () => document.getElementById('map')!.style.cursor = 'grabbing');
        map.on('mouseup', () => document.getElementById('map')!.style.cursor = 'default');
        map.on('dragstart', () => document.getElementById('map')!.style.cursor = 'grabbing');
        map.on('dragend', () => document.getElementById('map')!.style.cursor = 'default');

        
      }

      // Add routes to the map
routes.forEach(route => {
  route.paths.forEach(path => {
    const latLngs = path.coordinates.map(coord => [coord.latitude, coord.longitude] as L.LatLngExpression);
    L.polyline(latLngs, { color: route.routeColor }).addTo(mapRef.current!);
  });
});
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          // Initialize map at user location with zoom 16
          initMap(latitude, longitude, 16);

          // Add a circle marker at user's location
          if (mapRef.current) {
            L.circleMarker([latitude, longitude], {
              radius: 10,
              color: '#3388ff',
              fillColor: '#3388ff',
              fillOpacity: 0.5,
            }).addTo(mapRef.current).bindPopup('You are here');
          }
        },
        () => {
          // Fallback if location access is denied
          initMap(7.072093, 125.612058, 13); // Default location with zoom 13
        }
      );
    } else {
      // If geolocation is not supported
      initMap(7.072093, 125.612058, 13); // Default location with zoom 13
    }
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
