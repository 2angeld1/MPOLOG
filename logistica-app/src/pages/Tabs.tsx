import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { home, addCircle, statsChart, people, settings, grid } from 'ionicons/icons';
import Home from './Home';
import AddRecord from './AddRecord';
import Reports from './Reports';
import EventoRegistro from './EventoRegistro';
import UserMaintenance from './UserMaintenance';
import RoleMaintenance from './RoleMaintenance';
import SuperAdminDashboard from './SuperAdminDashboard';
import Toolbar from '../components/Toolbar';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { IonButton } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import UserStatusBubble from '../components/UserStatusBubble';
import '../styles/Tabs.scss';

const Tabs: React.FC = () => {
    const location = useLocation();
    const { toolbarTitle } = useData();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const toolbarChildren = location.pathname === '/tabs/home' ? (
        <>
            <IonButton onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="button-text">Salir</span>
            </IonButton>
        </>
    ) : null;

    const isSuperAdmin = user?.rol === 'superadmin';
    const isLogisticAdmin = user?.rol === 'logisticadmin';
    const isEventsAdmin = user?.rol === 'eventsadmin';
    const isSameAdmin = user?.rol === 'sameadmin';

    // Determine default redirect based on role
    const getDefaultRedirect = () => {
        if (isSuperAdmin) return '/tabs/admin-dashboard';
        if (isEventsAdmin) return '/tabs/eventos';
        return '/tabs/home';
    };

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/tabs/home">
                    {/* Standard users, Logistic Admin, Same Admin, and generic Admins can see Home. Superadmin excluded. */}
                    {(!isEventsAdmin && !isSuperAdmin) || (isSameAdmin && !isSuperAdmin) ? <Home /> : <Redirect to={getDefaultRedirect()} />}
                </Route>
                <Route exact path="/tabs/add">
                    {/* Only Logistic Admin or Same Admin can add records. Superadmin excluded. */}
                    {(isLogisticAdmin || isSameAdmin) ? <AddRecord /> : <Redirect to={getDefaultRedirect()} />}
                </Route>
                <Route exact path="/tabs/eventos">
                    {/* Only Events Admin or Same Admin can manage events. Superadmin excluded. */}
                    {(isEventsAdmin || isSameAdmin) ? <EventoRegistro /> : <Redirect to={getDefaultRedirect()} />}
                </Route>
                <Route exact path="/tabs/reports">
                    {/* Only Logistic Admin or Same Admin can see reports. Superadmin excluded. */}
                    {(isLogisticAdmin || isSameAdmin) ? <Reports /> : <Redirect to={getDefaultRedirect()} />}
                </Route>

                {/* Super Admin Routes */}
                <Route exact path="/tabs/admin-dashboard">
                    {isSuperAdmin ? <SuperAdminDashboard /> : <Redirect to={getDefaultRedirect()} />}
                </Route>
                <Route exact path="/tabs/users">
                    {isSuperAdmin ? <UserMaintenance /> : <Redirect to={getDefaultRedirect()} />}
                </Route>
                <Route exact path="/tabs/roles">
                    {isSuperAdmin ? <RoleMaintenance /> : <Redirect to={getDefaultRedirect()} />}
                </Route>

                <Route exact path="/tabs">
                    <Redirect to={getDefaultRedirect()} />
                </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom" className="custom-tab-bar">
                {/* Logistic Admin / Default View */}
                {/* Home View (Visible to almost everyone except strictly eventsadmin and superadmin) */}
                {(!isEventsAdmin && !isSuperAdmin) && (
                    <IonTabButton tab="home" href="/tabs/home">
                        <IonIcon icon={home} />
                        <IonLabel>Inicio</IonLabel>
                    </IonTabButton>
                )}
                {/* Logistic Admin View (Excluded Superadmin) */}
                {(isLogisticAdmin || isSameAdmin) && (
                    <IonTabButton tab="add" href="/tabs/add">
                        <IonIcon icon={addCircle} />
                        <IonLabel>Agregar</IonLabel>
                    </IonTabButton>
                )}

                {/* Events View */}
                {/* Events Admin View (Excluded Superadmin) */}
                {(isEventsAdmin || isSameAdmin) && (
                    <IonTabButton tab="eventos" href="/tabs/eventos">
                        <IonIcon icon={people} />
                        <IonLabel>Eventos</IonLabel>
                    </IonTabButton>
                )}

                {/* Reports View (Excluded Superadmin) */}
                {(isLogisticAdmin || isSameAdmin) && (
                    <IonTabButton tab="reports" href="/tabs/reports">
                        <IonIcon icon={statsChart} />
                        <IonLabel>Reportes</IonLabel>
                    </IonTabButton>
                )}

                {/* Super Admin View */}
                {isSuperAdmin && (
                    <IonTabButton tab="admin-dashboard" href="/tabs/admin-dashboard">
                        <IonIcon icon={grid} />
                        <IonLabel>Inicio</IonLabel>
                    </IonTabButton>
                )}
                {isSuperAdmin && (
                    <IonTabButton tab="users" href="/tabs/users">
                        <IonIcon icon={people} />
                        <IonLabel>Usuarios</IonLabel>
                    </IonTabButton>
                )}
                {isSuperAdmin && (
                    <IonTabButton tab="roles" href="/tabs/roles">
                        <IonIcon icon={settings} />
                        <IonLabel>Roles</IonLabel>
                    </IonTabButton>
                )}
            </IonTabBar>
            <UserStatusBubble />
        </IonTabs>
    );
};

export default Tabs;