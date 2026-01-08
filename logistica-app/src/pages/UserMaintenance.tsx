import React from 'react';
import { 
    IonContent, IonPage, IonList, IonItem, IonLabel, 
    IonNote, IonButton, IonIcon, IonLoading, IonAlert, 
    IonToast
} from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Toolbar from '../components/Toolbar';
import { useUserMaintenance } from '../hooks/useUserMaintenance';
import '../styles/UserMaintenance.scss';

const UserMaintenance: React.FC = () => {
    const {
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
    } = useUserMaintenance();

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
            <Toolbar title="Usuarios" children={toolbarChildren} />
            <IonContent className="ion-padding user-maintenance-content">
                <IonLoading isOpen={loading} message={'Cargando usuarios...'} />
                
                {error && (
                    <IonItem lines="none" color="danger" className="ion-margin-bottom">
                        <IonLabel>{error}</IonLabel>
                    </IonItem>
                )}

                <IonList lines="none">
                    {users.map(user => (
                        <IonItem key={user._id} className="user-item">
                            <IonLabel>
                                <h2>{user.nombre}</h2>
                                <p>{user.email}</p>
                            </IonLabel>
                            <IonNote slot="end" className="role-badge" data-role={user.rol}>{user.rol}</IonNote>
                            <IonButton 
                                fill="clear" 
                                slot="end"
                                className="edit-button"
                                onClick={() => openRoleAlert(user)}
                            >
                                <IonIcon icon={createOutline} />
                            </IonButton>
                        </IonItem>
                    ))}
                </IonList>

                <IonAlert
                    isOpen={showRoleAlert}
                    onDidDismiss={() => {
                        setShowRoleAlert(false);
                        setAlertInputs([]);
                    }}
                    header={`Asignar Rol a ${selectedUser?.nombre}`}
                    inputs={alertInputs}
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            handler: () => setSelectedUser(null)
                        },
                        {
                            text: 'Guardar',
                            handler: (data: any) => {
                                if (data) {
                                    handleRoleUpdate(data);
                                    return true;
                                }
                                return false;
                            }
                        }
                    ]}
                />
                <IonToast
                    isOpen={toastConfig.isOpen}
                    onDidDismiss={() => setToastConfig({ ...toastConfig, isOpen: false })}
                    message={toastConfig.message}
                    color={toastConfig.color}
                    duration={3000}
                />
            </IonContent>
        </IonPage>
    );
};

export default UserMaintenance;
