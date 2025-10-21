import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleForgotPassword = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!email || email.trim() === '') {
            setToastMessage('Por favor ingresa tu email');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setToastMessage('Se ha enviado un enlace de recuperación a tu email');
            setShowToast(true);
            setTimeout(() => history.push('/login'), 3000); // Redirigir después de 3 segundos
        } catch (error: any) {
            setToastMessage(error.message || 'Error al enviar el enlace de recuperación');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estados
        email,
        setEmail,
        showToast,
        setShowToast,
        toastMessage,
        loading,
        history,
        // Funciones
        handleForgotPassword,
    };
};