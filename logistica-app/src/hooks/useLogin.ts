import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { login } = useAuth();

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!email || !password) {
            setToastMessage('Por favor ingresa email y contraseña');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            // El contexto maneja el toast de éxito y la redirección
        } catch (error: any) {
            setToastMessage(error.message || 'Error al iniciar sesión');
            setShowToast(true);
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
        showToast,
        setShowToast,
        toastMessage,
        loading,
        history,
        // Funciones
        handleLogin,
    };
};