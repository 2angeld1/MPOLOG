import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../services/api';

export const useResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        // Obtener token de la URL (ej. /reset-password?token=abc123)
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setToastMessage('Token inválido o expirado');
            setShowToast(true);
        }
    }, [location]);

    const handleResetPassword = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!password || password.trim() === '') {
            setToastMessage('Por favor ingresa una nueva contraseña');
            setShowToast(true);
            return;
        }

        if (password !== confirmPassword) {
            setToastMessage('Las contraseñas no coinciden');
            setShowToast(true);
            return;
        }

        if (password.length < 6) {
            setToastMessage('La contraseña debe tener al menos 6 caracteres');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setToastMessage('Contraseña restablecida correctamente');
            setShowToast(true);
            setTimeout(() => history.push('/login'), 3000);
        } catch (error: any) {
            setToastMessage(error.message || 'Error al restablecer la contraseña');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estados
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        token,
        showToast,
        setShowToast,
        toastMessage,
        loading,
        history,
        // Funciones
        handleResetPassword,
    };
};