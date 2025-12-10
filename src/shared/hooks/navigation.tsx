"use client";

import {createContext, useContext, useState, useEffect} from "react";
import {usePathname} from "next/navigation";

type NavigationContextValue = {
    isLoading: boolean;
    setLoading: (value: boolean) => void;
};

const NavigationContext = createContext<NavigationContextValue>({
    isLoading: false,
    setLoading: () => {
    },
});

export const BigtabletNavigation = ({children}: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    const setLoading = (value: boolean) => {
        setIsLoading(value);
    };

    useEffect(() => {
        if (isLoading) {
            setIsLoading(false);
        }
    }, [pathname]);

    return (
        <NavigationContext.Provider value={{isLoading, setLoading}}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationStore = () => useContext(NavigationContext);