import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure for the latlng object
interface LatLng {
  pointOrder: number;
  latitude: number;
  longitude: number;
}

// Define the structure for the context state
interface LatLngContextType {
  latlngs: LatLng[];
  setLatlngs: React.Dispatch<React.SetStateAction<LatLng[]>>;
}

// Create the context with default values
const LatLngContext = createContext<LatLngContextType | undefined>(undefined);

// Provider component
export const LatLngProvider = ({ children }: { children: ReactNode }) => {
  const [latlngs, setLatlngs] = useState<LatLng[]>([]);

  return (
    <LatLngContext.Provider value={{ latlngs, setLatlngs }}>
      {children}
    </LatLngContext.Provider>
  );
};

// Custom hook to use the LatLngContext
export const useLatLngContext = () => {
  const context = useContext(LatLngContext);
  if (!context) {
    throw new Error('useLatLngContext must be used within a LatLngProvider');
  }
  return context;
};
