import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { roleService } from '../services/api';
import { useHistory } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';

export const staticRoles = [
    { name: 'superadmin', description: 'Acceso Total al Sistema' },
    { name: 'logisticadmin', description: 'Logística y Reportes' },
    { name: 'eventsadmin', description: 'Gestión de Eventos' },
    { name: 'sameadmin', description: 'Administrador SAME' },
    { name: 'admin', description: 'Administrador (Legacy)' },
    { name: 'usuario', description: 'Usuario Estándar' }
];

export const useRoleMaintenance = () => {
    const { token, user, logout } = useAuth();
    const { setToolbarTitle } = useData();
    const history = useHistory();
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddAlert, setShowAddAlert] = useState(false);
    const [toastConfig, setToastConfig] = useState<{ isOpen: boolean; message: string; color: string }>({
        isOpen: false,
        message: '',
        color: 'success'
    });
    const [alertInputs, setAlertInputs] = useState<any[]>([]);

    useIonViewWillEnter(() => {
        if (setToolbarTitle) setToolbarTitle('Roles');
    });

    const showToast = (message: string, color: string = 'success') => {
        setToastConfig({
            isOpen: true,
            message,
            color
        });
    };

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const dynamicRoles = await roleService.getRoles();
            setRoles([...staticRoles, ...dynamicRoles]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isSystemRole = (roleName: string) => {
        return staticRoles.some(r => r.name === roleName);
    };

    useEffect(() => {
        setRoles(staticRoles);
        if (token) fetchRoles();
    }, [token]);

    const handleCreateRole = async (data: any) => {
        console.log('[useRoleMaintenance] handleCreateRole called with:', data);
        if (!data.name) {
            showToast('El nombre del rol es obligatorio', 'warning');
            return;
        }
        if (isSystemRole(data.name)) {
            showToast(`El nombre "${data.name}" está reservado por el sistema`, 'danger');
            return;
        }
        setLoading(true);
        try {
            await roleService.createRole({
                name: data.name,
                description: data.description,
                permissions: []
            });
            showToast(`Rol "${data.name}" creado correctamente`);
            fetchRoles();
            setShowAddAlert(false);
            setAlertInputs([]);
        } catch (err: any) {
            console.error(err);
            showToast(err.response?.data?.message || 'Error al crear el rol', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (id: string) => {
        setLoading(true);
        try {
            await roleService.deleteRole(id);
            showToast('Rol eliminado correctamente');
            fetchRoles();
        } catch (err: any) {
            console.error(err);
            showToast(err.response?.data?.message || 'Error al eliminar el rol', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const openAddAlert = () => {
        setAlertInputs([
            {
                name: 'name',
                type: 'text' as const,
                placeholder: 'Nombre del rol (ej. logisticadmin)',
                value: ''
            },
            {
                name: 'description',
                type: 'text' as const,
                placeholder: 'Descripción',
                value: ''
            }
        ]);
        setShowAddAlert(true);
    };

    return {
        user,
        roles,
        loading,
        showAddAlert,
        setShowAddAlert,
        toastConfig,
        setToastConfig,
        alertInputs,
        setAlertInputs,
        handleLogout,
        isSystemRole,
        handleCreateRole,
        handleDeleteRole,
        openAddAlert
    };
};
