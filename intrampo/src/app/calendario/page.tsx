'use client';

import { useState, useEffect, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import type { IEvento } from '@/types';
import { FadeIn, ScaleIn } from '@/animations';

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
      <FadeIn>
        <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Calendario de Eventos</h1>
        <p className="text-gray-400 text-[0.95rem] mb-8">Visualiza todos los eventos y actividades de la iglesia.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-[#1a1c25] rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14161f] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white transition-colors" onClick={() => navigate(-1)} aria-label="Mes anterior">
                  ←
                </button>
                <button className="px-3 py-1 flex items-center justify-center rounded-lg bg-[#14161f] text-gray-400 text-xs font-semibold uppercase tracking-wider border border-white/10 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setCurrentDate(new Date())}>
                  Hoy
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14161f] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white transition-colors" onClick={() => navigate(1)} aria-label="Mes siguiente">
                  →
                </button>
              </div>
              <div className="font-display text-xl font-bold text-amber-500 uppercase tracking-widest">
                {MONTHS[month]} {year}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-[1px] bg-white/10 border border-white/10 rounded-xl overflow-hidden">
              {DAYS.map((d) => (
                <div key={d} className="bg-[#14161f] p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {d}
                </div>
              ))}
              {calendarDays.map((day, i) => {
                const dayEvents = getEventsForDay(day.date, day.month, day.year);
                return (
                  <div
                    key={i}
                    className={`bg-[#1a1c25] min-h-[100px] p-2 flex flex-col transition-colors hover:bg-white/5 ${!day.isCurrentMonth ? 'opacity-40' : ''} ${isToday(day.date, day.month, day.year) ? 'bg-amber-500/5 relative before:absolute before:inset-0 before:border-2 before:border-amber-500/50 before:rounded-sm before:pointer-events-none' : ''}`}
                  >
                    <div className={`text-right text-sm font-semibold mb-1 ${isToday(day.date, day.month, day.year) ? 'text-amber-500' : 'text-gray-400'}`}>
                      {day.date}
                    </div>
                    <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev._id}
                          className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: ev.color || eventTypeColors[ev.tipo] || '#673AB7' }}
                          onClick={() => setSelectedEvent(ev)}
                          title={ev.nombre}
                        >
                          {ev.nombre}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[0.6rem] text-gray-500 px-1 font-semibold">
                          +{dayEvents.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Upcoming events */}
          <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 shadow-xl lg:sticky lg:top-[calc(70px+2rem)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h2 className="font-display text-lg font-bold text-gray-100">Próximos</h2>
              <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{upcomingEvents.length}</span>
            </div>
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin" />
                </div>
              ) : upcomingEvents.map((evento) => {
                const d = new Date(evento.fechaInicio);
                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return (
                  <div
                    key={evento._id}
                    className="flex items-center gap-4 p-3 bg-[#14161f] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group"
                    onClick={() => setSelectedEvent(evento)}
                  >
                    <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: evento.color || eventTypeColors[evento.tipo] }} />
                    <div className="text-center min-w-[44px] shrink-0">
                      <div className="font-display text-lg font-bold text-gray-100 leading-none group-hover:text-amber-400 transition-colors">{d.getDate()}</div>
                      <div className="text-[0.65rem] text-gray-500 uppercase tracking-wider font-semibold">{months[d.getMonth()]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-200 text-sm truncate">{evento.nombre}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 truncate">{evento.departamento}</span>
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
          <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)} duration={0.2}>
            <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-display text-xl font-bold text-gray-100 truncate pr-4">{selectedEvent.nombre}</h3>
                <button className="text-gray-400 hover:text-white transition-colors shrink-0" onClick={() => setSelectedEvent(null)}>✕</button>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-6 flex-wrap">
                  <span className="px-2 py-1 text-xs font-bold rounded-md whitespace-nowrap uppercase tracking-wider" style={{
                    backgroundColor: `${selectedEvent.color || eventTypeColors[selectedEvent.tipo]}20`,
                    color: selectedEvent.color || eventTypeColors[selectedEvent.tipo],
                  }}>
                    {formatEventType(selectedEvent.tipo)}
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-bold tracking-wider uppercase">{selectedEvent.departamento}</span>
                  {selectedEvent.activo && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold tracking-wider uppercase">Activo</span>}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                    <div>
                      <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Fecha inicio</div>
                      <div className="text-gray-200 text-sm font-medium">{new Date(selectedEvent.fechaInicio).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div>
                      <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Fecha fin</div>
                      <div className="text-gray-200 text-sm font-medium">{new Date(selectedEvent.fechaFin).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </div>

                  {selectedEvent.descripcion && (
                    <div>
                      <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Descripción</div>
                      <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{selectedEvent.descripcion}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {selectedEvent.ubicacion?.nombreLugar && (
                      <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Ubicación</div>
                        <div className="text-sm text-gray-200 font-medium">📍 {selectedEvent.ubicacion.nombreLugar}</div>
                      </div>
                    )}
                    {selectedEvent.precioTotal > 0 && (
                      <div className="flex-1 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                        <div className="text-[0.7rem] text-amber-500/70 uppercase tracking-widest font-semibold mb-1">Precio</div>
                        <div className="text-sm text-amber-500 font-bold">B/. {selectedEvent.precioTotal.toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScaleIn>
          </FadeIn>
        )}
      </FadeIn>
    </AppShell>
  );
}
