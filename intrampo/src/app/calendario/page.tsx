'use client';

import AppShell from '@/components/AppShell';
import { FadeIn } from '@/animations';
import {
  useCalendario,
  EVENT_TYPES,
  MONTHS,
  DEPARTMENTS,
  type CalendarView,
} from '@/hooks/useCalendario';
import { FiCalendar, FiList, FiPlus, FiClipboard, FiChevronLeft, FiChevronRight, FiTag, FiUsers } from 'react-icons/fi';
import { BsCalendarWeek } from 'react-icons/bs';
import { useAppContext } from '@/components/AppShell';
import MonthView from './MonthView';
import WeekView from './WeekView';
import AgendaView from './AgendaView';
import EventDetailModal from './EventDetailModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import EventFormModal from './EventFormModal';
import TemplatePanel from './TemplatePanel';
import UpcomingSidebar from './UpcomingSidebar';

const VIEW_OPTIONS: { key: CalendarView; label: string; icon: React.ReactNode }[] = [
  { key: 'mes', label: 'Mes', icon: <FiCalendar className="w-3.5 h-3.5" /> },
  { key: 'semana', label: 'Semana', icon: <BsCalendarWeek className="w-3.5 h-3.5" /> },
  { key: 'agenda', label: 'Agenda', icon: <FiList className="w-3.5 h-3.5" /> },
];

function CalendarioContent() {
  const cal = useCalendario();
  const { user } = useAppContext();

  // Week view header label
  const weekLabel = (() => {
    if (cal.weekDays.length < 7) return '';
    const first = cal.weekDays[0].date;
    const last = cal.weekDays[6].date;
    if (first.getMonth() === last.getMonth()) {
      return `${first.getDate()} – ${last.getDate()} ${MONTHS[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${first.getDate()} ${MONTHS[first.getMonth()].substring(0, 3)} – ${last.getDate()} ${MONTHS[last.getMonth()].substring(0, 3)} ${first.getFullYear()}`;
  })();

  return (
    <FadeIn>
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Calendario de Eventos</h1>
          <p className="text-gray-400 text-[0.95rem]">Visualiza y gestiona todos los eventos y actividades de la iglesia.</p>
        </div>
        {cal.isAdmin && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => cal.setShowTemplatePanel(true)}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2"
              id="templates-btn"
            >
              <FiClipboard className="w-4 h-4" /> Plantillas
            </button>
            <button
              onClick={() => cal.openCreateForm()}
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2"
              id="new-event-btn"
            >
              <FiPlus className="w-4 h-4" /> Nuevo Evento
            </button>
          </div>
        )}
      </div>

      {/* ─── Filters + View Toggle ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="flex bg-[#14161f] border border-white/10 rounded-xl p-1 shrink-0">
          {VIEW_OPTIONS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => cal.setView(key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                cal.view === key
                  ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative">
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            <select
              value={cal.filterTipo}
              onChange={(e) => cal.setFilterTipo(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg bg-[#14161f] border border-white/10 text-gray-300 text-xs font-semibold focus:border-amber-500/50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="todos">Todos los tipos</option>
              {EVENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            <select
              value={cal.filterDepartamento}
              onChange={(e) => cal.setFilterDepartamento(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg bg-[#14161f] border border-white/10 text-gray-300 text-xs font-semibold focus:border-amber-500/50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="todos">Todos los departamentos</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          {/* Navigation bar */}
          <div className="bg-[#1a1c25] rounded-t-2xl border border-white/10 border-b-0 px-6 py-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14161f] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => cal.navigate(-1)}
                aria-label="Anterior"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="px-3 py-1 flex items-center justify-center rounded-lg bg-[#14161f] text-gray-400 text-xs font-semibold uppercase tracking-wider border border-white/10 hover:bg-white/5 hover:text-white transition-colors"
                onClick={cal.goToToday}
              >
                Hoy
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14161f] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white transition-colors"
                onClick={() => cal.navigate(1)}
                aria-label="Siguiente"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="font-display text-xl font-bold text-amber-500 uppercase tracking-widest">
              {cal.view === 'semana' ? weekLabel : `${MONTHS[cal.month]} ${cal.year}`}
            </div>
          </div>

          {/* Views */}
          {cal.view === 'mes' && (
            <MonthView
              calendarDays={cal.calendarDays}
              getEventsForDay={cal.getEventsForDay}
              isToday={cal.isToday}
              isAdmin={cal.isAdmin}
              openCreateForm={cal.openCreateForm}
              setSelectedEvent={cal.setSelectedEvent}
              handleEventDrop={cal.handleEventDrop}
              handleCreateEventFromTemplate={cal.handleCreateEventFromTemplate}
            />
          )}
          {cal.view === 'semana' && (
            <WeekView
              weekDays={cal.weekDays}
              getEventsForDate={cal.getEventsForDate}
              isTodayDate={cal.isTodayDate}
              isAdmin={cal.isAdmin}
              openCreateForm={cal.openCreateForm}
              setSelectedEvent={cal.setSelectedEvent}
              handleEventDrop={cal.handleEventDrop}
              handleCreateEventFromTemplate={cal.handleCreateEventFromTemplate}
            />
          )}
          {cal.view === 'agenda' && (
            <div className="bg-[#1a1c25] rounded-b-2xl border border-white/10 shadow-xl overflow-hidden">
              <AgendaView
                eventos={cal.eventos}
                filterTipo={cal.filterTipo}
                filterDepartamento={cal.filterDepartamento}
                onSelect={cal.setSelectedEvent}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <UpcomingSidebar
          eventos={cal.upcomingEvents}
          loading={cal.loading}
          onSelect={cal.setSelectedEvent}
        />
      </div>

      {/* ─── Modals ─── */}
      {cal.selectedEvent && (
        <EventDetailModal
          evento={cal.selectedEvent}
          onClose={() => cal.setSelectedEvent(null)}
          isAdmin={cal.isAdmin}
          onEdit={() => cal.openEditForm(cal.selectedEvent!)}
          onDelete={() => cal.setShowDeleteConfirm(true)}
          onSaveTemplate={() => cal.saveAsTemplate(cal.selectedEvent!)}
        />
      )}

      <DeleteConfirmModal
        isOpen={cal.showDeleteConfirm && !!cal.selectedEvent}
        eventName={cal.selectedEvent?.nombre || ''}
        onClose={() => cal.setShowDeleteConfirm(false)}
        onConfirm={cal.handleDelete}
        submitting={cal.submitting}
      />

      <EventFormModal
        isOpen={cal.showEventForm}
        onClose={cal.closeForm}
        formData={cal.formData}
        setFormData={cal.setFormData}
        onSubmit={cal.handleSubmit}
        submitting={cal.submitting}
        isEditing={!!cal.editingEvent}
      />

      <TemplatePanel
        isOpen={cal.showTemplatePanel}
        onClose={() => cal.setShowTemplatePanel(false)}
        plantillas={cal.plantillas}
        loading={cal.loadingPlantillas}
        onApply={cal.applyTemplate}
      />
    </FadeIn>
  );
}

export default function CalendarioPage() {
  return (
    <AppShell>
      <CalendarioContent />
    </AppShell>
  );
}
