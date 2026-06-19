// Types shared across INTRAMPO

// ─── MongoDB Models (from MPOLOG) ───────────────────────────────

export interface IUser {
  _id: string;
  email: string;
  nombre: string;
  rol: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IEvento {
  _id: string;
  nombre: string;
  tipo: 'campamento' | 'retiro' | 'conferencia' | 'asignacion' | 'reunion' | 'ayuno' | 'vigilia' | 'culto' | 'evangelismo' | 'convencion' | 'otro';
  departamento: string;
  color?: string;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  activo: boolean;
  descripcion?: string;
  ubicacion?: {
    lat?: number;
    lng?: number;
    nombreLugar: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IPersonaDetallada {
  _id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  edad?: number;
  escuela?: string;
  tipoSangre?: string;
  nombrePadres?: string;
  correo?: string;
  tallaSueter?: string;
  grupo?: string;
  adultoResponsable?: string;
  direccion?: string;
  alergiasMedicamentos?: string;
  asistencias: string[];
  departamento: string;
  foto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IConteoPersonas {
  _id: string;
  fecha: string;
  iglesia: string;
  tipo: 'personas' | 'materiales';
  area: string;
  cantidad: number;
  observaciones?: string;
  subArea?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEventoPersona {
  _id: string;
  evento: string;
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  abono: boolean;
  montoAbono: number;
  tipoPago: 'efectivo' | 'yappy';
  equipo?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Intranet Types (PostgreSQL) ────────────────────────────────

export interface IComunicado {
  id: string;
  titulo: string;
  contenido: string;
  categoria: 'pastoral' | 'administrativo' | 'evento' | 'urgente' | 'general';
  autorId: string;
  autorNombre: string;
  fijado: boolean;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMinisterio {
  id: string;
  nombre: string;
  descripcion?: string;
  liderIds: string[];
  color: string;
  icono: string;
  miembrosIds: string[];
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISolicitud {
  id: string;
  tipo: 'salon' | 'equipo' | 'consejeria' | 'otro';
  titulo: string;
  descripcion: string;
  solicitanteId: string;
  solicitanteNombre: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  respuesta?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth Types ─────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  email: string;
  nombre: string;
  rol: string;
  roles: string[];
}

export interface SessionData {
  userId: string;
  email: string;
  nombre: string;
  roles: string[];
}

// ─── Dashboard Types ────────────────────────────────────────────

export interface DashboardStats {
  totalMiembros: number;
  eventosActivos: number;
  asistenciaPromedio: number;
  totalMinisterios: number;
}

// ─── Navigation ─────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: string[]; // If empty, visible to all
}
