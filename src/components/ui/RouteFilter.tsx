import React, { useEffect, useState } from 'react';
import SelectComponent from './SelectComponent';

interface RouteNames {
    id: number;
    routeName: string;
    routeColor: string;
}

interface RouteFilterProps {
    onRouteSelect: (route: string) => void;
}

const RouteFilter: React.FC<RouteFilterProps> = ({ onRouteSelect }) => {
    const [routes, setRoutes] = useState<RouteNames[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch('https://54.253.121.220:4000/routes/index');
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

    return (
        <div className="m-4 p-4">
            {loading && <p className="text-gray-600 text-sm">Loading...</p>}
            {error && <p className="text-red-600 text-sm">Error: {error}</p>}
            {!loading && !error && (
                <SelectComponent
                    routes={routes}
                    onSelectRoute={onRouteSelect}
                />
            )}
        </div>
    );
};

export default RouteFilter;
