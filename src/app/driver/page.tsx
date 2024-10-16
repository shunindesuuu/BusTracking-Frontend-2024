'use client';
import { useState, useEffect } from 'react';
import DisplayMap from '@/components/ui/DisplayMap';
import ProtectedComponent from '@/components/ui/ProtectedComponent';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface RouteNames {
  id: number;
  routeName: string;
  routeColor: string;
}

const Driver = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }
  if (!session) {
    redirect('/login');
  }
  if (session.user?.role !== 'driver' && session.user?.role !== 'admin') {
    redirect('/');
  }

  const [selectedRoute, setSelectedRoute] = useState<RouteNames | null>(null);
  const [routes, setRoutes] = useState<RouteNames[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the routes from the backend API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/routes/index/coordinates'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: RouteNames[] = await response.json();
        setRoutes(result);
        if (result.length > 0) {
          setSelectedRoute(result[0]); // Default to the first route
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Handle route selection
  const handleRouteSelect = (route: RouteNames) => {
    setSelectedRoute(route);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ProtectedComponent restrictedRoles={['user']}>
      <div className="flex flex-col items-center bg-white p-4 min-h-screen">
        <DisplayMap selectedRoute={selectedRoute?.routeName || ''} />
      </div>
    </ProtectedComponent>
  );
};

export default Driver;
