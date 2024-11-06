"use client";
import { useState, createContext, useContext, Dispatch, SetStateAction, useEffect } from 'react';

type Bus = {
    id: string;
    routeId: string;
    busNumber: string;
    capacity: number;
    status: string;
    busName: string;
    passCount: string;
};

interface ContextProps {
    data: Bus | null;
    setData: Dispatch<SetStateAction<Bus | null>>;
}

const GlobalContext = createContext<ContextProps>({
    data: null,
    setData: () => {}
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<Bus | null>(null);

    // Debugging: Log whenever data is updated
    useEffect(() => {
        console.log("Current bus data in context: ", data);
    }, [data]);

    // Simulate data fetching to test the provider
    useEffect(() => {
        const fetchBusData = async () => {
            try {
                console.log("Fetching bus data...");

                // Simulating an API call (replace with actual fetch request)
                const response = await fetch('http://localhost:4000/bus-data'); // Your actual API endpoint
                const fetchedData = await response.json();
                console.log("Fetched bus data: ", fetchedData); // Log the fetched data

                if (fetchedData) {
                    setData(fetchedData); // Set the fetched data to context
                    console.log("Bus data set in context: ", fetchedData); // Log when data is set
                } else {
                    console.log("No bus data received");
                }
            } catch (error) {
                console.error("Error fetching bus data: ", error);
            }
        };

        fetchBusData();
    }, []); // Empty dependency array makes it run once when the component mounts

    return (
        <GlobalContext.Provider value={{ data, setData }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
