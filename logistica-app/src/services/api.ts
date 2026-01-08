import axios from 'axios';
import { Ubicacion } from '../../types/types';

// Obtener la URL de la API desde variables de entorno
const API_MODE = import.meta.env.VITE_API_MODE || 'local';
const API_URL = import.meta.env.VITE_API_URL || (API_MODE === 'remote' ? 'https://mpolog.onrender.com/api' : 'http://localhost:5000/api');

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a todas las peticiones y loguear requests
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.warn('[API] request - error reading token', err);
        }
        return config;
    },
    (error) => {
        console.error('[API] request error', error);
        return Promise.reject(error);
    }
);

// Interceptor para loguear responses y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url;

        // Si hay error 401 (no autorizado), hacer logout automático
        if (status === 401) {
            console.log('[API] Token inválido o expirado, haciendo logout automático');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Recargar la página para resetear el estado de la aplicación
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Servicios de autenticación
export const authService = {
    login: async (email: string, password: string) => { // Cambia username por email
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, password: string) => {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    },

    register: async (userData: { username: string; email: string; password: string; nombre: string; rol?: string }) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
};

// Servicios de conteo
export const conteoService = {
    crear: async (data: {
        fecha: string;
        iglesia: string; // Nuevo campo
        tipo: 'personas' | 'materiales';
        area: string;
        cantidad: number;
        subArea?: string;
        observaciones?: string;
    }) => {
        const response = await api.post('/conteo', data);
        return response.data;
    },

    obtener: async (fecha?: string, iglesia?: string, tipo?: 'personas' | 'materiales', area?: string, groupByArea?: string) => { // Agrega iglesia y groupByArea
        const params = new URLSearchParams();
        if (fecha) params.append('fecha', fecha);
        if (iglesia) params.append('iglesia', iglesia);
        if (tipo) params.append('tipo', tipo);
        if (area) params.append('area', area);
        if (groupByArea) params.append('groupByArea', groupByArea);

        const url = `/conteo?${params.toString()}`;
        const response = await api.get(url);
        return response.data;
    },

    actualizar: async (id: string, data: {
        fecha: string;
        iglesia: string;
        tipo: 'personas' | 'materiales';
        area: string;
        cantidad: number;
        subArea?: string;
        observaciones?: string;
    }) => {
        const response = await api.put(`/conteo/${id}`, data);
        return response.data;
    },

    eliminar: async (id: string) => {
        const response = await api.delete(`/conteo/${id}`);
        return response.data;
    },

    obtenerEstadisticas: async (fechaInicio?: string, fechaFin?: string, tipo?: 'personas' | 'materiales') => { // Agrega tipo opcional
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        if (tipo) params.append('tipo', tipo); // Agrega filtro por tipo

        const url = `/conteo/estadisticas?${params.toString()}`;
        const response = await api.get(url);
        return response.data;
    },

    obtenerAreas: async (tipo?: 'personas' | 'materiales') => {
        const params = tipo ? { tipo } : {};
        const response = await api.get('/conteo/areas', { params });
        return response.data;
    },

    obtenerIglesias: async () => {
        const response = await api.get('/conteo/iglesias');
        return response.data;
    },
};

// Servicios de eventos
export const eventoService = {
    // Eventos
    crearEvento: async (data: {
        nombre: string;
        tipo?: 'campamento' | 'retiro' | 'conferencia' | 'otro';
        fechaInicio: string;
        fechaFin: string;
        precioTotal: number;
        descripcion?: string;
        ubicacion?: {
            lat: number;
            lng: number;
            nombreLugar: string;
        };
    }) => {
        const response = await api.post('/eventos', data);
        return response.data;
    },

    actualizarEvento: async (id: string, data: Partial<{
        nombre: string;
        tipo: 'campamento' | 'retiro' | 'conferencia' | 'otro';
        fechaInicio: string;
        fechaFin: string;
        precioTotal: number;
        descripcion: string;
        ubicacion: Ubicacion;
        activo: boolean;
    }>) => {
        const response = await api.put(`/eventos/${id}`, data);
        return response.data;
    },

    obtenerEventos: async (activo?: boolean, tipo?: string) => {
        const params = new URLSearchParams();
        if (activo !== undefined) params.append('activo', String(activo));
        if (tipo) params.append('tipo', tipo);
        const response = await api.get(`/eventos?${params.toString()}`);
        return response.data;
    },

    obtenerEventoPorId: async (id: string) => {
        const response = await api.get(`/eventos/${id}`);
        return response.data;
    },

    eliminarEvento: async (id: string) => {
        const response = await api.delete(`/eventos/${id}`);
        return response.data;
    },

    // Personas en eventos
    registrarPersona: async (eventoId: string, data: {
        nombre: string;
        apellido: string;
        edad: number;
        abono: boolean;
        montoAbono?: number;
        equipo?: string;
    }) => {
        const response = await api.post(`/eventos/${eventoId}/personas`, data);
        return response.data;
    },

    obtenerPersonas: async (eventoId: string, busqueda?: string, equipo?: string) => {
        const params = new URLSearchParams();
        if (busqueda) params.append('busqueda', busqueda);
        if (equipo) params.append('equipo', equipo);
        const response = await api.get(`/eventos/${eventoId}/personas?${params.toString()}`);
        return response.data;
    },

    actualizarPersona: async (eventoId: string, personaId: string, data: {
        nombre: string;
        apellido: string;
        edad: number;
        abono: boolean;
        montoAbono?: number;
        equipo?: string;
    }) => {
        const response = await api.put(`/eventos/${eventoId}/personas/${personaId}`, data);
        return response.data;
    },

    eliminarPersona: async (eventoId: string, personaId: string) => {
        const response = await api.delete(`/eventos/${eventoId}/personas/${personaId}`);
        return response.data;
    },

    obtenerEstadisticas: async (eventoId: string) => {
        const response = await api.get(`/eventos/${eventoId}/estadisticas`);
        return response.data;
    },
};

// Servicios de usuarios (Superadmin)
export const userService = {
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    updateUserRole: async (id: string, rol: string) => {
        const response = await api.put(`/users/${id}/role`, { rol });
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

// Servicios de roles (Superadmin)
export const roleService = {
    getRoles: async () => {
        const response = await api.get('/roles');
        return response.data;
    },

    createRole: async (data: { name: string; description: string; permissions?: string[] }) => {
        const response = await api.post('/roles', data);
        return response.data;
    },

    updateRole: async (id: string, data: { name?: string; description?: string; permissions?: string[] }) => {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },

    deleteRole: async (id: string) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    }
};

export default api;
