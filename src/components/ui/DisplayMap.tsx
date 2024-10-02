'use client';
import React, { useEffect, useState, useRef } from 'react';
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
  interface Buses {
    id: number;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string
    route:RouteNames
  }

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [buses, setBuses] = useState<Buses[]>([]);
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
        setRoutes(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBuses = async () => {
      try {
        const response = await fetch('http://localhost:4000/buses/index');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Buses[] = await response.json();
        console.log(result)
        setBuses(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses()
    fetchRoutes();
  }, []);

  useEffect(() => {
    const initMap = (lat: number, lng: number, zoom: number) => {
      if (!mapRef.current) {
        // Initialize the map only once
        const map = L.map('map').setView([lat, lng], zoom);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
    
        mapRef.current = map; // Store the map instance in the ref
    
        // Set cursor styles
        const mapElement = document.getElementById('map')!;
        mapElement.style.cursor = 'default';
    
        map.on('mousedown', () => (mapElement.style.cursor = 'grabbing'));
        map.on('mouseup', () => (mapElement.style.cursor = 'default'));
        map.on('dragstart', () => (mapElement.style.cursor = 'grabbing'));
        map.on('dragend', () => (mapElement.style.cursor = 'default'));
      }
    
      // Add routes to the map
      routes.forEach(route => {
        const latLngs = route.coordinates.map(
          (coord: { latitude: number; longitude: number }) => [coord.latitude, coord.longitude] as L.LatLngExpression
        );
    
        L.polyline(latLngs, { color: route.routeColor }).addTo(mapRef.current!); // Type assertion
      });
    
      // Add buses as circle markers
      buses.forEach(bus => {
        L.circleMarker([7.072093, 125.612058], {
          radius: 10,
          color: bus.route.routeColor,
          fillColor: bus.route.routeColor,
          fillOpacity: 0.5,
        }).addTo(mapRef.current!).bindPopup(`
          <b>Bus Name:</b> ${bus.busName} <br>
          <b>Bus Number:</b> ${bus.busNumber} <br>
          <b>Capacity:</b> ${bus.capacity} <br>
        `);; // Type assertion
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
