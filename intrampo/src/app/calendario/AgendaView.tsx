'use client';

import { EVENT_TYPE_COLORS, DAYS_SHORT, MONTHS } from '@/hooks/useCalendario';
import type { IEvento } from '@/types';
import { formatEventType, formatTime } from '@/lib/utils';
import { FiCalendar } from 'react-icons/fi';

interface AgendaViewProps {
  eventos: IEvento[];
  filterTipo: string;
  filterDepartamento: string;
  onSelect: (e: IEvento) => void;
}

export default function AgendaView({
  eventos,
  filterTipo,
  filterDepartamento,
  onSelect,
}: AgendaViewProps) {
  const filtered = eventos
    .filter(e => {
      if (filterTipo !== 'todos' && e.tipo !== filterTipo) return false;
      if (filterDepartamento !== 'todos' && e.departamento !== filterDepartamento) return false;
      return new Date(e.fechaFin) >= new Date(new Date().setHours(0, 0, 0, 0));
    })
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());

  // Group by date
  const grouped: Record<string, IEvento[]> = {};
  filtered.forEach(ev => {
    const key = new Date(ev.fechaInicio).toISOString().split('T')[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  const dates = Object.keys(grouped).sort();

  if (dates.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <FiCalendar className="w-10 h-10 mx-auto mb-3 text-gray-600" />
        <p className="text-gray-400 font-semibold">No hay eventos próximos</p>
        <p className="text-gray-500 text-sm mt-1">Crea un evento para comenzar.</p>
      </div>
    );
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
      {dates.map(dateStr => {
        const date = new Date(dateStr + 'T12:00:00');
        const isToday = dateStr === todayStr;

        return (
          <div key={dateStr} className={`${isToday ? 'bg-amber-500/[0.03]' : ''}`}>
            {/* Date header */}
            <div className={`px-6 py-3 flex items-center gap-3 sticky top-0 bg-[#14161f]/95 backdrop-blur-sm z-10 border-b border-white/5 ${
              isToday ? 'bg-amber-500/10' : ''
            }`}>
              <div className={`font-display text-2xl font-bold ${isToday ? 'text-amber-500' : 'text-gray-300'}`}>
                {date.getDate()}
              </div>
              <div>
                <div className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-amber-500' : 'text-gray-400'}`}>
                  {DAYS_SHORT[date.getDay()]}
                </div>
                <div className="text-[0.65rem] text-gray-500">
                  {MONTHS[date.getMonth()]} {date.getFullYear()}
                </div>
              </div>
              {isToday && (
                <span className="ml-auto bg-amber-500 text-gray-900 text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Hoy
                </span>
              )}
            </div>

            {/* Events for this date */}
            <div className="px-4 py-2">
              {grouped[dateStr].map(ev => {
                const color = ev.color || EVENT_TYPE_COLORS[ev.tipo] || '#673AB7';
                return (
                  <div
                    key={ev._id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group mb-1"
                    onClick={() => onSelect(ev)}
                  >
                    <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-200 text-sm truncate group-hover:text-amber-400 transition-colors">
                        {ev.nombre}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {formatEventType(ev.tipo)}
                        </span>
                        <span className="text-[0.65rem] text-gray-500">{ev.departamento}</span>
                      </div>
                    </div>
                    {ev.horaInicio && (
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-gray-300">{formatTime(ev.horaInicio)}</div>
                        {ev.horaFin && <div className="text-[0.65rem] text-gray-500">{formatTime(ev.horaFin)}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
