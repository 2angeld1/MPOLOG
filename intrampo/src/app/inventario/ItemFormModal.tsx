'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { FiImage, FiUpload } from 'react-icons/fi';
import { ESTADOS_MATERIAL } from '@/hooks/useInventario';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  submitting: boolean;
  formData: {
    id: string; nombre: string; descripcion: string; estado: string;
    ministerioId: string; ministerioNombre: string; cantidad: string;
    ubicacion: string; notas: string; imagenUrl: string; imagenPublicId: string; archivoId: string;
  };
  setFormData: (data: any) => void;
  setImagen: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  ministerios: Array<{ id: string; nombre: string }>;
  onOpenImageSelector: () => void;
}

export default function ItemFormModal({
  isOpen, onClose, editMode, submitting, formData, setFormData, setImagen, onSubmit, ministerios, onOpenImageSelector
}: ItemFormModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const currentImage = previewUrl || formData.imagenUrl;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? 'Editar Item' : 'Agregar Nuevo Item'}
      subtitle="Completa la información del material o equipo"
      maxWidth="max-w-2xl"
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={onClose}>Cancelar</button>
          <button type="submit" form="inventario-form" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</button>
        </div>
      }
    >
      <form id="inventario-form" onSubmit={onSubmit} className="p-6 flex flex-col gap-4">
        {/* Image preview/upload section */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Imagen</label>
          {currentImage && (
            <div className="mb-3 relative group">
              <img src={currentImage} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-white/10" />
              <button
                type="button"
                onClick={() => { setPreviewUrl(null); setImagen(null); setFormData({ ...formData, imagenUrl: '', imagenPublicId: '', archivoId: '' }); }}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#14161f] border border-white/10 rounded-lg cursor-pointer hover:border-amber-500/50 transition-colors text-gray-400 hover:text-amber-400">
              <FiUpload size={16} />
              <span className="text-sm font-medium">Subir imagen</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            <button
              type="button"
              onClick={onOpenImageSelector}
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#14161f] border border-white/10 rounded-lg hover:border-purple-500/50 transition-colors text-gray-400 hover:text-purple-400"
            >
              <FiImage size={16} />
              <span className="text-sm font-medium">Seleccionar existente</span>
            </button>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Nombre del Material</label>
          <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} placeholder="Ej. Proyector Epson, Micrófono SM58..." />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Descripción</label>
          <textarea className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 min-h-[80px] resize-y" required value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} placeholder="Describe el material, modelo, marca, etc." />
        </div>

        {/* Estado + Cantidad */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Estado</label>
            <select className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none" required value={formData.estado} onChange={e => setFormData({ ...formData, estado: e.target.value })}>
              {ESTADOS_MATERIAL.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Cantidad</label>
            <input type="number" min="1" className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" value={formData.cantidad} onChange={e => setFormData({ ...formData, cantidad: e.target.value })} />
          </div>
        </div>

        {/* Ministerio / Área */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Ministerio / Área de uso</label>
          <select className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none" value={formData.ministerioNombre} onChange={e => {
            const min = ministerios.find(m => m.nombre === e.target.value);
            setFormData({ ...formData, ministerioNombre: e.target.value, ministerioId: min?.id || '' });
          }}>
            <option value="">Sin asignar</option>
            {ministerios.map(m => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Ubicación física (Opcional)</label>
          <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" value={formData.ubicacion} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} placeholder="Ej. Bodega principal, Salón 2..." />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Notas adicionales (Opcional)</label>
          <textarea className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 min-h-[60px] resize-y" value={formData.notas} onChange={e => setFormData({ ...formData, notas: e.target.value })} placeholder="Observaciones, número de serie, etc." />
        </div>
      </form>
    </Modal>
  );
}
