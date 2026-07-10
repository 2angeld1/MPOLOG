'use client';

import Modal from '@/components/Modal';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitting: boolean;
  carpetaActual: string;
  newFolderName: string;
  setNewFolderName: (nombre: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  submitting,
  carpetaActual,
  newFolderName,
  setNewFolderName,
  onSubmit
}: CreateFolderModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Carpeta"
      subtitle={`Crear dentro de: ${carpetaActual}`}
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
            form="folder-form"
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20"
            disabled={submitting}
          >
            Crear
          </button>
        </div>
      }
    >
      <form id="folder-form" onSubmit={onSubmit} className="p-6">
        <div className="mb-2">
          <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Nombre de la Carpeta</label>
          <input
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
            placeholder="Nombre de la subcarpeta"
            required
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
          />
        </div>
      </form>
    </Modal>
  );
}
