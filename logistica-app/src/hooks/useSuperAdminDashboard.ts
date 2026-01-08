import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useHistory } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';
import { people, statsChart, calendar, wallet } from 'ionicons/icons';

export const useSuperAdminDashboard = () => {
    const { user, logout } = useAuth();
    const { setToolbarTitle } = useData();
    const history = useHistory();

    useIonViewWillEnter(() => {
        if (setToolbarTitle) setToolbarTitle('Panel de Control');
    });

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    const stats = [
        { title: 'Total Usuarios', value: '1,234', icon: people, color: 'primary' },
        { title: 'Eventos Activos', value: '5', icon: calendar, color: 'success' },
        { title: 'Reportes Hoy', value: '42', icon: statsChart, color: 'warning' },
        { title: 'Recaudado Mes', value: '$15,400', icon: wallet, color: 'tertiary' },
    ];

    return {
        user,
        stats,
        handleLogout
    };
};
