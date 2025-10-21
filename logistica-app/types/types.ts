export interface RegistroCardProps {
    fecha: string;
    iglesia: string;
    area: string;
    subArea?: string; // Nuevo prop opcional
    tipo?: 'personas' | 'materiales'; // Nuevo prop para saber el tipo
    cantidad: number;
    onDelete?: () => void;
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