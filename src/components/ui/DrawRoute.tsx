'use client';
import React, { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DrawRouteProps {
  onUpdateLatLngs: (latlngs: { pointOrder: number; latitude: number; longitude: number }[]) => void;
  color: string; // Prop for polyline color
}

const DrawRoute: React.FC<DrawRouteProps> = ({ onUpdateLatLngs, color }) => {
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [latlngs, setLatlngs] = useState<{ pointOrder: number; latitude: number; longitude: number }[]>([]);
  const [pointOrder, setPointOrder] = useState(0); // State to keep track of point order
  const xMarkerRef = useRef<L.Marker | null>(null); // Ref for the "X" marker
  const firstPointRef = useRef<L.CircleMarker | null>(null); // Ref for the first point marker

  useEffect(() => {
    // Initialize map
    mapRef.current = L.map('map').setView([7.072093, 125.612058], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Initialize polyline with default color
    polylineRef.current = L.polyline(latlngs.map(point => [point.latitude, point.longitude] as LatLngExpression), { color: color || 'lightgreen' }).addTo(mapRef.current);

    // Set cursor styles
    const map = mapRef.current;
    document.getElementById('map')!.style.cursor = 'default';
    map.on('mousedown', () => document.getElementById('map')!.style.cursor = 'grabbing');
    map.on('mouseup', () => document.getElementById('map')!.style.cursor = 'default');
    map.on('dragstart', () => document.getElementById('map')!.style.cursor = 'grabbing');
    map.on('dragend', () => document.getElementById('map')!.style.cursor = 'default');

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []); // Runs only once on component mount

  useEffect(() => {
    // Update polyline color when color prop changes
    if (polylineRef.current) {
      polylineRef.current.setStyle({ color: color || 'lightgreen' });
    }
  }, [color]); // Runs when color prop changes

  useEffect(() => {
    // Update polyline and notify parent when latlngs change
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs.map(point => [point.latitude, point.longitude] as LatLngExpression));
    }
    onUpdateLatLngs(latlngs);
  }, [latlngs, onUpdateLatLngs]); // Runs when latlngs or onUpdateLatLngs changes

  useEffect(() => {
    // Add map click event listener
    const map = mapRef.current;
    if (map) {
      const handleMapClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newPoint = {
          pointOrder: pointOrder,
          latitude: lat,
          longitude: lng
        };

        setPointOrder(prev => prev + 1); // Increment pointOrder for the next point
        setLatlngs(prev => [...prev, newPoint]);

        // Remove previous "X" marker if present
        if (xMarkerRef.current) {
          xMarkerRef.current.remove();
        }

        // Add "X" marker only to the latest point
        if (latlngs.length > 0) {
          const latestPoint: LatLngExpression = [lat, lng];
          xMarkerRef.current = L.marker(latestPoint, {
            icon: L.divIcon({
              className: 'custom-x-icon',
              html: `<div style="background-color: white; border: 2px solid black; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 16px;">&#10006;</div>`,
              iconSize: [20, 20], // Adjust size if needed
            }),
          }).addTo(map);

          // Add click event listener to remove the marker and its point
          xMarkerRef.current.on('click', () => {
            // Remove the latest point
            setLatlngs(prev => {
              const newLatlngs = prev.slice(0, -1); // Remove the last point
              return newLatlngs;
            });

            // Remove the marker
            if (xMarkerRef.current) {
              xMarkerRef.current.remove();
              xMarkerRef.current = null; // Clear ref
            }

            // Update polyline
            if (polylineRef.current) {
              polylineRef.current.setLatLngs(latlngs.map(point => [point.latitude, point.longitude] as LatLngExpression));
            }

            // Add "X" marker to the new most recent point if there are still points left
            if (latlngs.length > 0) {
              const newLatestPoint = latlngs[latlngs.length - 1];
              xMarkerRef.current = L.marker([newLatestPoint.latitude, newLatestPoint.longitude], {
                icon: L.divIcon({
                  className: 'custom-x-icon',
                  html: `<div style="background-color: white; border: 2px solid black; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 16px;">&#10006;</div>`,
                  iconSize: [24, 24], // Adjust size if needed
                }),
              }).addTo(map);
            }
          });
        }

        // Keep circle marker on the first point
        if (latlngs.length === 0) {
          firstPointRef.current = L.circleMarker([lat, lng], {
            color: 'black', // Circle border color
            fillColor: 'white', // Circle fill color
            fillOpacity: 1,
            weight: 2, // Border weight
            radius: 8, // Radius of the circle
          }).addTo(map);
        }
      };

      map.on('click', handleMapClick);

      return () => {
        if (map) {
          map.off('click', handleMapClick);
        }
      };
    }
  }, [latlngs, pointOrder, color]); // Runs when latlngs, pointOrder, or color changes

  return <div id="map" className="h-full w-full bg-black cursor-default"></div>;
};

export default DrawRoute;
