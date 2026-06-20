'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import type { IMinisterio } from '@/types';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/animations';

export default function MinisteriosPage() {
  const [ministerios, setMinisterios] = useState<IMinisterio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#673AB7',
    icono: 'church' // Solo texto/emoji para el icono
  });

  const fetchMinisterios = async () => {
    try {
      const res = await fetch('/api/ministerios');
      if (res.ok) {
        const data = await res.json();
        setMinisterios(data.ministerios || []);
      }
    } catch {
      // Fallback handled by API
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinisterios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/ministerios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ nombre: '', descripcion: '', color: '#673AB7', icono: 'church' });
        fetchMinisterios();
      } else {
        alert('Error al crear el ministerio');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al crear ministerio');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <FadeIn>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Ministerios</h1>
            <p className="text-gray-400 text-[0.95rem]">Explora los diferentes ministerios y áreas de servicio de la iglesia.</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2" id="new-ministry-btn" onClick={() => setShowForm(true)}>
            <span>➕</span> Crear Ministerio
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ministerios.map((min) => (
              <StaggerItem key={min.id} className="bg-[#1a1c25] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
                <div className="p-6 border-b border-white/5 flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                    style={{
                      backgroundColor: `${min.color}20`,
                      color: min.color,
                    }}
                  >
                    {/* Renderizamos el emoji o texto corto */}
                    {min.icono === 'church' ? '⛪' : min.icono}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="font-display text-xl font-bold text-gray-100 leading-tight mb-1">{min.nombre}</div>
                    {!min.activo && <span className="inline-block bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md text-[0.65rem] font-bold tracking-wider uppercase mt-1">Inactivo</span>}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{min.descripcion || 'Sin descripción.'}</p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <div className="bg-[#14161f] rounded-xl p-3 border border-white/5 text-center">
                      <div className="text-2xl font-display font-bold text-gray-200 mb-1">{min.miembrosIds?.length || 0}</div>
                      <div className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">Miembros</div>
                    </div>
                    <div className="bg-[#14161f] rounded-xl p-3 border border-white/5 text-center">
                      <div className="text-2xl font-display font-bold text-amber-500 mb-1">{(min as any).lideres?.length || 0}</div>
                      <div className="text-[0.65rem] font-bold text-amber-500/70 uppercase tracking-wider">Líderes</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
            
            {ministerios.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
                <div className="text-4xl mb-4 opacity-50">⛪</div>
                <div className="font-display text-xl font-semibold mb-2 text-gray-400">Sin ministerios</div>
                <div className="text-sm text-center">No hay ministerios registrados aún.</div>
              </div>
            )}
          </StaggerContainer>
        )}

        {/* Sidebar Crear Ministerio */}
        {showForm && (
          <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowForm(false)} duration={0.2}>
            <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-display text-xl font-bold text-gray-100">Nuevo Ministerio</h3>
                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="mb-5">
                    <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Nombre del Ministerio</label>
                    <input 
                      className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" 
                      placeholder="Ej. Alabanza" 
                      required 
                      value={formData.nombre} 
                      onChange={e => setFormData({...formData, nombre: e.target.value})} 
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Descripción</label>
                    <textarea 
                      className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y" 
                      placeholder="Describe la función del ministerio..." 
                      rows={4}
                      value={formData.descripcion} 
                      onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Color (Hex)</label>
                      <input 
                        type="color"
                        className="w-full h-[50px] p-1 bg-[#14161f] border border-white/10 rounded-lg cursor-pointer transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" 
                        value={formData.color} 
                        onChange={e => setFormData({...formData, color: e.target.value})} 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Icono (Emoji)</label>
                      <input 
                        className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 h-[50px] outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-xl text-center" 
                        placeholder="Ej. 🎵, 🧒" 
                        value={formData.icono} 
                        onChange={e => setFormData({...formData, icono: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02]">
                  <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed" disabled={submitting}>{submitting ? 'Guardando...' : 'Crear Ministerio'}</button>
                </div>
              </form>
            </ScaleIn>
          </FadeIn>
        )}
      </FadeIn>
    </AppShell>
  );
}
