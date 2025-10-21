import { useState, useEffect } from 'react';
import api from '../services/api';
import { useData } from '../context/DataContext';

export const useReports = () => {
    const [periodo, setPeriodo] = useState<string>('mes');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const { setToolbarTitle } = useData();

    useEffect(() => {
        setToolbarTitle('Reportes');
    }, [setToolbarTitle]);

    const descargarReporte = async (formato: 'pdf' | 'excel' | 'png') => {
        setLoading(true);
        try {
            const response = await api.get(`/reportes/${formato}?periodo=${periodo}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const extension = formato === 'excel' ? 'xlsx' : formato;
            link.setAttribute('download', `reporte-${periodo}-${Date.now()}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.remove();

            setToastMessage(`Reporte ${formato.toUpperCase()} descargado correctamente`);
            setShowToast(true);
        } catch (error: any) {
            console.error('Error al descargar reporte:', error);
            setToastMessage('Error al descargar el reporte');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estados
        periodo,
        setPeriodo,
        loading,
        showToast,
        setShowToast,
        toastMessage,
        // Funciones
        descargarReporte,
    };
};