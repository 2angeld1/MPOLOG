'use client';

import Modal from '@/components/Modal';
import { FiSearch } from 'react-icons/fi';

interface MiembrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministerioNombre?: string;
  submitting: boolean;
  busqueda: string;
  setBusqueda: (v: string) => void;
  miembrosFiltrados: any[];
  miembrosSeleccionados: string[];
  onToggleMember: (id: string) => void;
  onSave: () => void;
}

export default function MiembrosModal({
  isOpen, onClose, ministerioNombre, submitting,
  busqueda, setBusqueda, miembrosFiltrados,
  miembrosSeleccionados, onToggleMember, onSave,
}: MiembrosModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Miembros"
      subtitle={ministerioNombre}
      maxWidth="max-w-lg"
      footer={
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <strong className="text-amber-500">{miembrosSeleccionados.length}</strong> seleccionados
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
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      <div className="p-2">
        {miembrosFiltrados.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No se encontraron miembros.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {miembrosFiltrados.map((m) => {
              const isSelected = miembrosSeleccionados.includes(m._id);
              return (
                <label
                  key={m._id}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-amber-500 rounded bg-[#14161f] border-white/20"
                    checked={isSelected}
                    onChange={() => onToggleMember(m._id)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-200">{m.nombre}</div>
                    <div className="text-xs text-gray-500">{m.telefono}</div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
