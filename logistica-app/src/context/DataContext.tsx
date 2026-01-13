import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataContextType } from '../../types/types';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const DataContext = createContext<DataContextType>({
    refreshData: () => { },
    refreshKey: 0,
    toolbarTitle: 'Logística App',
    setToolbarTitle: () => { },
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [toolbarTitle, setToolbarTitle] = useState('Logística App');
    const { isAuthenticated } = useAuth();

    const refreshData = () => {
        setRefreshKey(prev => prev + 1);
    };



    // Efecto para socket.io y auto-refresco
    useEffect(() => {
        if (!isAuthenticated) return;

        // Configuración de URL del Socket (debe coincidir con el backend, sin /api)
        const API_MODE = import.meta.env.VITE_API_MODE || 'local';
        const BASE_URL = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : (API_MODE === 'remote' ? 'https://mpolog.onrender.com' : 'http://localhost:5000');

        console.log('[DataProvider] Conectando Socket.io a:', BASE_URL);

        const socket = io(BASE_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
        });

        socket.on('connect', () => {
            console.log('[DataProvider] Socket conectado:', socket.id);
        });

        socket.on('cambio_datos', (data: any) => {
            console.log('[DataProvider] Cambio de datos detectado vía socket:', data);
            refreshData();
        });

        socket.on('connect_error', (err: any) => {
            console.warn('[DataProvider] Error de conexión socket:', err);
        });

        // Mantener polling como fallback (cada 60s)
        const interval = setInterval(() => {
            // console.log('[DataProvider] Auto-refresco por intervalo'); // Reducir logs
            // refreshData(); // Opcional: si confiamos en el socket, podríamos quitar esto, pero mejor dejarlo como seguridad.
        }, 60000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('[DataProvider] Auto-refresco por visibilidad');
                refreshData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            socket.disconnect();
        };
    }, [isAuthenticated]);

    return (
        <DataContext.Provider value={{ refreshData, refreshKey, toolbarTitle, setToolbarTitle }}>
            {children}
        </DataContext.Provider>
    );
};