import { useState, useEffect } from 'react';
import api from '../services/api';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';

export const useReports = () => {
    const [periodo, setPeriodo] = useState<string>('mes');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
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

            showToast(`Reporte ${formato.toUpperCase()} descargado correctamente`, 'success');
        } catch (error: any) {
            console.error('Error al descargar reporte:', error);
            showToast('Error al descargar el reporte', 'danger');
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estados
        periodo,
        setPeriodo,
        loading,
        // Funciones
        descargarReporte,
    };
};