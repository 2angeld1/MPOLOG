'use client';

import { FadeIn, ScaleIn } from '@/animations';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitting: boolean;
  uploadError: string;
  carpetaActual: string;
  uploadData: { nombre: string; base64Content: string };
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (nombre: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UploadFileModal({
  isOpen,
  onClose,
  submitting,
  uploadError,
  carpetaActual,
  uploadData,
  onFileChange,
  onNameChange,
  onSubmit
}: UploadFileModalProps) {
  if (!isOpen) return null;

  return (
    <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose} duration={0.2}>
      <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h3 className="font-display text-xl font-bold text-gray-100">Subir Nuevo Archivo</h3>
          <button className="text-gray-400 hover:text-white transition-colors" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="p-6">
            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span> {uploadError}
              </div>
            )}
            <div className="mb-6 bg-amber-500/5 border border-amber-500/20 text-amber-500 px-4 py-2.5 rounded-lg text-xs font-semibold">
              Subiendo a: <span className="underline">{carpetaActual}</span>
            </div>
            <div className="mb-5">
              <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Archivo</label>
              <div className="w-full bg-[#14161f] border border-white/10 border-dashed rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative min-h-[100px] flex items-center justify-center">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={onFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="text-gray-400 text-sm font-medium">
                  {uploadData.nombre ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-amber-500">
                      <span className="text-2xl">📎</span> {uploadData.nombre}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl mb-1">☁️</span> Haz clic o arrastra para subir archivo
                      <span className="text-[0.7rem] text-gray-600 font-normal mt-1">Imágenes, PDF, DOC (Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Nombre del archivo (Opcional)</label>
              <input
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                placeholder="Nombre del recurso"
                value={uploadData.nombre}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
          </div>
          <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02]">
            <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] flex justify-center" disabled={submitting}>
              {submitting ? (
                <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
              ) : 'Subir Archivo'}
            </button>
          </div>
        </form>
      </ScaleIn>
    </FadeIn>
  );
}
