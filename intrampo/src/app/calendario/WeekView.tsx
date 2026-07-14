'use client';

import { EVENT_TYPE_COLORS, DAYS_SHORT } from '@/hooks/useCalendario';
import type { IEvento } from '@/types';
import { formatTime } from '@/lib/utils';
import { FiClock } from 'react-icons/fi';

interface WeekViewProps {
  weekDays: { date: Date; dayName: string }[];
  getEventsForDate: (date: Date) => IEvento[];
  isTodayDate: (date: Date) => boolean;
  isAdmin: boolean;
  openCreateForm: (date?: string) => void;
  setSelectedEvent: (e: IEvento) => void;
  handleEventDrop: (eventId: string, targetDateStr: string) => void;
  handleCreateEventFromTemplate: (templateId: string, targetDateStr: string) => void;
}

export default function WeekView({
  weekDays,
  getEventsForDate,
  isTodayDate,
  isAdmin,
  openCreateForm,
  setSelectedEvent,
  handleEventDrop,
  handleCreateEventFromTemplate,
}: WeekViewProps) {
  return (
    <div className="bg-[#1a1c25] rounded-b-2xl border border-white/10 shadow-xl overflow-hidden">
      <div className="grid grid-cols-7 gap-[1px] bg-white/10">
        {/* Day headers */}
        {weekDays.map((wd, i) => (
          <div
            key={i}
            className={`bg-[#14161f] p-3 text-center ${
              isTodayDate(wd.date) ? 'bg-amber-500/10' : ''
            }`}
          >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{DAYS_SHORT[i]}</div>
            <div className={`text-lg font-bold mt-1 ${
              isTodayDate(wd.date) ? 'text-amber-500' : 'text-gray-300'
            }`}>
              {wd.date.getDate()}
            </div>
          </div>
        ))}

        {/* Day contents */}
        {weekDays.map((wd, i) => {
          const dayEvents = getEventsForDate(wd.date);
          const clickDate = wd.date.toISOString().split('T')[0];
          return (
            <div
              key={`content-${i}`}
              className={`bg-[#1a1c25] min-h-[300px] p-2 flex flex-col gap-2 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                isTodayDate(wd.date) ? 'bg-amber-500/[0.03]' : ''
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
              {dayEvents.map((ev) => (
                <div
                  key={ev._id}
                  draggable={isAdmin}
                  onDragStart={(e) => {
                    if (isAdmin) {
                      e.dataTransfer.setData('text/plain', ev._id);
                    }
                  }}
                  className="rounded-lg p-2.5 text-white cursor-grab active:cursor-grabbing hover:opacity-90 transition-opacity border border-white/10"
                  style={{ backgroundColor: `${ev.color || EVENT_TYPE_COLORS[ev.tipo] || '#673AB7'}30` }}
                  onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                >
                  <div
                    className="w-full h-0.5 rounded-full mb-2"
                    style={{ backgroundColor: ev.color || EVENT_TYPE_COLORS[ev.tipo] || '#673AB7' }}
                  />
                  <div className="text-xs font-bold text-gray-200 truncate">{ev.nombre}</div>
                  {ev.horaInicio && (
                    <div className="text-[0.65rem] text-gray-400 mt-1 font-medium flex items-center gap-1">
                      <FiClock className="w-3 h-3 text-gray-400" />
                      {formatTime(ev.horaInicio)}{ev.horaFin ? ` – ${formatTime(ev.horaFin)}` : ''}
                    </div>
                  )}
                  <div className="text-[0.6rem] text-gray-500 mt-0.5">{ev.departamento}</div>
                </div>
              ))}
              {dayEvents.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-gray-700 text-xs italic">Sin eventos</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
