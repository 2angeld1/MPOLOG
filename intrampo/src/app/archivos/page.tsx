'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/animations';

interface IArchivo {
  _id: string;
  nombre: string;
  url: string;
  public_id: string;
  formato: string;
  tamano: number;
  subidoPor?: { name: string; email: string };
  createdAt: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ArchivosPage() {
  const [archivos, setArchivos] = useState<IArchivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadData, setUploadData] = useState({ nombre: '', base64Content: '' });
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArchivos();
  }, []);

  const fetchArchivos = async () => {
    try {
      const res = await fetch('/api/archivos');
      if (res.ok) {
        const data = await res.json();
        setArchivos(data);
      }
    } catch (err) {
      console.error('Error fetching archivos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadData({
          nombre: file.name.split('.')[0],
          base64Content: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.base64Content) {
      setUploadError('Por favor selecciona un archivo.');
      return;
    }
    
    setSubmitting(true);
    setUploadError('');
    try {
      const res = await fetch('/api/archivos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData),
      });

      if (res.ok) {
        setShowUploadForm(false);
        setUploadData({ nombre: '', base64Content: '' });
        fetchArchivos();
      } else {
        const errData = await res.json();
        setUploadError(errData.error || 'Error al subir (Probablemente no eres admin)');
      }
    } catch (err) {
      setUploadError('Error de red al subir el archivo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) return;
    
    try {
      const res = await fetch(`/api/archivos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchArchivos();
      } else {
        alert('Error al eliminar (Probablemente no eres admin)');
      }
    } catch (err) {
      alert('Error de red al eliminar');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  return (
    <AppShell>
      <FadeIn>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Imágenes y Archivos</h1>
            <p className="text-gray-400 text-[0.95rem]">Galería de recursos y documentos generales.</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2" onClick={() => setShowUploadForm(true)}>
            <span>☁️</span> Subir Archivo
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
            {archivos.map((a) => (
              <StaggerItem key={a._id} className="bg-[#1a1c25] rounded-2xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                <div className="h-[160px] bg-black/20 flex items-center justify-center overflow-hidden relative">
                  {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(a.formato.toLowerCase()) ? (
                    <img src={a.url} alt={a.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="text-5xl opacity-50 group-hover:opacity-80 transition-opacity">📄</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c25] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="font-semibold text-[0.95rem] text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-amber-400 transition-colors" title={a.nombre}>
                    {a.nombre}
                  </div>
                  <div className="flex justify-between text-[0.8rem] text-gray-500 font-semibold tracking-wide">
                    <span className="uppercase">{a.formato}</span>
                    <span>{formatBytes(a.tamano)}</span>
                  </div>
                  <div className="flex gap-2 mt-auto pt-4 border-t border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[0.8rem] font-semibold transition-colors border border-transparent hover:border-white/10" onClick={() => window.open(a.url, '_blank')}>
                      Ver
                    </button>
                    <button className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[0.8rem] font-semibold transition-colors border border-transparent hover:border-white/10" onClick={() => copyToClipboard(a.url)}>
                      Copiar URL
                    </button>
                    <button className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-colors flex items-center justify-center" onClick={() => handleDelete(a._id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
            
            {archivos.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
                <div className="text-4xl mb-4 opacity-50">📁</div>
                <div className="font-display text-xl font-semibold mb-2 text-gray-400">Galería vacía</div>
                <div className="text-sm text-center">Sube tu primer archivo o imagen.</div>
              </div>
            )}
          </StaggerContainer>
        )}

        {showUploadForm && (
          <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowUploadForm(false)} duration={0.2}>
            <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-display text-xl font-bold text-gray-100">Subir Nuevo Archivo</h3>
                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShowUploadForm(false)}>✕</button>
              </div>
              <form onSubmit={handleUploadSubmit}>
                <div className="p-6">
                  {uploadError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
                      <span className="text-lg">⚠️</span> {uploadError}
                    </div>
                  )}
                  <div className="mb-5">
                    <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Archivo</label>
                    <div className="w-full bg-[#14161f] border border-white/10 border-dashed rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative min-h-[100px] flex items-center justify-center">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
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
                      onChange={(e) => setUploadData({ ...uploadData, nombre: e.target.value })}
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02]">
                  <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={() => setShowUploadForm(false)}>
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
        )}
      </FadeIn>
    </AppShell>
  );
}
