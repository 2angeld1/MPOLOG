import React, { createContext, useContext, useState } from 'react';
import { DataContextType } from '../../types/types';

const DataContext = createContext<DataContextType>({
    refreshData: () => { },
    refreshKey: 0,
    toolbarTitle: 'Logística App',
    setToolbarTitle: () => { },
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [toolbarTitle, setToolbarTitle] = useState('Logística App'); // Título por defecto

    const refreshData = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <DataContext.Provider value={{ refreshData, refreshKey, toolbarTitle, setToolbarTitle }}>
            {children}
        </DataContext.Provider>
    );
};