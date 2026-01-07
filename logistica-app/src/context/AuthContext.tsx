import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Cambia useNavigate por useHistory (v5)
import { authService } from '../services/api';
import { User, AuthContextType } from '../../types/types'; // Cambia la ruta al archivo central

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => { },
    logout: () => { },
    isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // Agrega para temporizador
    const history = useHistory(); // Cambia navigate por history

    // Función para iniciar temporizador de inactividad
    const startInactivityTimer = () => {
        if (timeoutId) clearTimeout(timeoutId);
        const id = setTimeout(() => {
            console.log('[AUTH] Sesión expirada por inactividad');
            logout(); // Logout automático
        }, 28800000); // 8 horas
        setTimeoutId(id);
    };

    // Función para resetear temporizador
    const resetInactivityTimer = () => {
        if (!!token) { // Solo si autenticado
            startInactivityTimer();
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = authService.getCurrentUser();
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
            startInactivityTimer(); // Inicia temporizador si restaura sesión
        }
    }, []);

    // useEffect para eventos de actividad (solo si autenticado)
    useEffect(() => {
        if (!token) return; // Solo si hay token

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        const handleActivity = () => resetInactivityTimer();

        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [token]); // Dependencia en token

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);

            if (!response.token || !response.user) {
                throw new Error('Respuesta del servidor incompleta');
            }

            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            startInactivityTimer(); // Inicia temporizador al loguear
            history.push('/tabs');
        } catch (error: any) {
            console.log('❌ Error en login:', error);
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    const logout = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        authService.logout();
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        history.push('/login'); // Cambia navigate por history.push
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};