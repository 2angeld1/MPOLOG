import axios from 'axios';

const API_URL = 'https://mpolog.onrender.com/api';

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
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
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
};

// Servicios de conteo
export const conteoService = {
    crear: async (data: { fecha: string; area: string; cantidad: number; observaciones?: string }) => {
        const response = await api.post('/conteo', data);
        return response.data;
    },

    obtener: async (fecha?: string, area?: string) => {
        const params = new URLSearchParams();
        if (fecha) params.append('fecha', fecha);
        if (area) params.append('area', area);

        const response = await api.get(`/conteo?${params.toString()}`);
        return response.data;
    },

    eliminar: async (id: string) => {
        const response = await api.delete(`/conteo/${id}`);
        return response.data;
    },

    obtenerEstadisticas: async (fechaInicio?: string, fechaFin?: string) => {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);

        const response = await api.get(`/conteo/estadisticas?${params.toString()}`);
        return response.data;
    },

    obtenerAreas: async () => {
        const response = await api.get('/conteo/areas');
        return response.data;
    },
};

export default api;