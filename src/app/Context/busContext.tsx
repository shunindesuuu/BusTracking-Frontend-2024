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
    route: string;
};

interface RouteNames {
    id: number;
    routeName: string;
    routeColor: string;
}

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


    return (
        <GlobalContext.Provider value={{ data, setData }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
