'use client';

import { useState, useEffect } from 'react';
import AppShell, { useAppContext } from '@/components/AppShell';
import { FadeIn, ScaleIn } from '@/animations';

interface IUser {
  _id: string;
  nombre: string;
  email: string;
  rol?: string;
  roles: string[];
  createdAt: string;
}

const AVAILABLE_ROLES = [
  { id: 'pastor', label: 'Pastor' },
  { id: 'admin', label: 'Admin / Logística' },
  { id: 'lideres', label: 'Líderes' },
  { id: 'servidores', label: 'Servidores' },
  { id: 'general', label: 'General' },
];

function UsuariosContent() {
  const { user } = useAppContext();
  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State para formulario de creación
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'general'
  });
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsuarios = async () => {
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
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setShowForm(false);
        setFormData({ nombre: '', email: '', rol: 'general' });
        setSuccessMsg(data.mensaje + ' ' + (data._tempPassMsg || ''));
        fetchUsuarios();
      } else {
        setErrorMsg(data.error || 'Error al crear usuario');
      }
    } catch (err) {
      setErrorMsg('Error de red al crear usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const safeRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const safeEmail = user?.email?.toLowerCase() || '';
  // La condición que pediste: si es admin@superadmin.com o tiene el rol
  const isSuperAdmin = safeRoles.includes('superadmin') || safeEmail.startsWith('admin@superadmin');

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
            onClick={() => setShowForm(true)}
          >
            <span>➕</span> Crear Usuario
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl mb-4">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-xl mb-4">
          {successMsg}
        </div>
      )}

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
                <th className="p-4 font-semibold uppercase tracking-wider">Rol Asignado</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => {
                const rawRole = (u.roles && u.roles.length > 0) ? u.roles[0] : (u.rol || 'general');
                const currentRole = rawRole.toLowerCase();
                const roleLabel = AVAILABLE_ROLES.find(r => r.id === currentRole)?.label || currentRole;
                
                return (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-gray-200">{u.nombre}</td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                        {roleLabel.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                        Activo
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

      {/* Formulario Lateral para Crear Usuario */}
      {showForm && (
        <FadeIn className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowForm(false)} duration={0.2}>
          <ScaleIn className="bg-[#1a1c25] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()} duration={0.2}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-gray-100">Crear Nuevo Usuario</h3>
              <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="p-6">
                <div className="mb-6 text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                  Al crear el usuario, se le generará una contraseña automáticamente y se le enviará por correo electrónico (Brevo).
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                    placeholder="Ej. Juan Pérez" 
                    required 
                    value={formData.nombre} 
                    onChange={e => setFormData({...formData, nombre: e.target.value})} 
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Correo Electrónico</label>
                  <input 
                    type="email"
                    className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                    placeholder="ejemplo@correo.com" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Rol del Sistema</label>
                  <select 
                    className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 appearance-none" 
                    value={formData.rol} 
                    onChange={e => setFormData({...formData, rol: e.target.value})}
                  >
                    {AVAILABLE_ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02]">
                <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed" disabled={submitting}>
                  {submitting ? 'Creando...' : 'Crear y Enviar Correo'}
                </button>
              </div>
            </form>
          </ScaleIn>
        </FadeIn>
      )}
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
