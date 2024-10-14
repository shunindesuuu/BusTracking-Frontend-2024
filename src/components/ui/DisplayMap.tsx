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
  interface Buses {
    id: number;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string;
    route: RouteNames;
  }

  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [buses, setBuses] = useState<Buses[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<{ [key: string]: L.Polyline }>({});
  const busMarkersRef = useRef<{ [key: string]: L.CircleMarker }>({});

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
        setBuses(result);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
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

        // Set cursor styles
        const mapElement = document.getElementById('map')!;
        mapElement.style.cursor = 'default';

        map.on('mousedown', () => (mapElement.style.cursor = 'grabbing'));
        map.on('mouseup', () => (mapElement.style.cursor = 'default'));
        map.on('dragstart', () => (mapElement.style.cursor = 'grabbing'));
        map.on('dragend', () => (mapElement.style.cursor = 'default'));
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

    // Remove existing route layers
    Object.values(routeLayersRef.current).forEach(layer => {
      layer.remove();
    });
    routeLayersRef.current = {};

    // Remove existing bus markers
    Object.values(busMarkersRef.current).forEach(marker => {
      marker.remove();
    });
    busMarkersRef.current = {};

    // Add routes to the map
    routes.forEach(route => {
      if (selectedRoute === 'all' || selectedRoute === route.routeName) {
        const latLngs = route.coordinates.map(coord => [coord.latitude, coord.longitude] as L.LatLngExpression);
        const polyline = L.polyline(latLngs, { color: route.routeColor }).addTo(mapRef.current!);
        routeLayersRef.current[route.routeName] = polyline;
      }
    });

    // Add buses as circle markers with specified coordinates
    buses.forEach((bus, index) => {
      const busCoordinates: [number, number][] = [
        [7.064032851953117, 125.6098222732544], // First bus
        [7.069356519813487, 125.6197357177735], // Second bus
        [7.079471319711519, 125.6080198287964],  // Third bus
        [7.075574486204395, 125.6114101409912], // Fourth bus
      ];

      L.circleMarker(busCoordinates[index], {
        radius: 9,
        color: bus.route.routeColor,
        fillColor: bus.route.routeColor,
        fillOpacity: 0.5,
      }).addTo(mapRef.current!).bindPopup(`
        <b>Bus Name:</b> ${bus.busName} <br>
        <b>Bus Number:</b> ${bus.busNumber} <br>
        <b>Capacity:</b> ${bus.capacity} <br>
      `);
    });
  }, [routes, buses, selectedRoute]);

  return (
    <div
      id="map"
      className="w-full bg-black cursor-default z-30"
      style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}
    ></div>
  );
};

export default DisplayMap;
