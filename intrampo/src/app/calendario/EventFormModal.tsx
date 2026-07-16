'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { EVENT_TYPES, EVENT_TYPE_COLORS, DEPARTMENTS } from '@/hooks/useCalendario';
import type { EventFormData } from '@/hooks/useCalendario';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  isEditing: boolean;
}

export default function EventFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  submitting,
  isEditing,
}: EventFormModalProps) {
  const selectedColor = formData.color || EVENT_TYPE_COLORS[formData.tipo] || '#673AB7';
  const [ministerios, setMinisterios] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ministerios')
        .then(res => res.json())
        .then(data => setMinisterios(data.ministerios || []))
        .catch(console.error);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Evento' : 'Nuevo Evento'}
      subtitle={isEditing ? 'Modifica los datos del evento' : 'Crea un nuevo evento en el calendario'}
      maxWidth="max-w-lg"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="event-form"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-gray-900 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Evento'}
          </button>
        </div>
      }
    >
      <form id="event-form" onSubmit={onSubmit} className="p-6 flex flex-col gap-5">
        {/* Event Name */}
        <div>
          <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
            Nombre del evento *
          </label>
          <input
            type="text"
            required
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Culto Dominical"
            className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
          />
        </div>

        {/* Type + Department row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Tipo *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as EventFormData['tipo'] }))}
              className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all appearance-none"
            >
              {EVENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Departamento *
            </label>
            <select
              value={formData.departamento}
              onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all appearance-none"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Fecha inicio *
            </label>
            <input
              type="date"
              required
              value={formData.fechaInicio}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  fechaInicio: e.target.value,
                  // Auto-set end date if empty or before start
                  fechaFin: (!prev.fechaFin || prev.fechaFin < e.target.value) ? e.target.value : prev.fechaFin,
                }));
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Fecha fin *
            </label>
            <input
              type="date"
              required
              value={formData.fechaFin}
              min={formData.fechaInicio}
              onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Times row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Hora inicio
            </label>
            <input
              type="time"
              value={formData.horaInicio}
              onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Hora fin
            </label>
            <input
              type="time"
              value={formData.horaFin}
              onChange={(e) => setFormData(prev => ({ ...prev, horaFin: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Color preview + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-10 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer"
              />
              <div
                className="flex-1 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: selectedColor }}
              >
                {formData.nombre || 'Vista previa'}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
              Precio (B/.)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.precioTotal}
              onChange={(e) => setFormData(prev => ({ ...prev, precioTotal: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
            Ubicación
          </label>
          <input
            type="text"
            value={formData.ubicacion}
            onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
            placeholder="Ej: Templo principal, Salón 2..."
            className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            rows={3}
            placeholder="Detalles adicionales del evento..."
            className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all resize-none"
          />
        </div>

        {/* Solo visible por (Ministerio) */}
        <div>
          <label className="block text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">
            Solo visible por (Opcional)
          </label>
          <select
            value={formData.visibleSoloPor || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, visibleSoloPor: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-[#14161f] border border-white/10 text-gray-100 text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">Todos (Público)</option>
            {ministerios.map(m => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
          <span className="text-[0.65rem] text-gray-500 mt-1 block">
            Si seleccionas un ministerio, esta actividad solo aparecerá en el calendario de los integrantes de ese ministerio.
          </span>
        </div>
      </form>
    </Modal>
  );
}
