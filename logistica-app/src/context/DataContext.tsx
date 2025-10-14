import React, { createContext, useContext, useState } from 'react';

interface DataContextType {
    refreshData: () => void;
    refreshKey: number;
}

const DataContext = createContext<DataContextType>({
    refreshData: () => { },
    refreshKey: 0,
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshData = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <DataContext.Provider value={{ refreshData, refreshKey }}>
            {children}
        </DataContext.Provider>
    );
};