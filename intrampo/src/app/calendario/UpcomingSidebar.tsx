'use client';

import { EVENT_TYPE_COLORS, parseUTCDate } from '@/hooks/useCalendario';
import type { IEvento } from '@/types';
import { formatTime } from '@/lib/utils';
import { FiCalendar, FiClock } from 'react-icons/fi';

interface UpcomingSidebarProps {
  eventos: IEvento[];
  loading: boolean;
  onSelect: (e: IEvento) => void;
}

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function UpcomingSidebar({
  eventos,
  loading,
  onSelect,
}: UpcomingSidebarProps) {
  return (
    <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 shadow-xl lg:sticky lg:top-[calc(70px+2rem)]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <h2 className="font-display text-lg font-bold text-gray-100">Próximos</h2>
        <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{eventos.length}</span>
      </div>
      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-8">
            <FiCalendar className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p className="text-gray-500 text-sm">No hay eventos próximos</p>
          </div>
        ) : eventos.map((evento) => {
          const d = parseUTCDate(evento.fechaInicio);
          return (
            <div
              key={evento._id}
              className="flex items-center gap-4 p-3 bg-[#14161f] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group"
              onClick={() => onSelect(evento)}
            >
              <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: evento.color || EVENT_TYPE_COLORS[evento.tipo] }} />
              <div className="text-center min-w-[44px] shrink-0">
                <div className="font-display text-lg font-bold text-gray-100 leading-none group-hover:text-amber-400 transition-colors">{d.getDate()}</div>
                <div className="text-[0.65rem] text-gray-500 uppercase tracking-wider font-semibold">{MONTHS_SHORT[d.getMonth()]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-200 text-sm truncate">{evento.nombre}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 truncate">{evento.departamento}</span>
                  {evento.horaInicio && (
                    <span className="text-[0.65rem] text-gray-600 flex items-center gap-0.5">
                      <FiClock className="w-3 h-3" /> {formatTime(evento.horaInicio)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
