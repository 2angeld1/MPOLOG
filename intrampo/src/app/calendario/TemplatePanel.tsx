'use client';

import Modal from '@/components/Modal';
import type { IEventoPlantilla } from '@/types';
import { EVENT_TYPE_COLORS, DAYS_SHORT } from '@/hooks/useCalendario';
import { FiCalendar, FiClock, FiClipboard } from 'react-icons/fi';

interface TemplatePanelProps {
  isOpen: boolean;
  onClose: () => void;
  plantillas: IEventoPlantilla[];
  loading: boolean;
  onApply: (plantilla: IEventoPlantilla) => void;
}

export default function TemplatePanel({
  isOpen,
  onClose,
  plantillas,
  loading,
  onApply,
}: TemplatePanelProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plantillas de Eventos"
      subtitle="Selecciona o arrastra una plantilla directamente al calendario"
      maxWidth="max-w-md"
    >
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : plantillas.length === 0 ? (
          <div className="text-center py-10 px-4">
            <FiClipboard className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 font-semibold mb-1">Sin plantillas</p>
            <p className="text-gray-500 text-sm">
              Crea un evento y guárdalo como plantilla para usarlo después.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
            {plantillas.map((p) => {
              const color = p.color || EVENT_TYPE_COLORS[p.tipo] || '#673AB7';
              return (
                <button
                  key={p._id}
                  onClick={() => onApply(p)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('templateId', p._id);
                  }}
                  className="flex items-center gap-4 p-4 bg-[#14161f] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all text-left group cursor-grab active:cursor-grabbing"
                >
                  {/* Color bar */}
                  <div
                    className="w-1.5 h-12 rounded-full shrink-0 group-hover:h-14 transition-all"
                    style={{ backgroundColor: color }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-200 text-sm truncate group-hover:text-amber-400 transition-colors">
                      {p.nombre}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${color}20`,
                          color: color,
                        }}
                      >
                        {p.tipo}
                      </span>
                      <span className="text-[0.65rem] text-gray-500 font-medium">{p.departamento}</span>
                      {p.diaSemana !== undefined && (
                        <span className="text-[0.65rem] text-gray-500 font-medium bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" /> {DAYS_SHORT[p.diaSemana]}
                        </span>
                      )}
                      {p.horaInicio && (
                        <span className="text-[0.65rem] text-gray-500 font-medium bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <FiClock className="w-3 h-3" /> {p.horaInicio}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Usage badge */}
                  <div className="text-center shrink-0">
                    <div className="text-[0.6rem] text-gray-600 uppercase tracking-wider font-semibold">Usos</div>
                    <div className="text-sm font-bold text-gray-400">{p.usageCount}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
