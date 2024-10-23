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
    id: string;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string;
    route: RouteNames;
    latitude: string;
    longitude: string;
    passCount: string;
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

    
    fetchRoutes();
  }, []);

  
  
const fetchBuses = async () => {
  try {
      const response = await fetch('http://localhost:4000/thingspeak/bus-location');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const busLocationData: Buses[] = await response.json();
      return busLocationData; // Return the fetched data
  } catch (error) {
      setError((error as Error).message);
      return []; // Return an empty array on error
  }
};

const fetchBusPassCount = async () => {
  try {
      const response = await fetch('http://localhost:4000/thingspeak/all-bus-passengers');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const busPassCountData: Buses[] = await response.json();
      return busPassCountData; // Return the fetched data
  } catch (error) {
      setError((error as Error).message);
      return []; // Return an empty array on error
  }
};

const fetchData = async () => {
  setLoading(true);
  const busesData = await fetchBuses();
  const passCountData = await fetchBusPassCount();

  // Combine the results based on the bus ID
  const combinedBuses = busesData.map(bus => {
      const passCountEntry = passCountData.find(p => p.id === bus.id);
      return {
          ...bus,
          passCount: passCountEntry ? passCountEntry.passCount : '0', // Set to '0' if no count found
      };
  });

  setBuses(combinedBuses);
  setLoading(false);
};

  // Fetch data every 15 seconds
  useEffect(() => {
    fetchData(); // Fetch buses initially
    const intervalId = setInterval(fetchData, 15000); // 15 seconds interval

    return () => clearInterval(intervalId); // Cleanup on unmount
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

  // UseEffect for Routes
  useEffect(() => {
    if (!mapRef.current || routes.length === 0) return;

    // Remove existing route layers
    Object.values(routeLayersRef.current).forEach(layer => {
      layer.remove();
    });
    routeLayersRef.current = {};

    // Add routes to the map
    routes.forEach(route => {
      if (selectedRoute === 'all' || selectedRoute === route.routeName) {
        const latLngs = route.coordinates.map(coord => [coord.latitude, coord.longitude] as L.LatLngExpression);
        const polyline = L.polyline(latLngs, { color: route.routeColor }).addTo(mapRef.current!);
        routeLayersRef.current[route.routeName] = polyline;
      }
    });
  }, [routes, selectedRoute]);

// UseEffect for Buses
useEffect(() => {
  if (!mapRef.current || buses.length === 0) return;

  // Remove existing bus markers
  Object.values(busMarkersRef.current).forEach(marker => {
    marker.remove();
  });
  busMarkersRef.current = {};

  // Filter buses based on the selected route and only include those with valid coordinates
  const filteredBuses = selectedRoute === 'all'
    ? buses.filter(bus => bus.latitude !== null && bus.longitude !== null) // Show all buses with valid coordinates if "all" is selected
    : buses.filter(bus => 
        bus.route.routeName === selectedRoute && 
        bus.latitude !== null && 
        bus.longitude !== null
      ); // Only show buses matching the selected route with valid coordinates

  // Add buses as circle markers
  filteredBuses.forEach(bus => {
    const latitude = parseFloat(bus.latitude!); // Ensure latitude is a number
    const longitude = parseFloat(bus.longitude!); // Ensure longitude is a number

    const marker = L.circleMarker([latitude, longitude], {
      radius: 9,
      color: bus.route.routeColor,
      fillColor: bus.route.routeColor,
      fillOpacity: 0.5,
    })
      .addTo(mapRef.current!)
      .bindPopup(`
        <b>Bus Name:</b> ${bus.busName} <br>
        <b>Bus Number:</b> ${bus.busNumber} <br>
        <b>Capacity:</b> ${bus.capacity} <br>
        <b>Passengers:</b> ${bus.passCount} <br>
        <b>Available Seats:</b> ${bus.capacity - parseInt(bus.passCount, 10)} <br>
      `);

    busMarkersRef.current[bus.id] = marker;
  });
}, [buses, selectedRoute]);


  return (
    <div
      id="map"
      className="w-full bg-black cursor-default z-30"
      style={{ height: 'calc(100vh - 68px)', marginTop: '68px' }}
    ></div>
  );
};

export default DisplayMap;
