'use client';

import Modal from '@/components/Modal';
import { FiImage, FiPaperclip, FiTrash2, FiFile } from 'react-icons/fi';
import { ScaleIn, FadeIn } from '@/animations';

interface ComunicadoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitting: boolean;
  formData: { titulo: string; contenido: string; categoria: string };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  // Direct file uploads
  imagen: File | null;
  setImagen: (file: File | null) => void;
  archivo: File | null;
  setArchivo: (file: File | null) => void;
  // Selected from gallery
  imagenSeleccionada: { url: string; nombre: string } | null;
  setImagenSeleccionada: (img: { url: string; nombre: string } | null) => void;
  archivoSeleccionado: { url: string; nombre: string } | null;
  setArchivoSeleccionado: (doc: { url: string; nombre: string } | null) => void;
  // Actions
  onOpenImgSelector: () => void;
  onOpenDocSelector: () => void;
}

export default function ComunicadoFormModal({
  isOpen,
  onClose,
  submitting,
  formData,
  setFormData,
  onSubmit,
  imagen,
  setImagen,
  archivo,
  setArchivo,
  imagenSeleccionada,
  setImagenSeleccionada,
  archivoSeleccionado,
  setArchivoSeleccionado,
  onOpenImgSelector,
  onOpenDocSelector
}: ComunicadoFormModalProps) {
  if (!isOpen) return null;

  return (
    <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose} duration={0.2}>
      <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <h3 className="font-display text-xl font-bold text-gray-100">Nuevo Comunicado</h3>
          <button className="text-gray-400 hover:text-white transition-colors" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-5">
              <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="com-titulo">Título</label>
              <input
                id="com-titulo"
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                placeholder="Título del comunicado"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="com-categoria">Categoría</label>
              <select
                id="com-categoria"
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="general">General</option>
                <option value="lideres">Líderes</option>
                <option value="servidores">Servidores</option>
                <option value="admin">Administradores</option>
                <option value="pastoral">Pastoral</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider" htmlFor="com-contenido">Contenido</label>
              <textarea
                id="com-contenido"
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y min-h-[120px]"
                placeholder="Escribe el contenido del comunicado..."
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                required
                rows={5}
              />
            </div>
            
            {/* Imagen section */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[0.8rem] font-semibold text-gray-400 uppercase tracking-wider">Imagen (Opcional)</label>
                {!imagen && (
                  <button
                    type="button"
                    onClick={onOpenImgSelector}
                    className="text-[0.7rem] bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-semibold py-1 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <FiImage size={10} /> Elegir de Galería
                  </button>
                )}
              </div>

              {imagenSeleccionada ? (
                <div className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/20">
                      <img src={imagenSeleccionada.url} alt="Seleccionada" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-200 truncate">{imagenSeleccionada.nombre}</div>
                      <div className="text-[0.6rem] text-gray-500">Seleccionada de Galería</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImagenSeleccionada(null)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    title="Remover"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-full bg-[#14161f] border border-white/10 border-dashed rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
                  />
                  <div className="text-gray-400 text-sm font-medium">
                    {imagen ? (
                      <div className="flex items-center justify-center gap-2 text-amber-500">
                        <span className="text-xl">🖼️</span> {imagen?.name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl mb-1">📸</span> Haz clic para subir imagen
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Archivo adjunto section */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[0.8rem] font-semibold text-gray-400 uppercase tracking-wider">Archivo Adjunto (Opcional)</label>
                {!archivo && (
                  <button
                    type="button"
                    onClick={onOpenDocSelector}
                    className="text-[0.7rem] bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-semibold py-1 px-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <FiPaperclip size={10} /> Elegir de Galería
                  </button>
                )}
              </div>

              {archivoSeleccionado ? (
                <div className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <FiFile className="text-gray-400" size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-200 truncate">{archivoSeleccionado.nombre}</div>
                      <div className="text-[0.6rem] text-gray-500">Seleccionado de Galería</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArchivoSeleccionado(null)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    title="Remover"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-full bg-[#14161f] border border-white/10 border-dashed rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)}
                  />
                  <div className="text-gray-400 text-sm font-medium">
                    {archivo ? (
                      <div className="flex items-center justify-center gap-2 text-amber-500">
                        <span className="text-xl">📎</span> {archivo?.name}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl mb-1">📎</span> Haz clic para subir archivo
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02] shrink-0">
            <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] flex justify-center" disabled={submitting}>
              {submitting ? (
                <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
              ) : 'Publicar'}
            </button>
          </div>
        </form>
      </ScaleIn>
    </FadeIn>
  );
}
