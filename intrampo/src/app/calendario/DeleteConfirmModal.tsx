'use client';

import { FadeIn, ScaleIn } from '@/animations';
import { FiTrash2 } from 'react-icons/fi';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  eventName: string;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  eventName,
  onClose,
  onConfirm,
  submitting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4" onClick={onClose} duration={0.2}>
      <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <FiTrash2 className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-100 mb-2">¿Eliminar evento?</h3>
          <p className="text-gray-400 text-sm mb-6">
            Se eliminará <strong className="text-gray-200">{eventName}</strong> permanentemente.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-red-500 hover:bg-red-400 text-white transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Eliminar
            </button>
          </div>
        </div>
      </ScaleIn>
    </FadeIn>
  );
}
