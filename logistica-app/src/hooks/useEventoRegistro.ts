import { useState, useEffect, useCallback } from 'react';
import { eventoService } from '../services/api';
import { Evento, EventoPersona, EventoEstadisticas, Ubicacion } from '../../types/types';

export const useEventoRegistro = () => {
    // Estado de eventos
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
    const [loadingEventos, setLoadingEventos] = useState(false);

    // Estado de personas
    const [personas, setPersonas] = useState<EventoPersona[]>([]);
    const [loadingPersonas, setLoadingPersonas] = useState(false);

    // Estado de estadísticas
    const [estadisticas, setEstadisticas] = useState<EventoEstadisticas | null>(null);
    const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);

    // Estado del formulario de persona
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [edad, setEdad] = useState<number | undefined>(undefined);
    const [abono, setAbono] = useState(false);
    const [montoAbono, setMontoAbono] = useState<number | undefined>(undefined);
    const [equipo, setEquipo] = useState('');

    // Estado del formulario de evento (para crear)
    const [nuevoEventoNombre, setNuevoEventoNombre] = useState('');
    const [nuevoEventoTipo, setNuevoEventoTipo] = useState<'campamento' | 'retiro' | 'conferencia' | 'otro'>('campamento');
    const [nuevoEventoFechaInicio, setNuevoEventoFechaInicio] = useState<Date | null>(null);
    const [nuevoEventoFechaFin, setNuevoEventoFechaFin] = useState<Date | null>(null);
    const [nuevoEventoPrecio, setNuevoEventoPrecio] = useState<number | undefined>(undefined);
    const [nuevoEventoDescripcion, setNuevoEventoDescripcion] = useState('');
    const [nuevoEventoUbicacion, setNuevoEventoUbicacion] = useState<Ubicacion | undefined>(undefined);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    // Estado de edición
    const [isEditing, setIsEditing] = useState(false);
    const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
    const [showCrearEvento, setShowCrearEvento] = useState(false);
    const [isEditingEvento, setIsEditingEvento] = useState(false);
    const [editingEventoId, setEditingEventoId] = useState<string | null>(null);
    const [showRegistrarPersona, setShowRegistrarPersona] = useState(false);

    // Estado de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Estado de UI
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning'>('success');

    // Estado de sugerencias de equipo
    const [showEquipoSugerencias, setShowEquipoSugerencias] = useState(false);

    // Cargar eventos al montar
    useEffect(() => {
        cargarEventos();
    }, []);

    // Cargar personas y estadísticas cuando cambia el evento
    useEffect(() => {
        if (eventoSeleccionado) {
            cargarPersonas();
            cargarEstadisticas();
        } else {
            setPersonas([]);
            setEstadisticas(null);
        }
    }, [eventoSeleccionado]);

    const cargarEventos = async () => {
        setLoadingEventos(true);
        try {
            const data = await eventoService.obtenerEventos(true);
            setEventos(data);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            mostrarToast('Error al cargar eventos', 'danger');
        } finally {
            setLoadingEventos(false);
        }
    };

    const cargarPersonas = async () => {
        if (!eventoSeleccionado) return;
        setLoadingPersonas(true);
        try {
            const data = await eventoService.obtenerPersonas(eventoSeleccionado);
            setPersonas(data);
        } catch (error) {
            console.error('Error al cargar personas:', error);
            mostrarToast('Error al cargar personas', 'danger');
        } finally {
            setLoadingPersonas(false);
        }
    };

    const cargarEstadisticas = async () => {
        if (!eventoSeleccionado) return;
        setLoadingEstadisticas(true);
        try {
            const data = await eventoService.obtenerEstadisticas(eventoSeleccionado);
            setEstadisticas(data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoadingEstadisticas(false);
        }
    };

    const mostrarToast = (message: string, color: 'success' | 'danger' | 'warning') => {
        setToastMessage(message);
        setToastColor(color);
        setShowToast(true);
    };

    const limpiarFormularioPersona = () => {
        setNombre('');
        setApellido('');
        setEdad(undefined);
        setAbono(false);
        setMontoAbono(undefined);
        setEquipo('');
        setIsEditing(false);
        setEditingPersonaId(null);
    };

    const limpiarFormularioEvento = () => {
        setNuevoEventoNombre('');
        setNuevoEventoTipo('campamento');
        setNuevoEventoFechaInicio(null);
        setNuevoEventoFechaFin(null);
        setNuevoEventoPrecio(undefined);
        setNuevoEventoDescripcion('');
        setNuevoEventoUbicacion(undefined);
        setShowCrearEvento(false);
        setIsEditingEvento(false);
        setEditingEventoId(null);
    };

    const handleCrearEvento = async () => {
        if (!nuevoEventoNombre || !nuevoEventoFechaInicio || !nuevoEventoFechaFin || !nuevoEventoPrecio) {
            mostrarToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }

        setLoading(true);
        try {
            if (isEditingEvento && editingEventoId) {
                const eventoActualizado = await eventoService.actualizarEvento(editingEventoId, {
                    nombre: nuevoEventoNombre,
                    tipo: nuevoEventoTipo,
                    fechaInicio: nuevoEventoFechaInicio!.toISOString(),
                    fechaFin: nuevoEventoFechaFin!.toISOString(),
                    precioTotal: nuevoEventoPrecio,
                    descripcion: nuevoEventoDescripcion,
                    ubicacion: nuevoEventoUbicacion
                });

                setEventos(eventos.map(e => e._id === editingEventoId ? eventoActualizado : e));
                mostrarToast('Evento actualizado exitosamente', 'success');
            } else {
                const nuevoEvento = await eventoService.crearEvento({
                    nombre: nuevoEventoNombre,
                    tipo: nuevoEventoTipo,
                    fechaInicio: nuevoEventoFechaInicio!.toISOString(),
                    fechaFin: nuevoEventoFechaFin!.toISOString(),
                    precioTotal: nuevoEventoPrecio,
                    descripcion: nuevoEventoDescripcion || undefined,
                    ubicacion: nuevoEventoUbicacion
                });

                setEventos([nuevoEvento, ...eventos]);
                setEventoSeleccionado(nuevoEvento._id);
                mostrarToast('Evento creado exitosamente', 'success');
            }
            limpiarFormularioEvento();
        } catch (error) {
            console.error('Error al guardar evento:', error);
            mostrarToast('Error al guardar el evento', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleEditarEventoClick = (eventoId: string) => {
        const evento = eventos.find(e => e._id === eventoId);
        if (evento) {
            setNuevoEventoNombre(evento.nombre);
            setNuevoEventoTipo(evento.tipo);
            setNuevoEventoFechaInicio(new Date(evento.fechaInicio));
            setNuevoEventoFechaFin(new Date(evento.fechaFin));
            setNuevoEventoPrecio(evento.precioTotal);
            setNuevoEventoDescripcion(evento.descripcion || '');
            setNuevoEventoUbicacion(evento.ubicacion);
            setIsEditingEvento(true);
            setEditingEventoId(eventoId);
            setShowCrearEvento(true);
        }
    };

    const handleRegistrarPersona = async () => {
        if (!eventoSeleccionado) {
            mostrarToast('Selecciona un evento primero', 'warning');
            return;
        }
        if (!nombre || !edad) {
            mostrarToast('Por favor completa el nombre completo y la edad', 'warning');
            return;
        }

        // Dividir nombre completo en nombre y apellido
        const partesNombre = nombre.trim().split(' ');
        const nombreFinal = partesNombre[0];
        const apellidoFinal = partesNombre.slice(1).join(' ') || '.'; // Si no hay apellido, ponemos un punto para el backend

        // Normalizar el equipo: si coincide con uno existente, usar ese nombre
        let equipoFinal = equipo?.trim() || undefined;
        if (equipoFinal) {
            const equipoExistente = buscarEquipoCoincidente(equipoFinal);
            if (equipoExistente) {
                equipoFinal = equipoExistente;
            }
        }

        setLoading(true);
        try {
            if (isEditing && editingPersonaId) {
                await eventoService.actualizarPersona(eventoSeleccionado, editingPersonaId, {
                    nombre: nombreFinal,
                    apellido: apellidoFinal,
                    edad,
                    abono,
                    montoAbono: abono ? montoAbono : 0,
                    equipo: equipoFinal
                });
                mostrarToast('Registro actualizado exitosamente', 'success');
            } else {
                await eventoService.registrarPersona(eventoSeleccionado, {
                    nombre: nombreFinal,
                    apellido: apellidoFinal,
                    edad,
                    abono,
                    montoAbono: abono ? montoAbono : 0,
                    equipo: equipoFinal
                });
                mostrarToast('Persona registrada exitosamente', 'success');
            }
            
            limpiarFormularioPersona();
            cargarPersonas();
            cargarEstadisticas();
        } catch (error: any) {
            console.error('Error al registrar persona:', error);
            mostrarToast(error?.response?.data?.message || 'Error al registrar la persona', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleEditarPersona = (personaId: string) => {
        const persona = personas.find(p => p._id === personaId);
        if (persona) {
            // Unir nombre y apellido para el campo único
            setNombre(`${persona.nombre} ${persona.apellido === '.' ? '' : persona.apellido}`.trim());
            setApellido(''); // Ya no se usa individualmente
            setEdad(persona.edad);
            setAbono(persona.abono);
            setMontoAbono(persona.montoAbono);
            setEquipo(persona.equipo || '');
            setIsEditing(true);
            setEditingPersonaId(personaId);
            setShowRegistrarPersona(true); // Expandir al editar
        }
    };

    const handleEliminarPersona = async (personaId?: string) => {
        if (!personaId || !eventoSeleccionado) return;

        setLoading(true);
        try {
            await eventoService.eliminarPersona(eventoSeleccionado, personaId);
            mostrarToast('Registro eliminado', 'success');
            cargarPersonas();
            cargarEstadisticas();
        } catch (error) {
            console.error('Error al eliminar persona:', error);
            mostrarToast('Error al eliminar el registro', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarEdicion = () => {
        limpiarFormularioPersona();
    };

    const handleRefresh = async (event: CustomEvent) => {
        await Promise.all([cargarEventos(), cargarPersonas(), cargarEstadisticas()]);
        event.detail.complete();
    };

    // Filtrar personas por búsqueda
    const personasFiltradas = personas.filter(persona => {
        if (!searchTerm) return true;
        const termLower = searchTerm.toLowerCase();
        return (
            persona.nombre.toLowerCase().includes(termLower) ||
            persona.apellido.toLowerCase().includes(termLower) ||
            (persona.equipo && persona.equipo.toLowerCase().includes(termLower))
        );
    });

    // Obtener equipos únicos del evento actual
    const equiposUnicos = [...new Set(
        personas
            .filter(p => p.equipo && p.equipo.trim() !== '')
            .map(p => p.equipo!.trim())
    )];

    // Función para normalizar el nombre de un equipo (extraer palabras clave)
    const normalizarEquipo = (nombre: string): string[] => {
        const palabrasIgnoradas = ['equipo', 'team', 'grupo', 'el', 'la', 'los', 'las', 'de', 'del'];
        return nombre
            .toLowerCase()
            .split(/\s+/)
            .filter(palabra => palabra.length > 1 && !palabrasIgnoradas.includes(palabra));
    };

    // Buscar equipo existente que coincida con la entrada del usuario
    const buscarEquipoCoincidente = (input: string): string | null => {
        if (!input.trim()) return null;
        const palabrasInput = normalizarEquipo(input);
        
        for (const equipoExistente of equiposUnicos) {
            const palabrasEquipo = normalizarEquipo(equipoExistente);
            // Si alguna palabra clave coincide, es el mismo equipo
            const hayCoincidencia = palabrasInput.some(palabra => 
                palabrasEquipo.some(pe => pe.includes(palabra) || palabra.includes(pe))
            );
            if (hayCoincidencia) {
                return equipoExistente;
            }
        }
        return null;
    };

    // Obtener sugerencias de equipos filtradas por el texto ingresado
    const sugerenciasEquipo = equipo.trim()
        ? equiposUnicos.filter(eq => 
            eq.toLowerCase().includes(equipo.toLowerCase()) ||
            normalizarEquipo(eq).some(palabra => 
                normalizarEquipo(equipo).some(p => palabra.includes(p) || p.includes(palabra))
            )
        )
        : equiposUnicos;

    // Handler para seleccionar un equipo sugerido
    const handleSeleccionarEquipo = (equipoSeleccionado: string) => {
        setEquipo(equipoSeleccionado);
        setShowEquipoSugerencias(false);
    };

    return {
        // Eventos
        eventos,
        eventoSeleccionado,
        setEventoSeleccionado,
        loadingEventos,
        cargarEventos,
        
        // Crear evento
        showCrearEvento,
        setShowCrearEvento,
        nuevoEventoNombre,
        setNuevoEventoNombre,
        nuevoEventoTipo,
        setNuevoEventoTipo,
        nuevoEventoFechaInicio,
        setNuevoEventoFechaInicio,
        nuevoEventoFechaFin,
        setNuevoEventoFechaFin,
        nuevoEventoPrecio,
        setNuevoEventoPrecio,
        nuevoEventoDescripcion,
        setNuevoEventoDescripcion,
        nuevoEventoUbicacion,
        setNuevoEventoUbicacion,
        showLocationPicker,
        setShowLocationPicker,
        handleCrearEvento,
        handleEditarEventoClick,
        limpiarFormularioEvento,
        isEditingEvento,
        setIsEditingEvento,

        // Personas
        personas: personasFiltradas,
        loadingPersonas,
        
        // Formulario persona
        nombre,
        setNombre,
        apellido,
        setApellido,
        edad,
        setEdad,
        abono,
        setAbono,
        montoAbono,
        setMontoAbono,
        equipo,
        setEquipo,
        
        // Acciones persona
        handleRegistrarPersona,
        handleEditarPersona,
        handleEliminarPersona,
        handleCancelarEdicion,
        isEditing,
        showRegistrarPersona,
        setShowRegistrarPersona,
        
        // Estadísticas
        estadisticas,
        loadingEstadisticas,
        
        // Búsqueda
        searchTerm,
        setSearchTerm,
        
        // UI
        loading,
        showToast,
        setShowToast,
        toastMessage,
        toastColor,
        handleRefresh,

        // Sugerencias de equipo
        equiposUnicos,
        sugerenciasEquipo,
        showEquipoSugerencias,
        setShowEquipoSugerencias,
        handleSeleccionarEquipo,
        buscarEquipoCoincidente
    };
};
