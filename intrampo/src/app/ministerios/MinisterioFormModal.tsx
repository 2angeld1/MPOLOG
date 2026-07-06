'use client';

import Modal from '@/components/Modal';
import { iconOptions } from '@/lib/ministerioIcons';

interface MinisterioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  submitting: boolean;
  formData: { id: string; nombre: string; descripcion: string; color: string; icono: string };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MinisterioFormModal({
  isOpen, onClose, editMode, submitting, formData, setFormData, onSubmit,
}: MinisterioFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? 'Editar Ministerio' : 'Nuevo Ministerio'}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="ministerio-form"
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      }
    >
      <form id="ministerio-form" onSubmit={onSubmit} className="p-6">
        <div className="mb-5">
          <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Nombre del Ministerio</label>
          <input
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
            placeholder="Ej. Alabanza"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>
        <div className="mb-5">
          <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Descripción</label>
          <textarea
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y"
            placeholder="Describe la función del ministerio..."
            rows={4}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Color</label>
            <input
              type="color"
              className="w-full h-[50px] p-1 bg-[#14161f] border border-white/10 rounded-lg cursor-pointer transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Icono</label>
            <div className="grid grid-cols-5 gap-1.5 bg-[#14161f] border border-white/10 rounded-lg p-2 max-h-[100px] overflow-y-auto">
              {iconOptions.map((opt) => {
                const isSelected = formData.icono === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.label}
                    className={`p-2 rounded-lg flex items-center justify-center text-lg transition-colors ${isSelected ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    onClick={() => setFormData({ ...formData, icono: opt.value })}
                  >
                    <opt.Icon />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
