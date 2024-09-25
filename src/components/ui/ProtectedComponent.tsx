'use client';
import React from 'react';
import { useSession } from 'next-auth/react';

interface ProtectedComponentProps {
  children: React.ReactNode;
  restrictedRoles?: string[]; // Renamed for clarity
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ children, restrictedRoles = [] }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null; // Optionally, return a loading indicator here
  }

  // Check if the user is not authenticated or if their role is in the restricted list
  if (!session || restrictedRoles.includes(session.user?.role as string)) {
    return null; // Hide the component if the user's role is restricted
  }

  return <>{children}</>;
};

export default ProtectedComponent;
