'use client';

import Modal from '@/components/Modal';
import { FiSearch } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { getAvatarColor } from '@/lib/utils';

interface LideresModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministerioNombre?: string;
  submitting: boolean;
  busqueda: string;
  setBusqueda: (v: string) => void;
  miembrosDelMinisterio: any[];
  lideresSeleccionados: string[];
  onToggleLeader: (id: string) => void;
  onSave: () => void;
}

export default function LideresModal({
  isOpen, onClose, ministerioNombre, submitting,
  busqueda, setBusqueda, miembrosDelMinisterio,
  lideresSeleccionados, onToggleLeader, onSave,
}: LideresModalProps) {
  const filtrados = miembrosDelMinisterio.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Líderes"
      subtitle={ministerioNombre}
      maxWidth="max-w-lg"
      footer={
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <strong className="text-amber-500">{lideresSeleccionados.length}</strong> líderes designados
          </div>
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={submitting}
              onClick={onSave}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      }
    >
      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
            placeholder="Buscar entre miembros..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      <div className="p-2">
        {miembrosDelMinisterio.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="mb-2">No hay miembros asignados a este ministerio.</p>
            <p className="text-xs">Primero agrega miembros desde el botón de "Miembros" en la tarjeta del ministerio.</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No se encontraron miembros con ese nombre.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtrados.map((m) => {
              const isSelected = lideresSeleccionados.includes(m._id);
              return (
                <label
                  key={m._id}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-amber-500 rounded bg-[#14161f] border-white/20"
                    checked={isSelected}
                    onChange={() => onToggleLeader(m._id)}
                  />
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: getAvatarColor(m.nombre), color: '#fff' }}
                  >
                    {m.nombre.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-200">{m.nombre}</div>
                    <div className="text-xs text-gray-500">{m.telefono}</div>
                  </div>
                  {isSelected && (
                    <FaCrown className="text-amber-500 shrink-0" size={14} />
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
