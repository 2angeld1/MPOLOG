import React from 'react';
import { 
    IonContent, IonPage, IonList, IonItem, IonLabel, 
    IonButton, IonIcon, IonFab, IonFabButton, IonLoading, 
    IonAlert, IonToast 
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Toolbar from '../components/Toolbar';
import { useRoleMaintenance } from '../hooks/useRoleMaintenance';
import '../styles/RoleMaintenance.scss';

const RoleMaintenance: React.FC = () => {
    const {
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
    } = useRoleMaintenance();

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
            <Toolbar title="Roles" children={toolbarChildren} />
            <IonContent className="ion-padding role-maintenance-content">
                <IonLoading isOpen={loading} message="Cargando roles..." />
                
                <IonList lines="none">
                    {roles.map(role => (
                        <IonItem key={role.name} className={`role-item ${isSystemRole(role.name) ? 'system-role-item' : ''}`}>
                            <IonLabel>
                                <h2>{role.name}</h2>
                                <p>{role.description}</p>
                            </IonLabel>
                            {!isSystemRole(role.name) && (
                                <IonButton 
                                    fill="clear" 
                                    color="danger" 
                                    slot="end"
                                    onClick={() => handleDeleteRole(role._id || role.id)}
                                >
                                    <IonIcon icon={trash} />
                                </IonButton>
                            )}
                            {isSystemRole(role.name) && (
                                <IonButton 
                                    fill="clear" 
                                    color="medium" 
                                    slot="end"
                                    disabled
                                >
                                    <IonIcon icon={trash} />
                                </IonButton>
                            )}
                        </IonItem>
                    ))}
                </IonList>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={openAddAlert}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                <IonAlert
                    isOpen={showAddAlert}
                    onDidDismiss={() => {
                        setShowAddAlert(false);
                        setAlertInputs([]);
                    }}
                    header="Nuevo Rol"
                    inputs={alertInputs}
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel'
                        },
                        {
                            text: 'Crear',
                            handler: (data) => {
                                console.log('[RoleMaintenance] Creating role with data:', data);
                                handleCreateRole(data);
                                return true;
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
                    position="top"
                />
            </IonContent>
        </IonPage>
    );
};

export default RoleMaintenance;
