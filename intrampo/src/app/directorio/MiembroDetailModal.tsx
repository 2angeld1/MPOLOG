'use client';

import { FadeIn, ScaleIn } from '@/animations';
import { FiEdit2, FiTrash2, FiPhone } from 'react-icons/fi';
import { getAvatarColor, getInitials, isNuevo } from '@/lib/utils';
import type { Miembro } from '@/hooks/useDirectorio';

interface MiembroDetailModalProps {
  miembro: Miembro | null;
  onClose: () => void;
  onEdit: (miembro: Miembro) => void;
  onDelete: (id: string) => void;
}

export default function MiembroDetailModal({ miembro, onClose, onEdit, onDelete }: MiembroDetailModalProps) {
  if (!miembro) return null;

  return (
    <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose} duration={0.2}>
      <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
        <div className="p-4 flex justify-between">
          <button className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1.5" onClick={() => onEdit(miembro)}>
            <FiEdit2 size={14} /> Editar
          </button>
          <div className="flex gap-2">
            <button className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1.5" onClick={() => onDelete(miembro._id)}>
              <FiTrash2 size={14} /> Eliminar
            </button>
            <button className="text-gray-400 hover:text-white px-2 rounded-md transition-colors" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="px-8 pb-8 flex flex-col items-center">
          <div
            className="w-28 h-28 rounded-full mb-4 flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-[#1a1c25]"
            style={{ background: miembro.fotoUrl ? `url(${miembro.fotoUrl}) center/cover` : getAvatarColor(miembro.nombre), color: '#fff', transform: 'translateY(-10px)' }}
          >
            {!miembro.fotoUrl && getInitials(miembro.nombre)}
          </div>
          <div className="text-center w-full">
            <h2 className="font-display text-2xl font-bold text-gray-100 mb-3">{miembro.nombre}</h2>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{miembro.edad} años</span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{miembro.tiempoIglesia}</span>
              {isNuevo(miembro.createdAt) && <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">NUEVO</span>}
            </div>
          </div>

          <div className="w-full bg-white/5 border border-white/5 rounded-xl p-5 mt-2 flex flex-col gap-4 text-left">
            <div>
              <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Teléfono</div>
              <div className="text-gray-200 font-medium flex items-center gap-1.5"><FiPhone size={14} /> {miembro.telefono}</div>
            </div>
            <div>
              <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Familia / Parentesco</div>
              <div className="text-gray-200 font-medium">{miembro.parentesco || 'No especificado'}</div>
            </div>
            <div>
              <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Servicio</div>
              <div className="text-gray-200 font-medium flex items-center gap-2">
                {miembro.esServidor ? (
                  <><span className="text-green-500">●</span> Sirve en: {miembro.dondeSirve || 'Área no especificada'}</>
                ) : (
                  <><span className="text-gray-600">○</span> No es servidor</>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScaleIn>
    </FadeIn>
  );
}
