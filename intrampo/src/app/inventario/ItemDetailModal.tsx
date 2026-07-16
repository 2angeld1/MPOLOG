'use client';

import { FadeIn, ScaleIn } from '@/animations';
import { FiEdit2, FiTrash2, FiMapPin, FiHash, FiUser, FiCalendar } from 'react-icons/fi';
import type { ItemInventario } from '@/hooks/useInventario';

const estadoColors: Record<string, { bg: string; text: string }> = {
  'Nuevo': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  'Bueno': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  'Regular': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  'Deteriorado': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  'Fuera de servicio': { bg: 'bg-red-500/20', text: 'text-red-400' },
};

interface ItemDetailModalProps {
  item: ItemInventario | null;
  onClose: () => void;
  onEdit: (item: ItemInventario) => void;
  onDelete: (id: string) => void;
  canManage?: boolean;
}

export default function ItemDetailModal({ item, onClose, onEdit, onDelete, canManage = false }: ItemDetailModalProps) {
  if (!item) return null;

  const colors = estadoColors[item.estado] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };

  return (
    <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose} duration={0.2}>
      <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
        {/* Actions bar */}
        <div className="p-4 flex justify-between">
          <div>
            {canManage && (
              <button className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1.5" onClick={() => onEdit(item)}>
                <FiEdit2 size={14} /> Editar
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {canManage && (
              <button className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1.5" onClick={() => onDelete(item._id)}>
                <FiTrash2 size={14} /> Eliminar
              </button>
            )}
            <button className="text-gray-400 hover:text-white px-2 rounded-md transition-colors" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Image */}
        {item.imagenUrl && (
          <div className="px-6">
            <img src={item.imagenUrl} alt={item.nombre} className="w-full h-52 object-cover rounded-xl border border-white/10" />
          </div>
        )}

        <div className="px-8 pb-8 pt-4 flex flex-col items-center">
          {/* Name and badges */}
          <div className="text-center w-full mb-4">
            <h2 className="font-display text-2xl font-bold text-gray-100 mb-3">{item.nombre}</h2>
            <div className="flex flex-wrap justify-center gap-2">
              <span className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-xs font-bold tracking-wider`}>
                {item.estado}
              </span>
              {item.ministerioNombre && (
                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                  {item.ministerioNombre}
                </span>
              )}
              <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                ×{item.cantidad}
              </span>
            </div>
          </div>

          {/* Details card */}
          <div className="w-full bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col gap-4 text-left">
            <div>
              <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Descripción</div>
              <div className="text-gray-200 font-medium text-sm leading-relaxed">{item.descripcion}</div>
            </div>
            {item.ubicacion && (
              <div>
                <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Ubicación</div>
                <div className="text-gray-200 font-medium flex items-center gap-1.5"><FiMapPin size={14} /> {item.ubicacion}</div>
              </div>
            )}
            <div className="flex gap-6">
              <div>
                <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Cantidad</div>
                <div className="text-gray-200 font-medium flex items-center gap-1.5"><FiHash size={14} /> {item.cantidad} unidad{item.cantidad !== 1 ? 'es' : ''}</div>
              </div>
              {item.creadoPorNombre && (
                <div>
                  <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Registrado por</div>
                  <div className="text-gray-200 font-medium flex items-center gap-1.5"><FiUser size={14} /> {item.creadoPorNombre}</div>
                </div>
              )}
            </div>
            {item.notas && (
              <div>
                <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Notas</div>
                <div className="text-gray-300 text-sm italic">{item.notas}</div>
              </div>
            )}
            <div>
              <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Fecha de registro</div>
              <div className="text-gray-200 font-medium flex items-center gap-1.5 text-sm">
                <FiCalendar size={14} />
                {new Date(item.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </ScaleIn>
    </FadeIn>
  );
}
