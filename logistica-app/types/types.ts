export interface RegistroCardProps {
    fecha: string;
    iglesia: string;
    area: string;
    subArea?: string; // Nuevo prop opcional
    tipo?: 'personas' | 'materiales'; // Nuevo prop para saber el tipo
    cantidad: number;
    onDelete?: () => void;
    onEdit?: (registroId: string) => void;
    registroId?: string;
    index?: number;
}

export interface User {
    id: string;
    email: string; // Cambia username por email
    nombre: string;
    rol: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>; // Cambia username por email
    logout: () => void;
    isAuthenticated: boolean;
}

export interface DataContextType {
    refreshData: () => void;
    refreshKey: number;
    toolbarTitle: string;
    setToolbarTitle: (title: string) => void;
}

export interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

export interface PersonaRegistro {
    _id?: string;
    id: number;
    fecha: string;
    iglesia: string; // Nuevo campo
    cantidad: number;
    area: string;
    subArea?: string; // Agrega subArea como opcional
}

export interface Estadisticas {
    totalRegistros: number;
    totalPersonas: number;
    promedioPersonas: number;
    registrosPorArea: {
        area: string;
        cantidad: number;
        totalPersonas: number;
    }[];
}

export interface Registro {
    _id: string;
    fecha: string;
    iglesia: string; // Nuevo campo
    area: string;
    subArea?: string; // Agrega subArea para materiales
    cantidad: number;
}

export interface Ubicacion {
    lat: number;
    lng: number;
    nombreLugar: string;
}

export interface Evento {
    _id: string;
    nombre: string;
    tipo: 'campamento' | 'retiro' | 'conferencia' | 'otro';
    fechaInicio: string;
    fechaFin: string;
    precioTotal: number;
    activo: boolean;
    descripcion?: string;
    ubicacion?: Ubicacion;
}

export interface EventoPersona {
    _id?: string;
    evento: string;
    nombre: string;
    apellido: string;
    edad: number;
    abono: boolean;
    montoAbono: number;
    equipo?: string;
    createdAt?: string;
}

export interface EventoEstadisticas {
    evento: {
        nombre: string;
        tipo: string;
        precioTotal: number;
    };
    totalPersonas: number;
    personasConAbono: number;
    personasSinAbono: number;
    montoTotalRecaudado: number;
    montoEsperado: number;
    montoPendiente: number;
    estadisticasPorEquipo: {
        equipo: string;
        cantidad: number;
        montoAbonado: number;
    }[];
}