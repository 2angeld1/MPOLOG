'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/animations';

interface Miembro {
  _id: string;
  nombre: string;
  edad: number;
  telefono: string;
  tiempoIglesia: string;
  esServidor: boolean;
  dondeSirve: string | null;
  parentesco: string | null;
  fotoUrl: string | null;
  createdAt: string;
}

interface UserEntry {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  roles: string[];
}

const avatarColors = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(nombre: string): string {
  if (!nombre) return '';
  const parts = nombre.trim().split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1] || '';
  return (first + last).toUpperCase();
}

function isNuevo(createdAt: string) {
  const diffTime = Math.abs(new Date().getTime() - new Date(createdAt).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays <= 30; // 30 días o menos se considera "Nuevo"
}

export default function DirectorioPage() {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState<'personas' | 'usuarios'>('personas');
  const [loading, setLoading] = useState(true);

  // States para Formularios y Modales
  const [showForm, setShowForm] = useState(false);
  const [selectedMiembro, setSelectedMiembro] = useState<Miembro | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    telefono: '',
    tiempoIglesia: 'Menos de 1 año',
    esServidor: false,
    dondeSirve: '',
    parentesco: ''
  });
  const [foto, setFoto] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.set('buscar', busqueda);

      const res = await fetch(`/api/miembros?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMiembros(data.personas || []);
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let fotoUrl = null;
      if (foto) {
        const fData = new FormData();
        fData.append('file', foto);
        const res = await fetch('/api/archivos', { method: 'POST', body: fData });
        if (res.ok) {
          const data = await res.json();
          fotoUrl = data.archivo.url;
        }
      }

      const payload = {
        ...formData,
        fotoUrl
      };

      const res = await fetch('/api/miembros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          nombre: '', edad: '', telefono: '', tiempoIglesia: 'Menos de 1 año',
          esServidor: false, dondeSirve: '', parentesco: ''
        });
        setFoto(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      // Basic CSV parser (skip header)
      const parsedMiembros = lines.slice(1).map(line => {
        const [nombre, edad, telefono, tiempoIglesia, esServidor, dondeSirve, parentesco] = line.split(',');
        return {
          nombre: nombre?.trim(),
          edad: parseInt(edad?.trim(), 10) || 0,
          telefono: telefono?.trim(),
          tiempoIglesia: tiempoIglesia?.trim() || 'Menos de 1 año',
          esServidor: esServidor?.trim().toLowerCase() === 'true' || esServidor?.trim().toLowerCase() === 'si',
          dondeSirve: dondeSirve?.trim() || '',
          parentesco: parentesco?.trim() || ''
        };
      }).filter(m => m.nombre);

      if (parsedMiembros.length === 0) return alert('El CSV está vacío o inválido');

      try {
        const res = await fetch('/api/miembros/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ miembros: parsedMiembros })
        });
        if (res.ok) {
          alert('Miembros importados correctamente');
          fetchData();
        } else {
          alert('Error importando CSV');
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  return (
    <AppShell>
      <FadeIn>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Directorio de Miembros</h1>
            <p className="text-gray-400 text-[0.95rem]">Encuentra y administra los miembros de la congregación.</p>
          </div>
          {vista === 'personas' && (
            <div className="flex gap-2">
              <input type="file" accept=".csv" ref={csvInputRef} className="hidden" onChange={handleCsvImport} />
              <button className="px-4 py-2 rounded-lg font-semibold bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10 flex items-center gap-2" onClick={() => csvInputRef.current?.click()}>
                <span>📄</span> Importar CSV
              </button>
              <button className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 flex items-center gap-2" onClick={() => setShowForm(true)}>
                <span>➕</span> Agregar Miembro
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 bg-[#1a1c25] rounded-xl border border-white/10 shadow-sm">
          <div className="relative flex-1 w-full max-w-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="w-full bg-[#14161f] border border-white/10 text-white rounded-full py-2.5 pr-4 pl-10 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="sm:ml-auto flex gap-2">
            <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${vista === 'personas' ? 'bg-amber-500 text-gray-900' : 'bg-[#14161f] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'}`} onClick={() => setVista('personas')}>
              👤 Miembros
            </button>
            <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${vista === 'usuarios' ? 'bg-amber-500 text-gray-900' : 'bg-[#14161f] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'}`} onClick={() => setVista('usuarios')}>
              🔐 Usuarios Sistema
            </button>
          </div>
        </div>

        {/* Summary badge */}
        <div className="mb-8">
          <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
            {vista === 'personas' ? miembros.length : users.length} registros
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : vista === 'personas' ? (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {miembros.map((miembro) => {
              const nuevo = isNuevo(miembro.createdAt);
              return (
                <StaggerItem key={miembro._id} className={`bg-[#1a1c25] rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center ${nuevo ? 'border-amber-500 shadow-amber-500/10' : 'border-white/10 hover:border-white/20'}`} onClick={() => setSelectedMiembro(miembro)}>
                  <div
                    className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold shadow-md"
                    style={{ background: miembro.fotoUrl ? `url(${miembro.fotoUrl}) center/cover` : getAvatarColor(miembro.nombre), color: '#fff' }}
                  >
                    {!miembro.fotoUrl && getInitials(miembro.nombre)}
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-semibold text-gray-100">{miembro.nombre}</h3>
                      {nuevo && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wider">NUEVO</span>}
                    </div>
                    <div className="mb-3">
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-[0.7rem] font-semibold">{miembro.tiempoIglesia} en la iglesia</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-auto">
                      📱 {miembro.telefono}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
            {miembros.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
                <div className="text-4xl mb-4">👥</div>
                <div className="font-display text-xl font-semibold mb-2">Directorio Vacío</div>
                <div className="text-sm text-center">No hay miembros registrados aún. Puedes agregar uno o importar un archivo CSV.</div>
              </div>
            )}
          </StaggerContainer>
        ) : (
          <div className="overflow-x-auto bg-[#1a1c25] rounded-2xl border border-white/10 shadow-xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="p-4 font-semibold uppercase tracking-wider">Nombre</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Email</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Roles</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: getAvatarColor(user.nombre), color: '#fff' }}
                        >
                          {user.nombre?.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-200">{user.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {(user.roles || [user.rol]).map((r, i) => (
                          <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-[0.7rem] font-bold tracking-wider uppercase">{r}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal/Sidebar Crear Miembro */}
        {showForm && (
          <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowForm(false)} duration={0.2}>
            <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <h3 className="font-display text-xl font-bold text-gray-100">Registrar Nuevo Miembro</h3>
                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                <div className="p-6 overflow-y-auto">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Nombre Completo</label>
                    <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Edad</label>
                      <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" type="number" required value={formData.edad} onChange={e => setFormData({...formData, edad: e.target.value})} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Teléfono</label>
                      <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Tiempo en la iglesia</label>
                    <select className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none" value={formData.tiempoIglesia} onChange={e => setFormData({...formData, tiempoIglesia: e.target.value})}>
                      <option value="Menos de 1 año">Menos de 1 año</option>
                      <option value="1 a 3 años">1 a 3 años</option>
                      <option value="3 a 5 años">3 a 5 años</option>
                      <option value="Más de 5 años">Más de 5 años</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 border border-white/5 rounded-lg">
                    <input type="checkbox" id="esServidor" checked={formData.esServidor} onChange={e => setFormData({...formData, esServidor: e.target.checked})} className="w-5 h-5 accent-amber-500 rounded bg-[#14161f] border-white/20" />
                    <label htmlFor="esServidor" className="text-sm font-medium text-gray-200 cursor-pointer">¿Es Servidor/Voluntario?</label>
                  </div>
                  {formData.esServidor && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">¿En qué área sirve?</label>
                      <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" value={formData.dondeSirve} onChange={e => setFormData({...formData, dondeSirve: e.target.value})} placeholder="Ej. Ujieres, Alabanza..." />
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Familia / Parentesco (Opcional)</label>
                    <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" value={formData.parentesco} onChange={e => setFormData({...formData, parentesco: e.target.value})} placeholder="Ej. Esposo de María, asiste con 2 hijos" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Foto de perfil (Opcional)</label>
                    <input type="file" accept="image/*" className="w-full bg-[#14161f] border border-white/10 text-gray-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 transition-colors" onChange={e => setFoto(e.target.files ? e.target.files[0] : null)} />
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02] shrink-0">
                  <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            </ScaleIn>
          </FadeIn>
        )}

        {/* Modal/Sidebar Detalle Miembro */}
        {selectedMiembro && (
          <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setSelectedMiembro(null)} duration={0.2}>
            <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
              <div className="p-4 flex justify-end">
                <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setSelectedMiembro(null)}>✕</button>
              </div>
              <div className="px-8 pb-8 flex flex-col items-center">
                <div
                  className="w-28 h-28 rounded-full mb-4 flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-[#1a1c25]"
                  style={{ background: selectedMiembro.fotoUrl ? `url(${selectedMiembro.fotoUrl}) center/cover` : getAvatarColor(selectedMiembro.nombre), color: '#fff', transform: 'translateY(-10px)' }}
                >
                  {!selectedMiembro.fotoUrl && getInitials(selectedMiembro.nombre)}
                </div>
                <div className="text-center w-full">
                  <h2 className="font-display text-2xl font-bold text-gray-100 mb-3">{selectedMiembro.nombre}</h2>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{selectedMiembro.edad} años</span>
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{selectedMiembro.tiempoIglesia}</span>
                    {isNuevo(selectedMiembro.createdAt) && <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">NUEVO</span>}
                  </div>
                </div>

                <div className="w-full bg-white/5 border border-white/5 rounded-xl p-5 mt-2 flex flex-col gap-4 text-left">
                  <div>
                    <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Teléfono</div>
                    <div className="text-gray-200 font-medium">{selectedMiembro.telefono}</div>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Familia / Parentesco</div>
                    <div className="text-gray-200 font-medium">{selectedMiembro.parentesco || 'No especificado'}</div>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-gray-500 uppercase tracking-widest font-semibold mb-1">Servicio</div>
                    <div className="text-gray-200 font-medium flex items-center gap-2">
                      {selectedMiembro.esServidor ? (
                        <><span className="text-green-500">●</span> Sirve en: {selectedMiembro.dondeSirve || 'Área no especificada'}</>
                      ) : (
                        <><span className="text-gray-600">○</span> No es servidor</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScaleIn>
          </FadeIn>
        )}

      </FadeIn>
    </AppShell>
  );
}
