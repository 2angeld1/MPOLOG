import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useHistory } from 'react-router-dom';
import { userService, roleService } from '../services/api';
import { useIonViewWillEnter } from '@ionic/react';

export const staticRoles = [
    { name: 'superadmin', label: 'Super Admin' },
    { name: 'logisticadmin', label: 'Logistic Admin' },
    { name: 'eventsadmin', label: 'Events Admin' },
    { name: 'sameadmin', label: 'Same Admin' },
    { name: 'admin', label: 'Admin (Legacy)' },
    { name: 'usuario', label: 'Usuario Standard' }
];

export const useUserMaintenance = () => {
    const { token, user, logout } = useAuth();
    const { setToolbarTitle } = useData();
    const history = useHistory();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRoleAlert, setShowRoleAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [toastConfig, setToastConfig] = useState<{ isOpen: boolean; message: string; color: string }>({
        isOpen: false,
        message: '',
        color: 'success'
    });
    const [roles, setRoles] = useState<any[]>([]);
    const [alertInputs, setAlertInputs] = useState<any[]>([]);

    useIonViewWillEnter(() => {
        if (setToolbarTitle) setToolbarTitle('Usuarios');
    });

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, rolesData] = await Promise.all([
                userService.getUsers(),
                roleService.getRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleRoleUpdate = async (newRole: any) => {
        if (!selectedUser) return;
        const roleValue = (typeof newRole === 'string') ? newRole : (newRole.rol || newRole);
        
        setLoading(true);
        try {
            await userService.updateUserRole(selectedUser._id, roleValue);
            setToastConfig({
                isOpen: true,
                message: `Rol de ${selectedUser.nombre} actualizado a ${roleValue}`,
                color: 'success'
            });
            await fetchData();
            setShowRoleAlert(false);
            setSelectedUser(null);
        } catch (err: any) {
            console.error(err);
            setToastConfig({
                isOpen: true,
                message: err.response?.data?.message || 'Error al actualizar el rol',
                color: 'danger'
            });
        } finally {
            setLoading(false);
        }
    };

    const availableRoles = useMemo(() => [
        ...staticRoles,
        ...roles.filter(r => !staticRoles.some(sr => sr.name === r.name)).map(r => ({ name: r.name, label: r.name }))
    ], [roles]);

    const openRoleAlert = (user: any) => {
        setSelectedUser(user);
        const inputs = availableRoles.map(role => ({
            name: 'rol',
            type: 'radio' as const,
            label: role.label || role.name,
            value: role.name,
            checked: user.rol === role.name
        }));
        setAlertInputs(inputs);
        setShowRoleAlert(true);
    };

    return {
        user,
        users,
        loading,
        error,
        showRoleAlert,
        setShowRoleAlert,
        selectedUser,
        setSelectedUser,
        toastConfig,
        setToastConfig,
        alertInputs,
        setAlertInputs,
        handleLogout,
        handleRoleUpdate,
        openRoleAlert
    };
};
