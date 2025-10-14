import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Cambia useNavigate por useHistory (v5)
import { authService } from '../services/api';

interface User {
    id: string;
    email: string; // Cambia username por email
    nombre: string;
    rol: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>; // Cambia username por email
    logout: () => void;
    isAuthenticated: boolean;
}

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
    const history = useHistory(); // Cambia navigate por history

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = authService.getCurrentUser();

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('🔐 Intentando login con:', email);
            const response = await authService.login(email, password);
            console.log('✅ Login exitoso, response:', response);

            if (!response.token || !response.user) {
                throw new Error('Respuesta del servidor incompleta');
            }

            setToken(response.token);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log('🚀 Redirigiendo a /tabs');
            history.push('/tabs');
        } catch (error: any) {
            console.log('❌ Error en login:', error);
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    const logout = () => {
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