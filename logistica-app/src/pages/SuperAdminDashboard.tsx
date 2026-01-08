import React from 'react';
import { 
    IonContent, IonPage, IonCard, IonCardHeader, IonCardSubtitle, 
    IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, 
    IonButton, IonText
} from '@ionic/react';
import { trendingUp, time, people } from 'ionicons/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Toolbar from '../components/Toolbar';
import { useSuperAdminDashboard } from '../hooks/useSuperAdminDashboard';
import '../styles/SuperAdminDashboard.scss';

const SuperAdminDashboard: React.FC = () => {
    const { user, stats, handleLogout } = useSuperAdminDashboard();

    const toolbarChildren = (
        <>
            <IonButton onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="button-text">Salir</span>
            </IonButton>
        </>
    );

    return (
        <IonPage>
            <Toolbar title="Panel de Control" children={toolbarChildren} />
            <IonContent fullscreen className="ion-padding dashboard-content">
                <div className="welcome-section">
                    <IonText color="dark">
                        <h1>Bienvenido, <span className="admin-name">{user?.nombre || 'Administrador'}</span></h1>
                    </IonText>
                    <IonText color="medium">
                        <p>Resumen de actividad del sistema</p>
                    </IonText>
                </div>

                <IonGrid className="ion-no-padding">
                    <IonRow>
                        {stats.map((stat, index) => (
                            <IonCol size="6" sizeMd="3" key={index} className="ion-padding-tiny">
                                <IonCard className="stat-card">
                                    <IonCardContent className="ion-text-center">
                                        <div 
                                            className="icon-wrapper"
                                            style={{ backgroundColor: `var(--ion-color-${stat.color}-tint)` }}
                                        >
                                            <IonIcon icon={stat.icon} color={stat.color} size="large" />
                                        </div>
                                        <IonCardTitle>{stat.value}</IonCardTitle>
                                        <IonCardSubtitle>{stat.title}</IonCardSubtitle>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                <IonCard className="ion-margin-top shadow-card">
                    <IonCardHeader>
                        <IonCardTitle>Actividad Reciente</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonGrid className="ion-no-padding">
                            <IonRow className="activity-item ion-align-items-center">
                                <IonCol size="2"><IonIcon icon={time} /></IonCol>
                                <IonCol>Nuevo usuario registrado: Juan Pérez</IonCol>
                                <IonCol size="3" className="ion-text-end"><IonText color="medium"><small>Hace 5m</small></IonText></IonCol>
                            </IonRow>
                            <IonRow className="activity-item ion-align-items-center">
                                <IonCol size="2"><IonIcon icon={trendingUp} color="success"/></IonCol>
                                <IonCol>Meta de evento "Retiro 2024" alcanzada</IonCol>
                                <IonCol size="3" className="ion-text-end"><IonText color="medium"><small>Hace 2h</small></IonText></IonCol>
                            </IonRow>
                            <IonRow className="activity-item ion-align-items-center">
                                <IonCol size="2"><IonIcon icon={people} color="primary"/></IonCol>
                                <IonCol>Asistencia dominical reportada: 450 personas</IonCol>
                                <IonCol size="3" className="ion-text-end"><IonText color="medium"><small>Ayer</small></IonText></IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                <div className="quick-actions ion-margin-top">
                    <IonGrid className="ion-no-padding">
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" shape="round" fill="outline">Ver Reportes</IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton expand="block" shape="round" fill="solid" color="primary">Crear Usuario</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SuperAdminDashboard;
