'use client';

import { useState, useEffect, useCallback } from 'react';
import AppShell, { useAppContext } from '@/components/AppShell';
import { FadeIn, StaggerContainer, StaggerItem } from '@/animations';
import Modal from '@/components/Modal';
import { FiSearch, FiShield, FiUserPlus } from 'react-icons/fi';
import { getAvatarColor } from '@/lib/utils';

interface IUser {
  _id: string;
  nombre: string;
  email: string;
  rol?: string;
  roles: string[];
  createdAt: string;
  source?: string;
}

interface IMiembroDirectorio {
  _id: string;
  nombre: string;
  telefono: string;
  esServidor: boolean;
  dondeSirve: string | null;
}

const AVAILABLE_ROLES = [
  { id: 'pastor', label: 'Pastor', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'admin', label: 'Admin / Logística', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'lideres', label: 'Líderes', color: 'bg-amber-500/20 text-amber-400' },
  { id: 'servidores', label: 'Servidores', color: 'bg-green-500/20 text-green-400' },
  { id: 'general', label: 'General', color: 'bg-gray-500/20 text-gray-400' },
];

function UsuariosContent() {
  const { user } = useAppContext();
  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estado para modal de "Dar Acceso"
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [miembrosDirectorio, setMiembrosDirectorio] = useState<IMiembroDirectorio[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [selectedMiembro, setSelectedMiembro] = useState<IMiembroDirectorio | null>(null);
  const [accessFormData, setAccessFormData] = useState({ email: '', rol: 'general' });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    try {
      const res = await fetch('/api/usuarios');
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || 'No autorizado');
      }
    } catch (err) {
      setErrorMsg('Error de red al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMiembros = useCallback(async () => {
    try {
      const res = await fetch('/api/miembros');
      if (res.ok) {
        const data = await res.json();
        setMiembrosDirectorio(data.personas || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
    fetchMiembros();
  }, [fetchUsuarios, fetchMiembros]);

  const handleOpenAccessModal = () => {
    setSelectedMiembro(null);
    setAccessFormData({ email: '', rol: 'general' });
    setBusqueda('');
    setErrorMsg('');
    setShowAccessModal(true);
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMiembro) return;
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          miembroDirectorioId: selectedMiembro._id,
          email: accessFormData.email,
          rol: accessFormData.rol
        })
      });

      const data = await res.json();

      if (res.ok) {
        setShowAccessModal(false);
        setSuccessMsg(data.mensaje + ' ' + (data._tempPassMsg || ''));
        fetchUsuarios();
      } else {
        setErrorMsg(data.error || 'Error al dar acceso');
      }
    } catch (err) {
      setErrorMsg('Error de red');
    } finally {
      setSubmitting(false);
    }
  };

  const safeRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const safeEmail = user?.email?.toLowerCase() || '';
  const isSuperAdmin = safeRoles.includes('superadmin') || safeEmail.startsWith('admin@superadmin');

  // Filtrar miembros para el buscador
  const miembrosFiltrados = miembrosDirectorio.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // IDs de miembros que ya tienen acceso al sistema
  const miembrosConAcceso = usuarios
    .filter((u: any) => u.miembroDirectorioId)
    .map((u: any) => u.miembroDirectorioId);

  return (
    <FadeIn>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Usuarios y Roles</h1>
          <p className="text-gray-400 text-[0.95rem] mb-8">Administra los accesos y permisos de la plataforma.</p>
        </div>
        {isSuperAdmin && (
          <button
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2"
            onClick={handleOpenAccessModal}
          >
            <FiUserPlus size={18} /> Dar Acceso
          </button>
        )}
      </div>

      {errorMsg && !showAccessModal && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl mb-4">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-xl mb-4">
          {successMsg}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6">
        <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
          {usuarios.length} usuarios con acceso
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#1a1c25]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="p-4 font-semibold uppercase tracking-wider">Nombre</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Correo</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Rol</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Origen</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => {
                const rawRole = (u.roles && u.roles.length > 0) ? u.roles[0] : (u.rol || 'general');
                const currentRole = rawRole.toLowerCase();
                const roleConfig = AVAILABLE_ROLES.find(r => r.id === currentRole);
                const roleLabel = roleConfig?.label || currentRole;
                const roleColor = roleConfig?.color || 'bg-gray-500/20 text-gray-400';
                const source = (u as any).source;

                return (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: getAvatarColor(u.nombre), color: '#fff' }}
                        >
                          {u.nombre?.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-200">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`${roleColor} px-3 py-1 rounded-full text-xs font-bold tracking-wider`}>
                        {roleLabel.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[0.65rem] font-bold tracking-wider ${source === 'mongo' ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                        {source === 'mongo' ? 'MPOLOG' : 'INTRAMPO'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {usuarios.length === 0 && !errorMsg && (
            <div className="p-12 text-center text-gray-500">No hay usuarios para mostrar.</div>
          )}
        </div>
      )}

      {/* Modal "Dar Acceso" */}
      <Modal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        title="Dar Acceso al Sistema"
        subtitle="Selecciona una persona del directorio"
        maxWidth="max-w-lg"
        footer={
          selectedMiembro ? (
            <div className="flex justify-between items-center">
              <button
                className="text-sm text-gray-400 hover:text-white transition-colors"
                onClick={() => setSelectedMiembro(null)}
              >
                ← Cambiar persona
              </button>
              <div className="flex gap-3">
                <button
                  className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                  onClick={() => setShowAccessModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="access-form"
                  className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'Creando...' : 'Crear y Enviar Correo'}
                </button>
              </div>
            </div>
          ) : undefined
        }
      >
        {!selectedMiembro ? (
          <>
            {/* Paso 1: Buscar y seleccionar persona */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
                  placeholder="Buscar persona del directorio..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="p-2 max-h-[350px] overflow-y-auto">
              {miembrosFiltrados.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No se encontraron miembros.</div>
              ) : (
                <div className="flex flex-col gap-1">
                  {miembrosFiltrados.map((m) => {
                    const yaAcceso = miembrosConAcceso.includes(m._id);
                    return (
                      <button
                        key={m._id}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-colors text-left w-full ${yaAcceso ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}`}
                        onClick={() => !yaAcceso && setSelectedMiembro(m)}
                        disabled={yaAcceso}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: getAvatarColor(m.nombre), color: '#fff' }}
                        >
                          {m.nombre.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-200">{m.nombre}</div>
                          <div className="text-xs text-gray-500">
                            {m.esServidor && m.dondeSirve ? m.dondeSirve : 'Miembro general'}
                          </div>
                        </div>
                        {yaAcceso && (
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-[0.6rem] font-bold tracking-wider flex items-center gap-1">
                            <FiShield size={10} /> YA TIENE ACCESO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Paso 2: Asignar email y rol */}
            <form id="access-form" onSubmit={handleGrantAccess} className="p-6">
              {/* Persona seleccionada */}
              <div className="flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: getAvatarColor(selectedMiembro.nombre), color: '#fff' }}
                >
                  {selectedMiembro.nombre.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-display font-bold text-gray-100">{selectedMiembro.nombre}</div>
                  <div className="text-xs text-gray-500">
                    {selectedMiembro.esServidor && selectedMiembro.dondeSirve ? selectedMiembro.dondeSirve : 'Miembro general'}
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg mb-4 text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="ejemplo@correo.com"
                  required
                  value={accessFormData.email}
                  onChange={e => setAccessFormData({ ...accessFormData, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Rol del Sistema</label>
                <select
                  className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 appearance-none"
                  value={accessFormData.rol}
                  onChange={e => setAccessFormData({ ...accessFormData, rol: e.target.value })}
                >
                  {AVAILABLE_ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                Se le generará una contraseña automáticamente y se le enviará por correo electrónico.
              </div>
            </form>
          </>
        )}
      </Modal>
    </FadeIn>
  );
}

export default function UsuariosPage() {
  return (
    <AppShell>
      <UsuariosContent />
    </AppShell>
  );
}
