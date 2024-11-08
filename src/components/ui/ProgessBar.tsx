"use client"
import React, { useEffect, useState } from 'react';
import * as Progress from '@radix-ui/react-progress';

interface ProgressBarProps {
  data: number; // Expected percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({ data }) => {
  const [progress, setProgress] = useState(0); // Initial progress set to 0

  useEffect(() => {
    // Simulate loading or animate to `data` value over time
    const timer = setTimeout(() => setProgress(data), 300);
    return () => clearTimeout(timer);
  }, [data]); // Run this effect whenever `data` changes

  return (
    <Progress.Root
      className="relative overflow-hidden bg-gray-100 rounded-full w-full h-[25px]"
      style={{
        // Fix overflow clipping in Safari
        transform: 'translateZ(0)',
      }}
      value={progress}
    >
      <Progress.Indicator
        className="bg-[#34C759] w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
};

export default ProgressBar;
