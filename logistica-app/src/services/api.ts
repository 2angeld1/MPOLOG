import axios from 'axios';

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

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
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

    obtener: async (fecha?: string, iglesia?: string, tipo?: 'personas' | 'materiales', area?: string) => { // Agrega iglesia
        const params = new URLSearchParams();
        if (fecha) params.append('fecha', fecha);
        if (iglesia) params.append('iglesia', iglesia);
        if (tipo) params.append('tipo', tipo);
        if (area) params.append('area', area);

        const response = await api.get(`/conteo?${params.toString()}`);
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

        const response = await api.get(`/conteo/estadisticas?${params.toString()}`);
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

export default api;