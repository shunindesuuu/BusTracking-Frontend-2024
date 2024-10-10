import React from 'react';

const DisplayMap = ({ selectedRoute }: { selectedRoute: string }) => {
  return (
    <div className="h-60 w-full bg-gray-200 flex items-center justify-center">
      {/* Placeholder for your map logic */}
      <p className="text-black">Displaying map for route: {selectedRoute}</p>
    </div>
  );
};

export default DisplayMap;
