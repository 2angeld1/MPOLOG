import { useState, useEffect } from 'react';
import { conteoService } from '../services/api';
import { useData } from '../context/DataContext';
import { PersonaRegistro } from '../../types/types';

export const useAddRecord = () => {
    const [fecha, setFecha] = useState<string>(new Date().toISOString());
    const [cantidad, setCantidad] = useState<number | undefined>(undefined);
    const [area, setArea] = useState<string>('');
    const [tipo, setTipo] = useState<'personas' | 'materiales'>('personas');
    const [subArea, setSubArea] = useState<string>('');
    const [iglesia, setIglesia] = useState<string>('');
    const [areas, setAreas] = useState<string[]>([]);
    const [registros, setRegistros] = useState<PersonaRegistro[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
    const [loading, setLoading] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const { refreshData, setToolbarTitle } = useData();
    const [tipoVista, setTipoVista] = useState<'personas' | 'materiales'>('personas');

    const [iglesias, setIglesias] = useState<string[]>([]);
    const [loadingIglesias, setLoadingIglesias] = useState(true);

    const [areasPersonas, setAreasPersonas] = useState<string[]>([]);
    const [areasMateriales, setAreasMateriales] = useState<string[]>([]);
    const [loadingAreasPersonas, setLoadingAreasPersonas] = useState(true);
    const [loadingAreasMateriales, setLoadingAreasMateriales] = useState(true);

    // Cargar iglesias y áreas al montar
    useEffect(() => {
        cargarIglesias();
        cargarAreasPersonas();
        cargarAreasMateriales();
    }, []);

    // Cargar registros cuando cambia fecha, iglesia o tipoVista
    useEffect(() => {
        cargarRegistros();
    }, [fecha, iglesia, tipoVista]);

    useEffect(() => {
        setToolbarTitle('Agregar Registro');
    }, [setToolbarTitle]);

    const cargarIglesias = async () => {
        setLoadingIglesias(true);
        try {
            const response = await conteoService.obtenerIglesias();
            setIglesias(response.data);
        } catch (error: any) {
            console.error('❌ Error al cargar iglesias:', error);
            setToastMessage('Error al cargar las iglesias');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoadingIglesias(false);
        }
    };

    const cargarAreasPersonas = async () => {
        setLoadingAreasPersonas(true);
        try {
            const response = await conteoService.obtenerAreas('personas');
            setAreasPersonas(response.data);
        } catch (error: any) {
            console.error('❌ Error al cargar áreas de personas:', error);
            setToastMessage('Error al cargar las áreas de personas');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoadingAreasPersonas(false);
        }
    };

    const cargarAreasMateriales = async () => {
        setLoadingAreasMateriales(true);
        try {
            const response = await conteoService.obtenerAreas('materiales');
            setAreasMateriales(response.data);
        } catch (error: any) {
            console.error('❌ Error al cargar áreas de materiales:', error);
            setToastMessage('Error al cargar las áreas de materiales');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoadingAreasMateriales(false);
        }
    };

    const cargarRegistros = async () => {
        try {
            const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
            const response = await conteoService.obtener(fechaFormateada, iglesia, tipoVista);
            const registrosFormateados = response.data.map((item: any, index: number) => ({
                _id: item._id,
                id: index + 1,
                fecha: new Date(item.fecha).toLocaleDateString('es-ES'),
                iglesia: item.iglesia,
                cantidad: item.cantidad,
                area: item.area,
                subArea: item.subArea,
            }));
            setRegistros(registrosFormateados);
        } catch (error: any) {
            console.error('❌ Error al cargar registros:', error);
        }
    };

    const handleAddRecord = async () => {
        if (!iglesia || iglesia.trim() === '') {
            setToastMessage('Por favor selecciona una iglesia');
            setToastColor('danger');
            setShowToast(true);
            return;
        }
        if (!cantidad || cantidad <= 0) {
            setToastMessage('Por favor ingresa una cantidad válida');
            setToastColor('danger');
            setShowToast(true);
            return;
        }
        if (!area || area.trim() === '') {
            setToastMessage('Por favor selecciona un área');
            setToastColor('danger');
            setShowToast(true);
            return;
        }
        if (tipo === 'materiales' && !subArea) {
            setToastMessage('Por favor selecciona una sub-área para materiales');
            setToastColor('danger');
            setShowToast(true);
            return;
        }
        setLoading(true);
        try {
            await conteoService.crear({
                fecha: fecha,
                iglesia: iglesia,
                area: area,
                cantidad: cantidad,
                tipo: tipo,
                subArea: subArea,
            });
            await cargarRegistros();
            setCantidad(undefined);
            setArea('');
            setSubArea('');
            setToastMessage('Registro agregado correctamente');
            setToastColor('success');
            setShowToast(true);
            refreshData();
        } catch (error: any) {
            console.error('❌ Error al agregar:', error);
            setToastMessage(error.response?.data?.message || 'Error al agregar registro');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecord = async (id: string | undefined) => {
        if (!id) return;
        try {
            await conteoService.eliminar(id);
            await cargarRegistros();
            setToastMessage('Registro eliminado correctamente');
            setToastColor('success');
            setShowToast(true);
        } catch (error: any) {
            setToastMessage(error.response?.data?.message || 'Error al eliminar registro');
            setToastColor('danger');
            setShowToast(true);
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await cargarRegistros();
        event.detail.complete();
    };

    const totalCantidad = registros.reduce((sum, reg) => sum + reg.cantidad, 0);

    return {
        // Estados
        fecha, setFecha,
        cantidad, setCantidad,
        area, setArea,
        tipo, setTipo,
        subArea, setSubArea,
        iglesia, setIglesia,
        areas,
        registros,
        showToast, setShowToast,
        toastMessage,
        toastColor,
        loading,
        loadingAreas, // Agrega loadingAreas
        tipoVista, setTipoVista,
        iglesias,
        loadingIglesias,
        areasPersonas,
        areasMateriales,
        loadingAreasPersonas,
        loadingAreasMateriales,
        totalCantidad,
        // Funciones
        handleAddRecord,
        handleDeleteRecord,
        handleRefresh,
    };
};