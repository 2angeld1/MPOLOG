import {
  FaChurch,
  FaMusic,
  FaChild,
  FaPeopleCarry,
  FaBookOpen,
  FaHandshake,
  FaShieldAlt,
  FaMicrophone,
  FaHeart,
  FaDove,
  FaClipboardList,
  FaBroom,
  FaCar,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

// Map de nombres a componentes de icono
export const iconMap: Record<string, IconType> = {
  church: FaChurch,
  music: FaMusic,
  child: FaChild,
  youth: FaPeopleCarry,
  book: FaBookOpen,
  handshake: FaHandshake,
  shield: FaShieldAlt,
  mic: FaMicrophone,
  heart: FaHeart,
  dove: FaDove,
  clipboard: FaClipboardList,
  broom: FaBroom,
  car: FaCar,
};

// Opciones para el selector de iconos en formularios
export const iconOptions = [
  { value: 'church', label: 'Iglesia / General', Icon: FaChurch },
  { value: 'music', label: 'Alabanza / Música', Icon: FaMusic },
  { value: 'child', label: 'Niños / Infantil', Icon: FaChild },
  { value: 'youth', label: 'Jóvenes', Icon: FaPeopleCarry },
  { value: 'book', label: 'Enseñanza', Icon: FaBookOpen },
  { value: 'handshake', label: 'Ujieres / Bienvenida', Icon: FaHandshake },
  { value: 'shield', label: 'Seguridad', Icon: FaShieldAlt },
  { value: 'mic', label: 'Comunicaciones', Icon: FaMicrophone },
  { value: 'heart', label: 'Misericordia', Icon: FaHeart },
  { value: 'dove', label: 'Intercesión / Oración', Icon: FaDove },
  { value: 'clipboard', label: 'Logística', Icon: FaClipboardList },
  { value: 'broom', label: 'Limpieza', Icon: FaBroom },
  { value: 'car', label: 'Estacionamiento', Icon: FaCar },
];

// Obtener el componente de icono para un ministerio
export function getMinisterioIcon(icono: string): IconType {
  return iconMap[icono] || FaChurch;
}
