'use client';
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DisplayMapProps {
  selectedRoute: string;
}

const DisplayMap: React.FC<DisplayMapProps> = ({ selectedRoute }) => {
  interface Coordinate {
    latitude: number;
    longitude: number;
  }

  interface RouteNames {
    id: number;
    routeName: string;
    routeColor: string;
    coordinates: Coordinate[];
  }

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<{ [key: string]: L.Polyline }>({});

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
    const initMap = (lat: number, lng: number, zoom: number) => {
      if (!mapRef.current) {
        const map = L.map('map').setView([lat, lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapRef.current = map;

        document.getElementById('map')!.style.cursor = 'default';
        map.on('mousedown', () => document.getElementById('map')!.style.cursor = 'grabbing');
        map.on('mouseup', () => document.getElementById('map')!.style.cursor = 'default');
        map.on('dragstart', () => document.getElementById('map')!.style.cursor = 'grabbing');
        map.on('dragend', () => document.getElementById('map')!.style.cursor = 'default');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          initMap(latitude, longitude, 16);

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
          initMap(7.072093, 125.612058, 13);
        }
      );
    } else {
      initMap(7.072093, 125.612058, 13);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || routes.length === 0) return;

    Object.values(routeLayersRef.current).forEach(layer => {
      layer.remove();
    });
    routeLayersRef.current = {};

    routes.forEach(route => {
      if (selectedRoute === 'all' || selectedRoute === route.routeName) {
        const latLngs = route.coordinates.map(coord => [coord.latitude, coord.longitude] as L.LatLngExpression);
        const polyline = L.polyline(latLngs, { color: route.routeColor }).addTo(mapRef.current!);
        routeLayersRef.current[route.routeName] = polyline;
      }
    });
  }, [routes, selectedRoute]);

  return (
    <div
      id="map"
      className="w-full bg-black cursor-default"
      style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}
    ></div>
  );
};

export default DisplayMap;