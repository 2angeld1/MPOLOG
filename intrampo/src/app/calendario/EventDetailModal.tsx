'use client';

import { FadeIn, ScaleIn } from '@/animations';
import { EVENT_TYPE_COLORS, parseUTCDate } from '@/hooks/useCalendario';
import type { IEvento } from '@/types';
import { formatEventType, formatTime } from '@/lib/utils';
import { FiX, FiEdit2, FiCopy, FiTrash2, FiMapPin, FiDollarSign } from 'react-icons/fi';

interface EventDetailModalProps {
  evento: IEvento;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSaveTemplate: () => void;
}

export default function EventDetailModal({
  evento,
  onClose,
  isAdmin,
  onEdit,
  onDelete,
  onSaveTemplate,
}: EventDetailModalProps) {
  const color = evento.color || EVENT_TYPE_COLORS[evento.tipo] || '#673AB7';

  return (
    <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose} duration={0.2}>
      <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
        {/* Color top bar */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />

        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h3 className="font-display text-xl font-bold text-gray-100 truncate pr-4">{evento.nombre}</h3>
          <button className="text-gray-400 hover:text-white transition-colors shrink-0 p-1 hover:bg-white/10 rounded-lg" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="px-2 py-1 text-xs font-bold rounded-md whitespace-nowrap uppercase tracking-wider" style={{
              backgroundColor: `${color}20`,
              color,
            }}>
              {formatEventType(evento.tipo)}
            </span>
            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-bold tracking-wider uppercase">{evento.departamento}</span>
            {evento.activo && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold tracking-wider uppercase">Activo</span>}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-3">
              <div>
                <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Fecha inicio</div>
                <div className="text-gray-200 text-sm font-medium">
                  {parseUTCDate(evento.fechaInicio).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {evento.horaInicio && <span className="text-gray-400 ml-2">· {formatTime(evento.horaInicio)}</span>}
                </div>
              </div>
              <div className="h-px bg-white/5" />
              <div>
                <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Fecha fin</div>
                <div className="text-gray-200 text-sm font-medium">
                  {parseUTCDate(evento.fechaFin).toLocaleDateString('es-PA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {evento.horaFin && <span className="text-gray-400 ml-2">· {formatTime(evento.horaFin)}</span>}
                </div>
              </div>
            </div>

            {evento.descripcion && (
              <div>
                <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Descripción</div>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{evento.descripcion}</p>
              </div>
            )}

            <div className="flex gap-4">
              {evento.ubicacion?.nombreLugar && (
                <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Ubicación</div>
                  <div className="text-sm text-gray-200 font-medium flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {evento.ubicacion.nombreLugar}
                  </div>
                </div>
              )}
              {evento.precioTotal > 0 && (
                <div className="flex-1 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <div className="text-[0.7rem] text-amber-500/70 uppercase tracking-widest font-semibold mb-1">Precio</div>
                  <div className="text-sm text-amber-500 font-bold flex items-center gap-1.5">
                    <FiDollarSign className="w-3.5 h-3.5 shrink-0" />
                    B/. {evento.precioTotal.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex gap-2 pt-2 border-t border-white/5 mt-2">
                <button
                  onClick={onEdit}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiEdit2 className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={onSaveTemplate}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiCopy className="w-3.5 h-3.5" /> Guardar plantilla
                </button>
                <button
                  onClick={onDelete}
                  className="py-2.5 px-4 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </ScaleIn>
    </FadeIn>
  );
}
