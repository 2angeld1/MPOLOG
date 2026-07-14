'use client';

import { EVENT_TYPE_COLORS, DAYS_SHORT } from '@/hooks/useCalendario';
import type { IEvento } from '@/types';
import { formatTime } from '@/lib/utils';
import { FiClock } from 'react-icons/fi';

interface MonthViewProps {
  calendarDays: { date: number; month: number; year: number; isCurrentMonth: boolean }[];
  getEventsForDay: (date: number, m: number, y: number) => IEvento[];
  isToday: (date: number, m: number, y: number) => boolean;
  isAdmin: boolean;
  openCreateForm: (date?: string) => void;
  setSelectedEvent: (e: IEvento) => void;
  handleEventDrop: (eventId: string, targetDateStr: string) => void;
  handleCreateEventFromTemplate: (templateId: string, targetDateStr: string) => void;
}

export default function MonthView({
  calendarDays,
  getEventsForDay,
  isToday,
  isAdmin,
  openCreateForm,
  setSelectedEvent,
  handleEventDrop,
  handleCreateEventFromTemplate,
}: MonthViewProps) {
  return (
    <div className="bg-[#1a1c25] rounded-b-2xl border border-white/10 p-6 pt-0 shadow-xl relative overflow-hidden">
      <div className="grid grid-cols-7 gap-[1px] bg-white/10 border border-white/10 rounded-xl overflow-hidden">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="bg-[#14161f] p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            {d}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          const dayEvents = getEventsForDay(day.date, day.month, day.year);
          const clickDate = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
          return (
            <div
              key={i}
              className={`bg-[#1a1c25] min-h-[110px] p-2 flex flex-col transition-colors hover:bg-white/5 cursor-pointer group ${
                !day.isCurrentMonth ? 'opacity-40' : ''
              } ${
                isToday(day.date, day.month, day.year)
                  ? 'bg-amber-500/5 relative before:absolute before:inset-0 before:border-2 before:border-amber-500/50 before:rounded-sm before:pointer-events-none'
                  : ''
              }`}
              onClick={() => isAdmin && openCreateForm(clickDate)}
              onDragOver={(e) => {
                if (isAdmin) {
                  e.preventDefault();
                }
              }}
              onDrop={(e) => {
                if (!isAdmin) return;
                e.preventDefault();
                const eventId = e.dataTransfer.getData('text/plain');
                const templateId = e.dataTransfer.getData('templateId');
                
                if (eventId) {
                  handleEventDrop(eventId, clickDate);
                } else if (templateId) {
                  handleCreateEventFromTemplate(templateId, clickDate);
                }
              }}
            >
              <div className={`text-right text-sm font-semibold mb-1 flex items-center justify-end gap-1 ${
                isToday(day.date, day.month, day.year) ? 'text-amber-500' : 'text-gray-400'
              }`}>
                {isAdmin && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 text-xs">+</span>
                )}
                {day.date}
              </div>
              <div className="flex flex-col gap-1 flex-1 overflow-y-auto max-h-[140px] custom-scrollbar">
                {dayEvents.map((ev) => (
                  <div
                    key={ev._id}
                    draggable={isAdmin}
                    onDragStart={(e) => {
                      if (isAdmin) {
                        e.dataTransfer.setData('text/plain', ev._id);
                      }
                    }}
                    className="text-[0.65rem] font-bold px-1.5 py-1 rounded text-white cursor-grab active:cursor-grabbing hover:opacity-85 transition-opacity flex flex-col gap-0.5 whitespace-normal break-words border border-white/5"
                    style={{ backgroundColor: ev.color || EVENT_TYPE_COLORS[ev.tipo] || '#673AB7' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                    title={`${ev.nombre} - ${ev.horaInicio ? formatTime(ev.horaInicio) : ''}`}
                  >
                    <span className="font-semibold leading-tight">{ev.nombre}</span>
                    {ev.horaInicio && (
                      <span className="opacity-80 flex items-center gap-0.5 text-[0.6rem] font-medium mt-0.5">
                        <FiClock className="w-2.5 h-2.5 shrink-0" />
                        {formatTime(ev.horaInicio)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
