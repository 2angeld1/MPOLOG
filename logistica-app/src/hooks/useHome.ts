import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { conteoService } from '../services/api';
import { Estadisticas, Registro } from '../../types/types';

export const useHome = () => {
    const history = useHistory();
    const { logout, user } = useAuth();
    const { refreshKey, setToolbarTitle } = useData();
    const [estadisticasPersonas, setEstadisticasPersonas] = useState<Estadisticas | null>(null);
    const [estadisticasMateriales, setEstadisticasMateriales] = useState<Estadisticas | null>(null);
    const [registrosPersonas, setRegistrosPersonas] = useState<Registro[]>([]);
    const [registrosMateriales, setRegistrosMateriales] = useState<Registro[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [refreshKey]);

    useEffect(() => {
        setToolbarTitle(user ? `Bienvenido, ${user.nombre}` : 'Logística App');
    }, [user, setToolbarTitle]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const fechaHoy = new Date().toISOString().split('T')[0];
            const fechaInicio = new Date();
            fechaInicio.setDate(fechaInicio.getDate() - 30);
            const fechaInicioStr = fechaInicio.toISOString().split('T')[0];

            // Estadísticas y registros para personas
            const statsPersonasResponse = await conteoService.obtenerEstadisticas(fechaInicioStr, fechaHoy, 'personas');
            setEstadisticasPersonas(statsPersonasResponse.data);

            const registrosPersonasResponse = await conteoService.obtener(undefined, undefined, 'personas');
            const registrosPersonasOrdenados = registrosPersonasResponse.data
                .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map((reg: any) => ({
                    _id: reg._id,
                    fecha: reg.fecha,
                    iglesia: reg.iglesia,
                    area: reg.area,
                    subArea: reg.subArea,
                    cantidad: reg.cantidad,
                }));
            setRegistrosPersonas(registrosPersonasOrdenados);

            // Estadísticas y registros para materiales
            const statsMaterialesResponse = await conteoService.obtenerEstadisticas(fechaInicioStr, fechaHoy, 'materiales');
            setEstadisticasMateriales(statsMaterialesResponse.data);

            const registrosMaterialesResponse = await conteoService.obtener(undefined, undefined, 'materiales');
            const registrosMaterialesOrdenados = registrosMaterialesResponse.data
                .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map((reg: any) => ({
                    _id: reg._id,
                    fecha: reg.fecha,
                    iglesia: reg.iglesia,
                    area: reg.area,
                    subArea: reg.subArea,
                    cantidad: reg.cantidad,
                }));
            setRegistrosMateriales(registrosMaterialesOrdenados);
        } catch (error: any) {
            console.error('[useHome] cargarDatos error:', error.response?.status, error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await cargarDatos();
        event.detail.complete();
    };

    const handleLogout = () => {
        logout();
    };

    return {
        // Estados
        estadisticasPersonas,
        estadisticasMateriales,
        registrosPersonas,
        registrosMateriales,
        loading,
        history,
        // Funciones
        handleRefresh,
        handleLogout,
    };
};