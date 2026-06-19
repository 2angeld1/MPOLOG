'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

interface Persona {
  _id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  edad?: number;
  correo?: string;
  grupo?: string;
  departamento: string;
  foto?: string;
  asistencias: number;
}

interface UserEntry {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  roles: string[];
}

// Colores para avatares basados en nombre
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

function getInitials(nombre: string, apellido?: string): string {
  const first = nombre?.[0] || '';
  const last = apellido?.[0] || nombre?.[1] || '';
  return (first + last).toUpperCase();
}

// Demo data
const demoPersonas: Persona[] = [
  { _id: '1', nombre: 'María', apellido: 'González', telefono: '6000-1234', edad: 28, departamento: 'General', asistencias: 45, correo: 'maria@email.com' },
  { _id: '2', nombre: 'Carlos', apellido: 'Rodríguez', telefono: '6000-5678', edad: 35, departamento: 'Teen', asistencias: 38, grupo: 'Célula Norte' },
  { _id: '3', nombre: 'Ana', apellido: 'Martínez', telefono: '6000-9012', edad: 22, departamento: 'Kids', asistencias: 52, correo: 'ana@email.com' },
  { _id: '4', nombre: 'José', apellido: 'López', telefono: '6000-3456', edad: 41, departamento: 'General', asistencias: 30 },
  { _id: '5', nombre: 'Laura', apellido: 'Pérez', telefono: '6000-7890', edad: 19, departamento: 'Teen', asistencias: 42, grupo: 'Célula Sur' },
  { _id: '6', nombre: 'Daniel', apellido: 'Hernández', telefono: '6000-2345', edad: 33, departamento: 'General', asistencias: 28, correo: 'daniel@email.com' },
  { _id: '7', nombre: 'Sofía', apellido: 'Torres', telefono: '6000-6789', edad: 15, departamento: 'Teen', asistencias: 48 },
  { _id: '8', nombre: 'Miguel', apellido: 'Ramírez', telefono: '6000-0123', edad: 45, departamento: 'General', asistencias: 55 },
  { _id: '9', nombre: 'Isabella', apellido: 'Flores', telefono: '6000-4567', edad: 8, departamento: 'Kids', asistencias: 33 },
  { _id: '10', nombre: 'Andrés', apellido: 'Morales', telefono: '6000-8901', edad: 27, departamento: 'General', asistencias: 20 },
  { _id: '11', nombre: 'Valentina', apellido: 'Castillo', telefono: '6000-2346', edad: 12, departamento: 'Kids', asistencias: 41 },
  { _id: '12', nombre: 'Diego', apellido: 'Vargas', telefono: '6000-6780', edad: 30, departamento: 'General', asistencias: 37 },
];

export default function DirectorioPage() {
  const [personas, setPersonas] = useState<Persona[]>(demoPersonas);
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>(['todos', 'General', 'Teen', 'Kids']);
  const [filtroDepto, setFiltroDepto] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState<'personas' | 'usuarios'>('personas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (filtroDepto !== 'todos') params.set('departamento', filtroDepto);
        if (busqueda) params.set('buscar', busqueda);

        const res = await fetch(`/api/miembros?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (data.personas?.length > 0) setPersonas(data.personas);
          if (data.users?.length > 0) setUsers(data.users);
          if (data.departamentos?.length > 0) {
            setDepartamentos(['todos', ...data.departamentos]);
          }
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filtroDepto, busqueda]);

  const filteredPersonas = personas.filter(p => {
    if (busqueda) {
      const search = busqueda.toLowerCase();
      return p.nombre.toLowerCase().includes(search) || p.apellido.toLowerCase().includes(search);
    }
    return true;
  });

  return (
    <AppShell>
      <div className="animate-fade-in-up">
        <h1 className="page-title">Directorio de Miembros</h1>
        <p className="page-subtitle">Encuentra y conecta con los miembros de la congregación.</p>

        {/* Filters */}
        <div className="filters-bar">
          <div className="header-search" style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-tertiary)' }}>
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ paddingLeft: 36 }}
              id="member-search"
            />
          </div>

          {departamentos.map((d) => (
            <button
              key={d}
              className={`filter-chip ${filtroDepto === d ? 'active' : ''}`}
              onClick={() => setFiltroDepto(d)}
            >
              {d === 'todos' ? 'Todos' : d}
            </button>
          ))}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
            <button
              className={`filter-chip ${vista === 'personas' ? 'active' : ''}`}
              onClick={() => setVista('personas')}
            >
              👤 Personas
            </button>
            <button
              className={`filter-chip ${vista === 'usuarios' ? 'active' : ''}`}
              onClick={() => setVista('usuarios')}
            >
              🔐 Usuarios
            </button>
          </div>
        </div>

        {/* Summary badge */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <span className="badge badge-gold">
            {vista === 'personas' ? filteredPersonas.length : users.length} registros
          </span>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : vista === 'personas' ? (
          <div className="member-grid stagger-children">
            {filteredPersonas.map((persona) => (
              <div key={persona._id} className="member-card">
                <div
                  className="member-avatar"
                  style={{ background: persona.foto ? `url(${persona.foto}) center/cover` : getAvatarColor(persona.nombre + persona.apellido), color: '#fff' }}
                >
                  {!persona.foto && getInitials(persona.nombre, persona.apellido)}
                </div>
                <div className="member-info">
                  <div className="member-name">{persona.nombre} {persona.apellido}</div>
                  <div className="member-dept">
                    <span className="badge badge-purple" style={{ marginRight: 6 }}>{persona.departamento}</span>
                    {persona.grupo && <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{persona.grupo}</span>}
                  </div>
                  <div className="member-contact">
                    📱 {persona.telefono}
                    {persona.correo && <> · ✉️ {persona.correo}</>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {persona.edad && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{persona.edad} años</div>
                  )}
                  <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: 2 }}>
                    {persona.asistencias} asist.
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Roles</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div
                          className="member-avatar"
                          style={{ width: 32, height: 32, fontSize: '0.75rem', background: getAvatarColor(user.nombre), color: '#fff' }}
                        >
                          {user.nombre?.substring(0, 2).toUpperCase()}
                        </div>
                        {user.nombre}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(user.roles || [user.rol]).map((r, i) => (
                          <span key={i} className="badge badge-blue">{r}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3}>
                      <div className="empty-state">
                        <div className="empty-state-icon">🔐</div>
                        <div className="empty-state-title">Sin datos de usuarios</div>
                        <div className="empty-state-text">Conecta MongoDB para ver los usuarios del sistema.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
