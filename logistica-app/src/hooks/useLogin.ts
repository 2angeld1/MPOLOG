import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { login } = useAuth();

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!email || !password) {
            showToast('Por favor ingresa email y contraseña', 'warning');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            // El contexto maneja el toast de éxito y la redirección
        } catch (error: any) {
            showToast(error.message || 'Error al iniciar sesión', 'danger');
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estados
        email,
        setEmail,
        password,
        setPassword,
        loading,
        history,
        // Funciones
        handleLogin,
    };
};