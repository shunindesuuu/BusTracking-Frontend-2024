'use client';
import React from 'react';
import { useSession } from 'next-auth/react';

interface ProtectedComponentProps {
  children: React.ReactNode;
  blockedRoles?: string[];
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ children, blockedRoles = [] }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null; // Or you can return a loading indicator here
  }

  if (!session || blockedRoles.includes(session.user?.role as string)) {
    return null; // Hide the component if the user's role is in the restricted list
  }

  return <>{children}</>;
};

export default ProtectedComponent;
