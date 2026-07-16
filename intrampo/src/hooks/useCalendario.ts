import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from '@/components/AppShell';
import type { IEvento, IEventoPlantilla } from '@/types';

import {
  EVENT_TYPES,
  EVENT_TYPE_COLORS,
  DEPARTMENTS,
  DAYS_SHORT,
  DAYS_LONG,
  MONTHS,
  type TipoEvento,
} from '@/lib/utils';

export type CalendarView = 'mes' | 'semana' | 'agenda';
export { EVENT_TYPES, EVENT_TYPE_COLORS, DEPARTMENTS, DAYS_SHORT, DAYS_LONG, MONTHS };
export type { TipoEvento };

export interface EventFormData {
  nombre: string;
  tipo: TipoEvento;
  departamento: string;
  color: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  descripcion: string;
  precioTotal: number;
  ubicacion: string;
  visibleSoloPor: string;
}

const EMPTY_FORM: EventFormData = {
  nombre: '',
  tipo: 'culto',
  departamento: 'General',
  color: '',
  fechaInicio: '',
  fechaFin: '',
  horaInicio: '',
  horaFin: '',
  descripcion: '',
  precioTotal: 0,
  ubicacion: '',
  visibleSoloPor: '',
};

export const parseUTCDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
};

export function useCalendario() {
  const { user } = useAppContext();

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('mes');
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [plantillas, setPlantillas] = useState<IEventoPlantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlantillas, setLoadingPlantillas] = useState(true);

  // Filters
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('todos');

  // Modals
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvento | null>(null);
  const [editingEvent, setEditingEvent] = useState<IEvento | null>(null);

  // Form
  const [formData, setFormData] = useState<EventFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Permissions
  const safeRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const isAdmin = safeRoles.some(r =>
    ['admin', 'superadmin', 'logisticadmin', 'pastor'].includes(r)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch events
  const fetchEventos = useCallback(async () => {
    try {
      const res = await fetch(`/api/eventos?mes=${month}&anio=${year}`);
      if (res.ok) {
        const data = await res.json();
        if (data.eventos) setEventos(data.eventos);
      }
    } catch {
      // Keep existing data
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  // Fetch templates
  const fetchPlantillas = useCallback(async () => {
    try {
      const res = await fetch('/api/eventos/plantillas');
      if (res.ok) {
        const data = await res.json();
        if (data.plantillas) setPlantillas(data.plantillas);
      }
    } catch {
      // Keep existing data
    } finally {
      setLoadingPlantillas(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  useEffect(() => {
    fetchPlantillas();
  }, [fetchPlantillas]);

  // Calendar grid computation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days: { date: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: daysInPrevMonth - i, month: month - 1, year, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, month, year, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, month: month + 1, year, isCurrentMonth: false });
    }
    return days;
  }, [year, month]);

  // Week view computation
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const days: { date: Date; dayName: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      days.push({ date: d, dayName: DAYS_LONG[d.getDay()] });
    }
    return days;
  }, [currentDate]);

  // Get filtered events for a specific day
  const getEventsForDay = useCallback((date: number, m: number, y: number) => {
    return eventos.filter((e) => {
      // Apply type/dept filters
      if (filterTipo !== 'todos' && e.tipo !== filterTipo) return false;
      if (filterDepartamento !== 'todos' && e.departamento !== filterDepartamento) return false;

      const start = parseUTCDate(e.fechaInicio);
      const end = parseUTCDate(e.fechaFin);
      const dayDate = new Date(y, m, date);
      return dayDate >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             dayDate <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
  }, [eventos, filterTipo, filterDepartamento]);

  // Get filtered events for a Date object
  const getEventsForDate = useCallback((date: Date) => {
    return getEventsForDay(date.getDate(), date.getMonth(), date.getFullYear());
  }, [getEventsForDay]);

  // Today checks
  const today = new Date();
  const isToday = (date: number, m: number, y: number) =>
    date === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  const isTodayDate = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  // Navigation
  const navigate = (dir: number) => {
    if (view === 'mes') {
      setCurrentDate(new Date(year, month + dir, 1));
    } else if (view === 'semana') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + (dir * 7));
      setCurrentDate(d);
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  // Upcoming events (filtered)
  const upcomingEvents = useMemo(() => {
    return eventos
      .filter((e) => {
        if (filterTipo !== 'todos' && e.tipo !== filterTipo) return false;
        if (filterDepartamento !== 'todos' && e.departamento !== filterDepartamento) return false;
        return parseUTCDate(e.fechaFin) >= new Date(new Date().setHours(0,0,0,0));
      })
      .sort((a, b) => parseUTCDate(a.fechaInicio).getTime() - parseUTCDate(b.fechaInicio).getTime())
      .slice(0, 10);
  }, [eventos, filterTipo, filterDepartamento]);

  // Form management
  const openCreateForm = (presetDate?: string) => {
    const dateStr = presetDate || new Date().toISOString().split('T')[0];
    setFormData({ ...EMPTY_FORM, fechaInicio: dateStr, fechaFin: dateStr });
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const openEditForm = (evento: IEvento) => {
    setEditingEvent(evento);
    setFormData({
      nombre: evento.nombre,
      tipo: evento.tipo,
      departamento: evento.departamento,
      color: evento.color || '',
      fechaInicio: parseUTCDate(evento.fechaInicio).toISOString().split('T')[0],
      fechaFin: parseUTCDate(evento.fechaFin).toISOString().split('T')[0],
      horaInicio: evento.horaInicio || '',
      horaFin: evento.horaFin || '',
      descripcion: evento.descripcion || '',
      precioTotal: evento.precioTotal,
      ubicacion: evento.ubicacion?.nombreLugar || '',
      visibleSoloPor: evento.visibleSoloPor || '',
    });
    setShowEventForm(true);
    setSelectedEvent(null);
  };

  const applyTemplate = (plantilla: IEventoPlantilla) => {
    // Find the next occurrence of the template's day of week
    let targetDate = new Date();
    if (plantilla.diaSemana !== undefined) {
      const diff = (plantilla.diaSemana - targetDate.getDay() + 7) % 7;
      targetDate.setDate(targetDate.getDate() + (diff === 0 ? 7 : diff));
    }
    const dateStr = targetDate.toISOString().split('T')[0];

    setFormData({
      nombre: plantilla.nombre,
      tipo: plantilla.tipo,
      departamento: plantilla.departamento,
      color: plantilla.color || '',
      fechaInicio: dateStr,
      fechaFin: dateStr,
      horaInicio: plantilla.horaInicio || '',
      horaFin: plantilla.horaFin || '',
      descripcion: plantilla.descripcion || '',
      precioTotal: plantilla.precioTotal || 0,
      ubicacion: plantilla.ubicacion?.nombreLugar || '',
      visibleSoloPor: '',
    });
    setEditingEvent(null);
    setShowTemplatePanel(false);
    setShowEventForm(true);
  };

  const closeForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
  };

  // CRUD operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        departamento: formData.departamento,
        color: formData.color || EVENT_TYPE_COLORS[formData.tipo] || '#673AB7',
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        horaInicio: formData.horaInicio || undefined,
        horaFin: formData.horaFin || undefined,
        descripcion: formData.descripcion,
        precioTotal: formData.precioTotal,
        ubicacion: formData.ubicacion ? { nombreLugar: formData.ubicacion } : undefined,
        activo: true,
        visibleSoloPor: formData.visibleSoloPor || undefined,
      };

      const url = editingEvent ? `/api/eventos/${editingEvent._id}` : '/api/eventos';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeForm();
        fetchEventos();
      }
    } catch (err) {
      console.error('Error submitting event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/eventos/${selectedEvent._id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedEvent(null);
        setShowDeleteConfirm(false);
        fetchEventos();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const saveAsTemplate = async (evento: IEvento) => {
    try {
      const fechaInicio = parseUTCDate(evento.fechaInicio);
      const res = await fetch('/api/eventos/plantillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: evento.nombre,
          tipo: evento.tipo,
          departamento: evento.departamento,
          color: evento.color,
          descripcion: evento.descripcion,
          horaInicio: evento.horaInicio,
          horaFin: evento.horaFin,
          diaSemana: fechaInicio.getDay(),
          precioTotal: evento.precioTotal,
          ubicacion: evento.ubicacion,
        }),
      });
      if (res.ok) {
        fetchPlantillas();
      }
    } catch (err) {
      console.error('Error saving template:', err);
    }
  };

  const handleEventDrop = async (eventId: string, newDateStr: string) => {
    if (!isAdmin) return;
    const evento = eventos.find(e => e._id === eventId);
    console.log('🔄 [Drag & Drop] Evento encontrado para mover:', evento);
    if (!evento) return;

    const start = parseUTCDate(evento.fechaInicio);
    const end = parseUTCDate(evento.fechaFin);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const newStart = new Date(newDateStr + 'T12:00:00');
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + diffDays);

    const payload = {
      fechaInicio: newStart.toISOString().split('T')[0],
      fechaFin: newEnd.toISOString().split('T')[0]
    };
    console.log('🔄 [Drag & Drop] Enviando actualización PUT:', `/api/eventos/${eventId}`, payload);

    try {
      const res = await fetch(`/api/eventos/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('🔄 [Drag & Drop] Respuesta del servidor:', res.status, res.statusText);
      
      if (res.ok) {
        fetchEventos();
      } else {
        const errData = await res.json();
        console.error('❌ [Drag & Drop] Error en respuesta:', errData);
      }
    } catch (err) {
      console.error('❌ [Drag & Drop] Error de conexión:', err);
    }
  };

  const handleCreateEventFromTemplate = async (templateId: string, targetDateStr: string) => {
    if (!isAdmin) return;
    const plantilla = plantillas.find(p => p._id === templateId);
    if (!plantilla) return;

    try {
      const payload = {
        nombre: plantilla.nombre,
        tipo: plantilla.tipo,
        departamento: plantilla.departamento,
        color: plantilla.color || EVENT_TYPE_COLORS[plantilla.tipo] || '#673AB7',
        fechaInicio: targetDateStr,
        fechaFin: targetDateStr,
        horaInicio: plantilla.horaInicio || undefined,
        horaFin: plantilla.horaFin || undefined,
        descripcion: plantilla.descripcion,
        precioTotal: plantilla.precioTotal || 0,
        ubicacion: plantilla.ubicacion,
        activo: true,
      };

      const res = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Increment template usage locally & reload
        fetchEventos();
        fetchPlantillas();
      }
    } catch (err) {
      console.error('Error creating event from template:', err);
    }
  };

  return {
    // Calendar state
    currentDate,
    setCurrentDate,
    view,
    setView,
    year,
    month,
    eventos,
    plantillas,
    loading,
    loadingPlantillas,

    // Filters
    filterTipo,
    setFilterTipo,
    filterDepartamento,
    setFilterDepartamento,

    // Modals
    showEventForm,
    setShowEventForm,
    showTemplatePanel,
    setShowTemplatePanel,
    showDeleteConfirm,
    setShowDeleteConfirm,
    selectedEvent,
    setSelectedEvent,
    editingEvent,

    // Form
    formData,
    setFormData,
    submitting,

    // Permissions
    isAdmin,

    // Computed
    calendarDays,
    weekDays,
    upcomingEvents,

    // Methods
    getEventsForDay,
    getEventsForDate,
    isToday,
    isTodayDate,
    navigate,
    goToToday,
    openCreateForm,
    openEditForm,
    applyTemplate,
    closeForm,
    handleSubmit,
    handleDelete,
    saveAsTemplate,
    fetchEventos,
    fetchPlantillas,
    handleEventDrop,
    handleCreateEventFromTemplate,
  };
}
