'use client';

import { useState, useEffect } from 'react';
import AppShell, { useAppContext } from '@/components/AppShell';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/animations';

interface ISolicitud {
  _id: string;
  lider: { nombre: string; email: string };
  descripcionEquipo: string;
  fotoEstadoActual?: string;
  fechaSalida: string;
  fechaEstimadaRegreso: string;
  estado: 'Solicitado' | 'Retirado' | 'Disponible';
  observacionesRetorno?: string;
  createdAt: string;
}

export default function SolicitudesPage() {
  const { user } = useAppContext();
  const [solicitudes, setSolicitudes] = useState<ISolicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ descripcionEquipo: '', fechaSalida: '', fechaEstimadaRegreso: '' });
  const [foto, setFoto] = useState<File | null>(null);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [devolviendoId, setDevolviendoId] = useState<string | null>(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const res = await fetch('/api/solicitudes');
      if (res.ok) {
        const data = await res.json();
        setSolicitudes(data);
      }
    } catch (err) {
      setErrorMsg('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      let fotoEstadoActual = null;
      if (foto) {
        const fileData = new FormData();
        fileData.append('file', foto);
        const res = await fetch('/api/archivos', { method: 'POST', body: fileData });
        if (res.ok) {
          const data = await res.json();
          fotoEstadoActual = data.archivo.url;
        }
      }

      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fotoEstadoActual })
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ descripcionEquipo: '', fechaSalida: '', fechaEstimadaRegreso: '' });
        setFoto(null);
        fetchSolicitudes();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Error al crear');
      }
    } catch {
      setErrorMsg('Error de red');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, action: string, obs?: string) => {
    try {
      const res = await fetch(`/api/solicitudes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, observacionesRetorno: obs })
      });
      if (res.ok) {
        setDevolviendoId(null);
        setObservaciones('');
        fetchSolicitudes();
      } else {
        const data = await res.json();
        alert(data.error || 'Error');
      }
    } catch {
      alert('Error de red');
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Solicitado': return { bg: 'rgba(234, 179, 8, 0.2)', text: '#eab308' };
      case 'Retirado': return { bg: 'rgba(168, 85, 247, 0.2)', text: '#a855f7' };
      case 'Disponible': return { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', text: 'white' };
    }
  };

  const safeRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const canRequest = safeRoles.includes('lideres') || safeRoles.includes('admin') || safeRoles.includes('superadmin') || safeRoles.includes('pastor');

  return (
    <AppShell>
      <FadeIn>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Solicitar y Devolver</h1>
            <p className="text-gray-400 text-[0.95rem]">Gestión de préstamos de recursos y equipos de la iglesia.</p>
          </div>
          {canRequest && (
            <button className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2 shrink-0" onClick={() => setShowForm(true)}>
              <span>📦</span> Nueva Solicitud
            </button>
          )}
        </div>

        {errorMsg && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"><span className="text-xl">⚠️</span> {errorMsg}</div>}

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <StaggerContainer className="flex flex-col gap-4">
            {solicitudes.map(s => {
              const colors = getStatusColor(s.estado);
              return (
                <StaggerItem key={s._id} className="bg-[#1a1c25] rounded-2xl border border-white/10 p-6 flex flex-col gap-4 transition-all duration-300 hover:border-white/20 hover:shadow-xl group">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="font-display text-xl font-bold text-gray-100 group-hover:text-amber-400 transition-colors">{s.descripcionEquipo}</div>
                    <span className="px-3 py-1 rounded-full text-[0.75rem] font-bold tracking-wider uppercase" style={{ background: colors.bg, color: colors.text }}>
                      {s.estado}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-[0.85rem] text-gray-400 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="opacity-70">👤</span> <span className="font-semibold text-gray-500 uppercase tracking-wider text-[0.7rem]">Líder:</span> <span className="text-gray-200 font-medium">{s.lider?.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-70">📅</span> <span className="font-semibold text-gray-500 uppercase tracking-wider text-[0.7rem]">Salida:</span> <span className="text-gray-200 font-medium">{new Date(s.fechaSalida).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-70">📅</span> <span className="font-semibold text-gray-500 uppercase tracking-wider text-[0.7rem]">Regreso:</span> <span className="text-gray-200 font-medium">{new Date(s.fechaEstimadaRegreso).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {s.fotoEstadoActual && (
                    <div className="mt-2">
                      <div className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-wider mb-2">Estado Actual</div>
                      <img 
                        src={s.fotoEstadoActual} 
                        alt="Estado Actual" 
                        className="w-full max-w-sm h-48 object-cover rounded-xl border border-white/10"
                      />
                    </div>
                  )}

                  {s.observacionesRetorno && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mt-2 flex items-start gap-2">
                      <span className="text-lg">✅</span>
                      <div>
                        <strong className="block text-[0.7rem] uppercase tracking-wider mb-0.5 opacity-80">Observaciones (Devolución)</strong> 
                        {s.observacionesRetorno}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                    {s.estado === 'Solicitado' && canRequest && (
                      <button className="px-4 py-2 rounded-lg font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-colors flex items-center gap-2 text-sm" onClick={() => updateStatus(s._id, 'retirar')}>
                        <span>📤</span> Marcar como Retirado
                      </button>
                    )}
                    {s.estado === 'Retirado' && devolviendoId !== s._id && canRequest && (
                      <button className="px-4 py-2 rounded-lg font-semibold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors flex items-center gap-2 text-sm" onClick={() => setDevolviendoId(s._id)}>
                        <span>📥</span> Devolver (Check-out)
                      </button>
                    )}
                    {devolviendoId === s._id && (
                      <div className="flex gap-2 w-full items-center flex-wrap bg-[#14161f] p-3 rounded-xl border border-white/5">
                        <input 
                          type="text" 
                          className="flex-1 min-w-[250px] bg-[#1a1c25] border border-white/10 text-white rounded-lg px-4 py-2 outline-none transition-all focus:border-green-500 focus:ring-1 focus:ring-green-500/50 text-sm" 
                          placeholder="Observaciones al entregar (ej. todo bien)" 
                          value={observaciones}
                          onChange={(e) => setObservaciones(e.target.value)}
                        />
                        <button className="px-4 py-2 rounded-lg font-bold text-gray-900 bg-green-500 hover:bg-green-400 transition-colors text-sm" onClick={() => updateStatus(s._id, 'devolver', observaciones)}>
                          Confirmar Disponibilidad
                        </button>
                        <button className="px-4 py-2 rounded-lg font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm border border-transparent hover:border-white/10" onClick={() => setDevolviendoId(null)}>
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              );
            })}

            {solicitudes.length === 0 && (
               <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
                 <div className="text-4xl mb-4 opacity-50">📦</div>
                 <div className="font-display text-xl font-semibold mb-2 text-gray-400">Sin solicitudes</div>
                 <div className="text-sm text-center">No hay solicitudes de recursos registradas.</div>
               </div>
            )}
          </StaggerContainer>
        )}

        {showForm && (
          <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowForm(false)} duration={0.2}>
            <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
                <h3 className="font-display text-xl font-bold text-gray-100">Solicitar Recursos</h3>
                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleCreate} className="flex flex-col overflow-hidden">
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="mb-5">
                    <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">¿Qué solicitas o qué cantidad?</label>
                    <textarea
                      className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y"
                      placeholder="Ej: 2 micrófonos, 1 corneta activa..."
                      value={formData.descripcionEquipo}
                      onChange={(e) => setFormData({ ...formData, descripcionEquipo: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">Foto del Estado Actual (Opcional)</label>
                    <div className="w-full bg-[#14161f] border border-white/10 border-dashed rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
                      />
                      <div className="text-gray-400 text-sm font-medium">
                        {foto ? (
                          <div className="flex items-center justify-center gap-2 text-amber-500">
                            <span className="text-xl">🖼️</span> {foto.name}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl mb-1">📸</span> Haz clic para subir imagen
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">¿Cuándo lo necesitas?</label>
                      <input
                        type="date"
                        className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                        value={formData.fechaSalida}
                        onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[0.8rem] font-semibold text-gray-400 mb-2 uppercase tracking-wider">¿Cuándo lo devuelves?</label>
                      <input
                        type="date"
                        className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                        value={formData.fechaEstimadaRegreso}
                        onChange={(e) => setFormData({ ...formData, fechaEstimadaRegreso: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02] shrink-0">
                  <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed min-w-[170px] flex justify-center" disabled={submitting}>
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                    ) : 'Guardar Solicitud'}
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
