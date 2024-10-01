'use client';
import React, { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DrawRouteProps {
  onUpdateLatLngs: (latlngs: { pointOrder: number; latitude: number; longitude: number }[]) => void;
  color: string; // Prop for polyline color
  initialLatlngs?: { pointOrder: number; latitude: number; longitude: number }[]; // Optional prop for initial latlngs
}

const DrawRoute: React.FC<DrawRouteProps> = ({ onUpdateLatLngs, color, initialLatlngs = [] }) => {
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [latlngs, setLatlngs] = useState<{ pointOrder: number; latitude: number; longitude: number }[]>(initialLatlngs); 
  const [pointOrder, setPointOrder] = useState(initialLatlngs.length); 
  const xMarkerRef = useRef<L.Marker | null>(null); 
  const firstPointRef = useRef<L.CircleMarker | null>(null); 

  const removeLastLatLng = () => {
    setLatlngs((prevLatlngs) => {
      const updatedLatlngs = prevLatlngs.slice(0, -1);
  
      // If the last point was removed, clear the markers
      if (updatedLatlngs.length === 0) {
        firstPointRef.current?.remove();
        xMarkerRef.current?.remove();
        setPointOrder(0); // Reset point order if no points are left
        return updatedLatlngs;
      }
  
      // Update the "X" marker to the new last point
      const lastPoint = updatedLatlngs[updatedLatlngs.length - 1];
      xMarkerRef.current?.remove();
      xMarkerRef.current = L.marker([lastPoint.latitude, lastPoint.longitude], {
        icon: L.divIcon({
          className: 'custom-x-icon',
          html: `<div style="background-color: white; border: 2px solid black; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 16px;">&#10006;</div>`,
          iconSize: [24, 24],
        }),
      })
      .on('click', removeLastLatLng)
      .addTo(mapRef.current!);
  
      // Update pointOrder based on the new number of points
      setPointOrder(updatedLatlngs.length);
  
      return updatedLatlngs;
    });
  };
  
  

  useEffect(() => {
    // Initialize map only once
    mapRef.current = L.map('map').setView([7.072093, 125.612058], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Initialize polyline with initial latlngs
    console.log(latlngs)

    polylineRef.current = L.polyline(
      initialLatlngs.map(point => [point.latitude, point.longitude] as LatLngExpression),
      { color: color || 'lightgreen' }
    ).addTo(mapRef.current);

    // Add markers for existing latlngs if any
    if (initialLatlngs.length > 0) {
      addMarkers(initialLatlngs);
    }

    // Cursor styles
    setupCursorStyles(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []); // Runs only once on component mount

  useEffect(() => {
    // Update polyline when latlngs change
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs.map(point => [point.latitude, point.longitude] as LatLngExpression));
    }
    onUpdateLatLngs(latlngs);
  }, [latlngs, onUpdateLatLngs]); // Runs when latlngs change

  useEffect(() => {
    // Update polyline color when color prop changes
    if (polylineRef.current) {
      polylineRef.current.setStyle({ color: color || 'lightgreen' });
    }
  }, [color]); // Runs when color prop changes

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const handleMapClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newPoint = {
          pointOrder: pointOrder,
          latitude: lat,
          longitude: lng,
        };

        setPointOrder(prev => prev + 1); // Increment pointOrder for the next point
        setLatlngs(prev => [...prev, newPoint]); // Update latlngs

        // Handle markers for the new point
        handleMarkers(newPoint);
      };

      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [latlngs]); // Runs when pointOrder changes

  const setupCursorStyles = (map: L.Map | null) => {
    if (!map) return;

    document.getElementById('map')!.style.cursor = 'default';
    map.on('mousedown', () => document.getElementById('map')!.style.cursor = 'grabbing');
    map.on('mouseup', () => document.getElementById('map')!.style.cursor = 'default');
    map.on('dragstart', () => document.getElementById('map')!.style.cursor = 'grabbing');
    map.on('dragend', () => document.getElementById('map')!.style.cursor = 'default');
  };

  const addMarkers = (points: { pointOrder: number; latitude: number; longitude: number }[]) => {
    if (points.length > 0) {
      const firstPoint = points[0];
      firstPointRef.current = L.circleMarker([firstPoint.latitude, firstPoint.longitude], {
        color: 'black',
        fillColor: 'white',
        fillOpacity: 1,
        weight: 2,
        radius: 8,
      }).addTo(mapRef.current!);

      const lastPoint = points[points.length - 1];
      xMarkerRef.current = L.marker([lastPoint.latitude, lastPoint.longitude], {
        icon: L.divIcon({
          className: 'custom-x-icon',
          html: `<div style="background-color: white; border: 2px solid black; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 16px;">&#10006;</div>`,
          iconSize: [24, 24],
        }),
      })
      .on('click', removeLastLatLng)
      .addTo(mapRef.current!);
    }
  };

  const handleMarkers = (newPoint: { pointOrder: number; latitude: number; longitude: number }) => {
    // Handle the addition of markers for the new point
    if (latlngs.length === 0) {
      // If this is the first point, add the circle marker
      firstPointRef.current = L.circleMarker([newPoint.latitude, newPoint.longitude], {
        color: 'black',
        fillColor: 'white',
        fillOpacity: 1,
        weight: 2,
        radius: 8,
      }).addTo(mapRef.current!);
    }

    // Add "X" marker to the last point
    xMarkerRef.current?.remove(); // Remove the previous "X" marker
    xMarkerRef.current = L.marker([newPoint.latitude, newPoint.longitude], {
      icon: L.divIcon({
        className: 'custom-x-icon',
        html: `<div style="background-color: white; border: 2px solid black; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 16px;">&#10006;</div>`,
        iconSize: [24, 24],
      }),
    })
    .on('click', removeLastLatLng)
    .addTo(mapRef.current!);
  };

  return <div id="map" className="h-full w-full bg-black cursor-default"></div>;
};

export default DrawRoute;
