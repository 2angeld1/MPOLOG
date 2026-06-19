'use client';

import { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import type { IEvento } from '@/types';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const eventTypeColors: Record<string, string> = {
  culto: '#7c3aed',
  retiro: '#06b6d4',
  campamento: '#22c55e',
  conferencia: '#3b82f6',
  reunion: '#d4a843',
  ayuno: '#a855f7',
  vigilia: '#6366f1',
  evangelismo: '#f97316',
  convencion: '#ec4899',
  asignacion: '#d4a843',
  otro: '#64748b',
};

function formatEventType(tipo: string) {
  const labels: Record<string, string> = {
    culto: 'Culto', retiro: 'Retiro', campamento: 'Campamento', conferencia: 'Conferencia',
    reunion: 'Reunión', ayuno: 'Ayuno', vigilia: 'Vigilia', evangelismo: 'Evangelismo',
    convencion: 'Convención', asignacion: 'Asignación', otro: 'Otro',
  };
  return labels[tipo] || tipo;
}

// Demo events
function getDemoEvents(): IEvento[] {
  const now = new Date();
  const m = now.getMonth();
  const y = now.getFullYear();
  return [
    { _id: '1', nombre: 'Culto Dominical', tipo: 'culto', color: '#7c3aed', fechaInicio: new Date(y, m, getNextWeekday(0, now)).toISOString(), fechaFin: new Date(y, m, getNextWeekday(0, now)).toISOString(), departamento: 'General', activo: true, precioTotal: 0 },
    { _id: '2', nombre: 'Ensayo de Alabanza', tipo: 'reunion', color: '#d4a843', fechaInicio: new Date(y, m, getNextWeekday(3, now)).toISOString(), fechaFin: new Date(y, m, getNextWeekday(3, now)).toISOString(), departamento: 'Alabanza', activo: true, precioTotal: 0 },
    { _id: '3', nombre: 'JEF Teen', tipo: 'reunion', color: '#ec4899', fechaInicio: new Date(y, m, getNextWeekday(5, now)).toISOString(), fechaFin: new Date(y, m, getNextWeekday(5, now)).toISOString(), departamento: 'JEF Teen', activo: true, precioTotal: 0 },
    { _id: '4', nombre: 'Retiro de Jóvenes', tipo: 'retiro', color: '#06b6d4', fechaInicio: new Date(y, m, Math.min(28, now.getDate() + 10)).toISOString(), fechaFin: new Date(y, m, Math.min(28, now.getDate() + 12)).toISOString(), departamento: 'Jóvenes', activo: true, precioTotal: 35, descripcion: 'Retiro de fin de semana para jóvenes.' },
    { _id: '5', nombre: 'Vigilia de Oración', tipo: 'vigilia', color: '#6366f1', fechaInicio: new Date(y, m, Math.min(28, now.getDate() + 15)).toISOString(), fechaFin: new Date(y, m, Math.min(28, now.getDate() + 15)).toISOString(), departamento: 'General', activo: true, precioTotal: 0 },
    { _id: '6', nombre: 'Mentor Club', tipo: 'reunion', color: '#f97316', fechaInicio: new Date(y, m, getNextWeekday(6, now)).toISOString(), fechaFin: new Date(y, m, getNextWeekday(6, now)).toISOString(), departamento: 'Kids', activo: true, precioTotal: 0 },
  ];
}

function getNextWeekday(day: number, from: Date): number {
  const diff = (day - from.getDay() + 7) % 7;
  return from.getDate() + (diff === 0 ? 7 : diff);
}

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState<IEvento[]>(getDemoEvents());
  const [selectedEvent, setSelectedEvent] = useState<IEvento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/eventos');
        if (res.ok) {
          const data = await res.json();
          if (data.eventos?.length > 0) setEventos(data.eventos);
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days: { date: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

    // Previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: daysInPrevMonth - i, month: month - 1, year, isCurrentMonth: false });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, month, year, isCurrentMonth: true });
    }
    // Next month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, month: month + 1, year, isCurrentMonth: false });
    }
    return days;
  }, [year, month]);

  const getEventsForDay = (date: number, m: number, y: number) => {
    return eventos.filter((e) => {
      const start = new Date(e.fechaInicio);
      const end = new Date(e.fechaFin);
      const dayDate = new Date(y, m, date);
      return dayDate >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             dayDate <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });
  };

  const today = new Date();
  const isToday = (date: number, m: number, y: number) =>
    date === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  const navigate = (dir: number) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  // Upcoming events
  const upcomingEvents = eventos
    .filter((e) => new Date(e.fechaFin) >= new Date())
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
    .slice(0, 8);

  return (
    <AppShell>
      <div className="animate-fade-in-up">
        <h1 className="page-title">Calendario de Eventos</h1>
        <p className="page-subtitle">Visualiza todos los eventos y actividades de la iglesia.</p>

        <div className="grid-2" style={{ alignItems: 'start', gridTemplateColumns: '2fr 1fr' }}>
          {/* Calendar */}
          <div className="calendar-container">
            <div className="calendar-header">
              <div className="calendar-nav">
                <button className="calendar-nav-btn" onClick={() => navigate(-1)} aria-label="Mes anterior">
                  ←
                </button>
                <button className="calendar-nav-btn" onClick={() => setCurrentDate(new Date())} style={{ fontSize: '0.75rem', width: 'auto', padding: '0 12px' }}>
                  Hoy
                </button>
                <button className="calendar-nav-btn" onClick={() => navigate(1)} aria-label="Mes siguiente">
                  →
                </button>
              </div>
              <div className="calendar-month">
                {MONTHS[month]} {year}
              </div>
            </div>

            <div className="calendar-grid">
              {DAYS.map((d) => (
                <div key={d} className="calendar-day-header">{d}</div>
              ))}
              {calendarDays.map((day, i) => {
                const dayEvents = getEventsForDay(day.date, day.month, day.year);
                return (
                  <div
                    key={i}
                    className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.date, day.month, day.year) ? 'today' : ''}`}
                  >
                    <div className="calendar-day-number">{day.date}</div>
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev._id}
                        className="calendar-event-dot"
                        style={{ backgroundColor: ev.color || eventTypeColors[ev.tipo] || '#673AB7' }}
                        onClick={() => setSelectedEvent(ev)}
                        title={ev.nombre}
                      >
                        {ev.nombre}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', padding: '0 4px' }}>
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Upcoming events */}
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-8))' }}>
            <div className="section-header">
              <h2 className="section-title">Próximos</h2>
              <span className="badge badge-gold">{upcomingEvents.length}</span>
            </div>
            <div className="event-list">
              {loading ? (
                <div className="loader"><div className="spinner" /></div>
              ) : upcomingEvents.map((evento) => {
                const d = new Date(evento.fechaInicio);
                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return (
                  <div
                    key={evento._id}
                    className="event-card"
                    onClick={() => setSelectedEvent(evento)}
                  >
                    <div className="event-color-bar" style={{ backgroundColor: evento.color || eventTypeColors[evento.tipo] }} />
                    <div className="event-date-box">
                      <div className="event-date-day">{d.getDate()}</div>
                      <div className="event-date-month">{months[d.getMonth()]}</div>
                    </div>
                    <div className="event-info">
                      <div className="event-name">{evento.nombre}</div>
                      <div className="event-meta">
                        <span>{evento.departamento}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{selectedEvent.nombre}</h3>
                <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <span className="badge" style={{
                    backgroundColor: `${selectedEvent.color || eventTypeColors[selectedEvent.tipo]}20`,
                    color: selectedEvent.color || eventTypeColors[selectedEvent.tipo],
                  }}>
                    {formatEventType(selectedEvent.tipo)}
                  </span>
                  <span className="badge badge-purple">{selectedEvent.departamento}</span>
                  {selectedEvent.activo && <span className="badge badge-green">Activo</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Fecha inicio</strong>
                    <p style={{ fontSize: '0.9rem' }}>{new Date(selectedEvent.fechaInicio).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Fecha fin</strong>
                    <p style={{ fontSize: '0.9rem' }}>{new Date(selectedEvent.fechaFin).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  {selectedEvent.descripcion && (
                    <div>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Descripción</strong>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedEvent.descripcion}</p>
                    </div>
                  )}
                  {selectedEvent.ubicacion?.nombreLugar && (
                    <div>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Ubicación</strong>
                      <p style={{ fontSize: '0.9rem' }}>📍 {selectedEvent.ubicacion.nombreLugar}</p>
                    </div>
                  )}
                  {selectedEvent.precioTotal > 0 && (
                    <div>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Precio</strong>
                      <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>B/. {selectedEvent.precioTotal.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
