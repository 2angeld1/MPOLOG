'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { FiSearch, FiImage } from 'react-icons/fi';

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, archivoId?: string) => void;
}

export default function ImageSelectorModal({ isOpen, onClose, onSelect }: ImageSelectorModalProps) {
  const [archivos, setArchivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/archivos')
      .then(res => res.json())
      .then(data => {
        const files = data.archivos || [];
        // Filter only image files
        const images = files.filter((a: any) => {
          const fmt = (a.formato || '').toLowerCase();
          return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(fmt) || fmt.startsWith('image');
        });
        setArchivos(images);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  const filtered = archivos.filter(a =>
    !busqueda || (a.nombre || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Imagen"
      subtitle="Elige una imagen de los archivos existentes"
      maxWidth="max-w-3xl"
    >
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-full py-2.5 pr-4 pl-10 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            placeholder="Buscar imagen..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <FiImage className="text-4xl mb-4" />
            <div className="font-display text-lg font-semibold mb-1">Sin imágenes</div>
            <div className="text-sm text-center">No hay imágenes disponibles en los archivos.</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {filtered.map((archivo: any) => (
              <button
                key={archivo._id}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-amber-500 transition-all group"
                onClick={() => onSelect(archivo.url, archivo._id)}
              >
                <img
                  src={archivo.url}
                  alt={archivo.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="p-2 text-white text-[0.65rem] font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate w-full">
                    {archivo.nombre}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
