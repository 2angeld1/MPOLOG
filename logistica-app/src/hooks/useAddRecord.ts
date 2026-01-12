import { useState, useEffect, useMemo } from 'react';
import { conteoService } from '../services/api';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
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
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const { refreshData, setToolbarTitle } = useData();
    const [tipoVista, setTipoVista] = useState<'personas' | 'materiales'>('personas');

    // Estados para edición
    const [isEditing, setIsEditing] = useState(false);
    const [editingRegistroId, setEditingRegistroId] = useState<string | null>(null);

    // Estados para vista agrupada
    const [viewGrouped, setViewGrouped] = useState(false);
    const [registrosAgrupados, setRegistrosAgrupados] = useState<any[]>([]);

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

    // Cargar registros cuando cambia fecha, iglesia, tipoVista
    useEffect(() => {
        cargarRegistros();
    }, [fecha, iglesia, tipoVista]);

    // Recargar cuando cambia viewGrouped
    useEffect(() => {
        if (tipoVista) {
            cargarRegistros();
        }
    }, [viewGrouped]);

    // Debug para vista agrupada
    useEffect(() => {
        console.log('🔄 Estado de vista:', { viewGrouped, registrosAgrupadosLength: registrosAgrupados.length, iglesia, tipoVista, fecha });
    }, [viewGrouped, registrosAgrupados, iglesia, tipoVista, fecha]);

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
            showToast('Error al cargar las iglesias', 'danger');
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
            showToast('Error al cargar las áreas de personas', 'danger');
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
            showToast('Error al cargar las áreas de materiales', 'danger');
        } finally {
            setLoadingAreasMateriales(false);
        }
    };

    const cargarRegistros = async () => {
        try {
            const fechaFormateada = new Date(fecha).toISOString().split('T')[0];

            // Siempre obtenemos los datos sin agrupar del backend para manejar el agrupamiento localmente
            // Esto soluciona problemas de zona horaria donde registros de días diferentes (local)
            // caen en el mismo día UTC y el backend los agrupaba incorrectamente.
            const response = await conteoService.obtener(fechaFormateada, iglesia, tipoVista);
            
            const registrosData = response.data || [];

            // Formatear registros para la vista de lista
            const registrosFormateados = registrosData.map((item: any, index: number) => ({
                _id: item._id,
                id: index + 1,
                fecha: new Date(item.fecha).toLocaleDateString('es-ES'),
                iglesia: item.iglesia,
                cantidad: item.cantidad,
                area: item.area,
                subArea: item.subArea,
            }));
            setRegistros(registrosFormateados);

            if (viewGrouped) {
                // Agrupar localmente
                const grouped: { [key: string]: any } = {};

                registrosData.forEach((item: any) => {
                    // Usar fecha local para la clave de agrupamiento
                    const localDate = new Date(item.fecha).toLocaleDateString('es-ES');
                    // Clave única por Fecha Local + Iglesia + Tipo + Área
                    const key = `${localDate}_${item.iglesia}_${item.tipo}_${item.area}`;

                    if (!grouped[key]) {
                        grouped[key] = {
                            area: item.area,
                            totalCantidad: 0,
                            registros: [],
                            fecha: localDate,
                            iglesia: item.iglesia
                        };
                    }

                    grouped[key].totalCantidad += item.cantidad;
                    grouped[key].registros.push({
                        id: item._id,
                        cantidad: item.cantidad,
                        subArea: item.subArea
                    });
                });

                setRegistrosAgrupados(Object.values(grouped));
            } else {
                setRegistrosAgrupados([]);
            }
        } catch (error: any) {
            console.error('❌ Error al cargar registros:', error);
        }
    };

    const handleAddRecord = async () => {
        if (!iglesia || iglesia.trim() === '') {
            showToast('Por favor selecciona una iglesia', 'danger');
            return;
        }
        if (!cantidad || cantidad <= 0) {
            showToast('Por favor ingresa una cantidad válida', 'danger');
            return;
        }
        if (!area || area.trim() === '') {
            showToast('Por favor selecciona un área', 'danger');
            return;
        }
        if (tipo === 'materiales' && !subArea) {
            showToast('Por favor selecciona una sub-área para materiales', 'danger');
            return;
        }
        setLoading(true);
        try {
            if (isEditing && editingRegistroId) {
                // Actualizar registro existente
                await conteoService.actualizar(editingRegistroId, {
                    fecha: fecha,
                    iglesia: iglesia,
                    area: area,
                    cantidad: cantidad,
                    tipo: tipo,
                    subArea: subArea,
                });
            } else {
                // Crear nuevo registro
                await conteoService.crear({
                    fecha: fecha,
                    iglesia: iglesia,
                    area: area,
                    cantidad: cantidad,
                    tipo: tipo,
                    subArea: subArea,
                });
            }

            await cargarRegistros();
            // Limpiar formulario
            setCantidad(undefined);
            setArea('');
            setSubArea('');
            setIsEditing(false);
            setEditingRegistroId(null);

            showToast(isEditing ? 'Registro actualizado correctamente' : 'Registro agregado correctamente', 'success');
            refreshData();
        } catch (error: any) {
            console.error('❌ Error al guardar:', error);
            showToast(error.response?.data?.message || 'Error al guardar registro', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecord = async (id: string | undefined) => {
        if (!id) return;
        try {
            await conteoService.eliminar(id);
            await cargarRegistros();
            showToast('Registro eliminado correctamente', 'success');
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error al eliminar registro', 'danger');
        }
    };

    const handleEditRecord = async (registroId: string) => {
        try {
            // Buscar el registro completo desde la API
            const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
            const response = await conteoService.obtener(fechaFormateada, iglesia, tipoVista);
            const registro = response.data.find((r: any) => r._id === registroId);

            if (registro) {
                // Pre-llenar el formulario con los datos del registro
                setFecha(new Date(registro.fecha).toISOString());
                setIglesia(registro.iglesia);
                setTipoVista(registro.tipo);
                setTipo(registro.tipo);
                setArea(registro.area);
                setCantidad(registro.cantidad);
                setSubArea(registro.subArea || '');
                setIsEditing(true);
                setEditingRegistroId(registroId);
            }
        } catch (error: any) {
            console.error('❌ Error al cargar registro para editar:', error);
            showToast('Error al cargar registro para editar', 'danger');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingRegistroId(null);
        setCantidad(undefined);
        setArea('');
        setSubArea('');
    };

    const handleRefresh = async (event: CustomEvent) => {
        await cargarRegistros();
        event.detail.complete();
    };

    const totalCantidad = registros.reduce((sum, reg) => sum + reg.cantidad, 0);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredRegistros = useMemo(() => {
        if (!searchTerm) return registros;
        const lowerTerm = searchTerm.toLowerCase();
        return registros.filter(r =>
            r.area.toLowerCase().includes(lowerTerm) ||
            (r.subArea && r.subArea.toLowerCase().includes(lowerTerm)) ||
            r.iglesia.toLowerCase().includes(lowerTerm) ||
            r.fecha.includes(searchTerm)
        );
    }, [registros, searchTerm]);

    const filteredRegistrosAgrupados = useMemo(() => {
        if (!searchTerm) return registrosAgrupados;
        const lowerTerm = searchTerm.toLowerCase();
        return registrosAgrupados.filter(g =>
            g.area.toLowerCase().includes(lowerTerm) ||
            g.iglesia.toLowerCase().includes(lowerTerm) ||
            g.fecha.includes(searchTerm) ||
            g.registros.some((r: any) => r.subArea && r.subArea.toLowerCase().includes(lowerTerm))
        );
    }, [registrosAgrupados, searchTerm]);

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
        filteredRegistros,
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
        isEditing,
        editingRegistroId,
        viewGrouped,
        setViewGrouped,
        registrosAgrupados,
        filteredRegistrosAgrupados,
        searchTerm, setSearchTerm, // Nuevo estado
        // Funciones
        handleAddRecord,
        handleDeleteRecord,
        handleEditRecord,
        handleCancelEdit,
        handleRefresh,
    };
};