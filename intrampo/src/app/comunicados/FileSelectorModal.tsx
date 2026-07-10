'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import { FiFolder, FiFile, FiArrowLeft, FiSearch } from 'react-icons/fi';

interface FileSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, name: string) => void;
  allowedFormats?: string[];
  title: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function FileSelectorModal({ isOpen, onClose, onSelect, allowedFormats, title }: FileSelectorModalProps) {
  const [archivos, setArchivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [carpetaActual, setCarpetaActual] = useState('/');
  const [busqueda, setBusqueda] = useState('');

  const fetchArchivos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/archivos');
      if (res.ok) {
        const data = await res.json();
        setArchivos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchArchivos();
      setCarpetaActual('/');
      setBusqueda('');
    }
  }, [isOpen, fetchArchivos]);

  if (!isOpen) return null;

  const navigateToFolder = (folderName: string) => {
    const targetPath = carpetaActual === '/' ? `/${folderName}` : `${carpetaActual}/${folderName}`;
    setCarpetaActual(targetPath);
  };

  const navigateBack = () => {
    if (carpetaActual === '/') return;
    const parts = carpetaActual.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    setCarpetaActual(parentPath);
  };

  // Filter items in the current folder path
  const itemsEnCarpeta = archivos.filter(a => a.carpeta === carpetaActual);

  // Divide folders and files
  const carpetasVisibles = itemsEnCarpeta.filter(a => a.formato === 'folder');
  const archivosVisibles = itemsEnCarpeta.filter(a => {
    if (a.formato === 'folder') return false;
    if (allowedFormats && allowedFormats.length > 0) {
      return allowedFormats.includes(a.formato.toLowerCase());
    }
    return true;
  });

  const filtrados = archivosVisibles.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`Carpeta actual: ${carpetaActual}`}
      maxWidth="max-w-xl"
    >
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
        {carpetaActual !== '/' && (
          <button onClick={navigateBack} className="p-2 bg-[#1a1c25] hover:bg-white/5 border border-white/10 text-gray-300 rounded-xl transition-colors shrink-0">
            <FiArrowLeft size={16} />
          </button>
        )}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg pl-10 pr-4 py-2 outline-none focus:border-amber-500 focus:ring-1"
            placeholder="Buscar en esta carpeta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="w-6 h-6 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Carpetas */}
            {carpetasVisibles.length > 0 && (
              <div>
                <div className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-2">Carpetas</div>
                <div className="grid grid-cols-2 gap-2">
                  {carpetasVisibles.map(c => (
                    <button
                      key={c._id}
                      onClick={() => navigateToFolder(c.nombre)}
                      className="flex items-center gap-3 p-2.5 bg-[#1a1c25] hover:bg-white/5 border border-white/10 rounded-xl transition-colors text-left"
                    >
                      <FiFolder className="text-amber-500 shrink-0" size={18} />
                      <span className="text-sm font-semibold text-gray-200 truncate">{c.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Archivos */}
            <div>
              <div className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider mb-2">Archivos</div>
              {filtrados.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No se encontraron archivos en esta carpeta.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtrados.map(a => {
                    const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(a.formato.toLowerCase());
                    return (
                      <button
                        key={a._id}
                        onClick={() => onSelect(a.url, a.nombre)}
                        className="flex items-center gap-3 p-2 bg-[#1a1c25] hover:bg-amber-500/10 hover:border-amber-500/30 border border-white/10 rounded-xl transition-all text-left group"
                      >
                        {isImg ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/20">
                            <img src={a.url} alt={a.nombre} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                            <FiFile className="text-gray-400" size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-200 truncate group-hover:text-amber-400 transition-colors">{a.nombre}</div>
                          <div className="text-[0.6rem] text-gray-500 uppercase mt-0.5">{a.formato} • {formatBytes(a.tamano)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
