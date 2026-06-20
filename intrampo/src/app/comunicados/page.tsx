'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { useAppContext } from '@/components/AppShell';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/animations';

export interface IComunicado {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
  autorId: string;
  autorNombre: string;
  fijado: boolean;
  activo: boolean;
  imagenUrl?: string | null;
  archivoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

type Categoria = 'todos' | 'lideres' | 'servidores' | 'general' | 'admin' | 'pastoral';

const categorias: { value: Categoria; label: string; emoji: string }[] = [
  { value: 'todos', label: 'Todos', emoji: '📋' },
  { value: 'lideres', label: 'Líderes', emoji: '👥' },
  { value: 'servidores', label: 'Servidores', emoji: '🙌' },
  { value: 'general', label: 'General', emoji: '📢' },
  { value: 'admin', label: 'Administradores', emoji: '💼' },
  { value: 'pastoral', label: 'Pastoral', emoji: '🙏' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-PA', { day: 'numeric', month: 'short' });
}

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<IComunicado[]>([]);
  const [filtro, setFiltro] = useState<Categoria>('todos');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ titulo: '', contenido: '', categoria: 'general' });
  const [imagen, setImagen] = useState<File | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComunicados();
  }, []);

  const fetchComunicados = async () => {
    try {
      const res = await fetch('/api/comunicados');
      if (res.ok) {
        const data = await res.json();
        setComunicados(data.comunicados || []);
      }
    } catch {
      // Will get demo data from API
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imagenUrl = null;
      let archivoUrl = null;

      if (imagen) {
        const formData = new FormData();
        formData.append('file', imagen);
        const res = await fetch('/api/archivos', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          imagenUrl = data.archivo.url;
        }
      }

      if (archivo) {
        const formData = new FormData();
        formData.append('file', archivo);
        const res = await fetch('/api/archivos', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          archivoUrl = data.archivo.url;
        }
      }

      const res = await fetch('/api/comunicados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imagenUrl, archivoUrl }),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ titulo: '', contenido: '', categoria: 'general' });
        setImagen(null);
        setArchivo(null);
        fetchComunicados();
      }
    } catch {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filtro === 'todos'
    ? comunicados
    : comunicados.filter(c => c.categoria === filtro);

  return (
    <AppShell>
      <FadeIn>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Comunicados</h1>
            <p className="text-gray-400 text-[0.95rem]">Noticias y avisos de la iglesia para la congregación.</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2" onClick={() => setShowForm(true)} id="new-comunicado-btn">
            <span>➕</span> Nuevo Comunicado
          </button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-[#1a1c25] rounded-xl border border-white/10 shadow-sm">
          {categorias.map((cat) => (
            <button
              key={cat.value}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${filtro === cat.value ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/20' : 'bg-[#14161f] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'}`}
              onClick={() => setFiltro(cat.value)}
            >
              <span className="text-base">{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Comunicados list */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <StaggerContainer className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((c) => (
              <StaggerItem key={c.id} className={`bg-[#1a1c25] rounded-2xl border border-white/10 p-6 break-inside-avoid transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group ${c.fijado ? 'ring-2 ring-amber-500 shadow-amber-500/10' : ''}`}>
                {c.fijado && <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden"><div className="bg-amber-500 text-[0.6rem] font-bold text-gray-900 text-center py-1 absolute top-2 right-[-14px] w-[60px] rotate-45 shadow-md">FIJADO</div></div>}
                
                {c.imagenUrl && (
                  <div className="w-[calc(100%+3rem)] -mx-6 -mt-6 mb-6 h-48 overflow-hidden relative">
                    <img src={c.imagenUrl} alt="Imagen comunicado" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c25] via-transparent to-transparent opacity-80" />
                  </div>
                )}
                
                <span className={`inline-block px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wider rounded-lg mb-4 ${
                  c.categoria === 'pastoral' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  c.categoria === 'lideres' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  c.categoria === 'servidores' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  c.categoria === 'admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  {categorias.find(cat => cat.value === c.categoria)?.emoji || '📢'} {c.categoria}
                </span>
                
                <div className="font-display text-xl font-bold text-gray-100 mb-3">{c.titulo}</div>
                <div className="text-gray-300 text-[0.95rem] leading-relaxed mb-6 whitespace-pre-wrap">{c.contenido}</div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[0.8rem] font-medium text-gray-400 flex items-center gap-1.5">
                    <span className="opacity-70">✍️</span> {c.autorNombre}
                  </span>
                  <span className="text-[0.75rem] font-semibold text-gray-500">{timeAgo(c.createdAt)}</span>
                </div>
                
                {c.archivoUrl && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <a href={c.archivoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold text-gray-300 transition-colors">
                      <span>📄</span> Descargar Adjunto
                    </a>
                  </div>
                )}
              </StaggerItem>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
                <div className="text-4xl mb-4 opacity-50">📢</div>
                <div className="font-display text-xl font-semibold mb-2 text-gray-400">Sin comunicados</div>
                <div className="text-sm text-center">No hay comunicados en esta categoría.</div>
              </div>
            )}
          </StaggerContainer>
        )}

        {/* New Comunicado Modal */}
        {showForm && (
          <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowForm(false)} duration={0.2}>
            <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <h3 className="font-display text-xl font-bold text-gray-100">Nuevo Comunicado</h3>
                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
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
                  <div className="mb-5">
                    <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Imagen (Opcional)</label>
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
                  </div>
                  <div className="mb-2">
                    <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Archivo Adjunto (Opcional)</label>
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
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02] shrink-0">
                  <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={() => setShowForm(false)}>
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
        )}
      </FadeIn>
    </AppShell>
  );
}
