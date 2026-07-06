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
  FaFire,
  FaHome,
  FaLightbulb,
  FaCoffee,
  FaUserTie,
  FaPray,
  FaCrown,
  FaUserClock,
  FaCamera,
  FaVideo,
  FaCompass,
  FaMapSigns,
  FaGuitar,
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
  // Nuevos iconos
  fire: FaFire,
  home: FaHome,
  lightbulb: FaLightbulb,
  coffee: FaCoffee,
  tie: FaUserTie,
  pray: FaPray,
  crown: FaCrown,
  clock: FaUserClock,
  camera: FaCamera,
  video: FaVideo,
  compass: FaCompass,
  mapsigns: FaMapSigns,
  guitar: FaGuitar,
};

// Opciones para el selector de iconos en formularios
export const iconOptions = [
  { value: 'church', label: 'Iglesia / General', Icon: FaChurch },
  { value: 'music', label: 'Alabanza / Música', Icon: FaMusic },
  { value: 'child', label: 'Génesis / Niños', Icon: FaChild },
  { value: 'fire', label: 'JEF / Jóvenes', Icon: FaFire },
  { value: 'home', label: 'Casa de Luz', Icon: FaHome },
  { value: 'coffee', label: 'Cafetería', Icon: FaCoffee },
  { value: 'shield', label: 'Seguridad', Icon: FaShieldAlt },
  { value: 'tie', label: 'Protocolo', Icon: FaUserTie },
  { value: 'handshake', label: 'Bienvenida / Ujieres', Icon: FaHandshake },
  { value: 'pray', label: 'Intercesión', Icon: FaPray },
  { value: 'crown', label: 'Edad Dorada', Icon: FaCrown },
  { value: 'video', label: 'Media / Comunicaciones', Icon: FaVideo },
  { value: 'compass', label: 'Exploradores del Rey', Icon: FaCompass },
  
  // Opciones alternativas para subdivisiones
  { value: 'guitar', label: 'Guitarra / Banda', Icon: FaGuitar },
  { value: 'mapsigns', label: 'Pioneros / Rutas', Icon: FaMapSigns },
  { value: 'book', label: 'Enseñanza', Icon: FaBookOpen },
  { value: 'heart', label: 'Misericordia', Icon: FaHeart },
  { value: 'clipboard', label: 'Logística', Icon: FaClipboardList },
  { value: 'broom', label: 'Limpieza', Icon: FaBroom },
  { value: 'car', label: 'Estacionamiento', Icon: FaCar },
];

// Obtener el componente de icono para un ministerio
export function getMinisterioIcon(icono: string): IconType {
  return iconMap[icono] || FaChurch;
}
