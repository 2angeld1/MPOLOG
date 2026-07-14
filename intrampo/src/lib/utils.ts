import type { IEvento } from '@/types';

export type TipoEvento = IEvento['tipo'];

export const EVENT_TYPES: { value: TipoEvento; label: string }[] = [
  { value: 'culto', label: 'Culto' },
  { value: 'reunion', label: 'Reunión' },
  { value: 'retiro', label: 'Retiro' },
  { value: 'campamento', label: 'Campamento' },
  { value: 'conferencia', label: 'Conferencia' },
  { value: 'ayuno', label: 'Ayuno' },
  { value: 'vigilia', label: 'Vigilia' },
  { value: 'evangelismo', label: 'Evangelismo' },
  { value: 'convencion', label: 'Convención' },
  { value: 'asignacion', label: 'Asignación' },
  { value: 'otro', label: 'Otro' },
];

export const EVENT_TYPE_COLORS: Record<string, string> = {
  culto: '#7c3aed',
  retiro: '#06b6d4',
  campamento: '#22c55e',
  conferencia: '#3b82f6',
  reunion: '#d4a843',
  ayuno: '#a855f7',
  vigilia: '#6366f1',
  evangelismo: '#f97316',
  convencion: '#ec4899',
  asignacion: '#d4a843',
  otro: '#64748b',
};

export const DEPARTMENTS = [
  'General', 'Alabanza', 'Jóvenes', 'JEF Teen', 'Kids',
  'Mentor Club', 'Damas', 'Caballeros', 'Ujieres', 'Multimedia',
  'Intercesor', 'Misiones', 'Pastoral',
];

export const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const DAYS_LONG = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Utilidades compartidas para avatares y formato de datos

export const avatarColors = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function getInitials(nombre: string): string {
  if (!nombre) return '';
  const parts = nombre.trim().split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1] || '';
  return (first + last).toUpperCase();
}

export function isNuevo(createdAt: string): boolean {
  const diffTime = Math.abs(new Date().getTime() - new Date(createdAt).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
}

export function formatEventType(tipo: string): string {
  return EVENT_TYPES.find((t: any) => t.value === tipo)?.label || tipo;
}

export function formatTime(time?: string): string {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

