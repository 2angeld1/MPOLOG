import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nombre: ''
    });
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const { email, password, confirmPassword, nombre } = formData;

        if (!email || !password || !confirmPassword || !nombre) {
            showToast('Por favor completa todos los campos', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'warning');
            return;
        }

        if (password.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            showToast('Usuario registrado correctamente. Ahora puedes iniciar sesión.', 'success');
            setTimeout(() => history.push('/login'), 3000);
        } catch (error: any) {
            showToast(error.message || 'Error al registrar usuario', 'danger');
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estados
        formData,
        loading,
        history,
        // Funciones
        handleInputChange,
        handleRegister,
    };
};