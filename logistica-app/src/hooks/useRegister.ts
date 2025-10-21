import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nombre: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const { email, password, confirmPassword, nombre } = formData;

        if (!email || !password || !confirmPassword || !nombre) {
            setToastMessage('Por favor completa todos los campos');
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
            await api.post('/auth/register', formData);
            setToastMessage('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
            setShowToast(true);
            setTimeout(() => history.push('/login'), 3000);
        } catch (error: any) {
            setToastMessage(error.message || 'Error al registrar usuario');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estados
        formData,
        showToast,
        setShowToast,
        toastMessage,
        loading,
        history,
        // Funciones
        handleInputChange,
        handleRegister,
    };
};