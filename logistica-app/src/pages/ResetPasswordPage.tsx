import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonToast, IonSpinner, IonText, IonIcon, IonButtons } from '@ionic/react';
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { arrowBack } from 'ionicons/icons';
import ThemeToggle from '../components/ThemeToggle';
import { useResetPassword } from '../hooks/useResetPassword';
import { containerVariants, itemVariants } from '../animations';
import '../styles/ResetPasswordPage.scss';

const ResetPasswordPage: React.FC = () => {
    const { password, setPassword, confirmPassword, setConfirmPassword, token, showToast, setShowToast, toastMessage, loading, history, handleResetPassword } = useResetPassword();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton fill="clear" slot="start" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>Restablecer Contraseña</IonTitle>
                    <IonButtons slot="end">
                        <ThemeToggle />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <motion.div
                    className="reset-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="reset-logo"
                        variants={itemVariants}
                    >
                        <div className="logo-icon">
                            <FontAwesomeIcon icon={faLock} />
                        </div>
                        <h1>Restablecer Contraseña</h1>
                        <p>Ingresa tu nueva contraseña</p>
                    </motion.div>

                    <form onSubmit={handleResetPassword} className="reset-form">
                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Nueva Contraseña"
                                    labelPlacement="floating"
                                    type="password"
                                    value={password}
                                    onIonInput={(e) => setPassword(e.detail.value || '')}
                                    disabled={loading}
                                    required
                                ></IonInput>
                            </IonItem>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Confirmar Contraseña"
                                    labelPlacement="floating"
                                    type="password"
                                    value={confirmPassword}
                                    onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
                                    disabled={loading}
                                    required
                                ></IonInput>
                            </IonItem>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            <IonButton
                                expand="block"
                                type="submit"
                                className="reset-button"
                                shape="round"
                                disabled={loading || !token}
                            >
                                {loading ? (
                                    <>
                                        <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                                        Restableciendo...
                                    </>
                                ) : (
                                    'Restablecer Contraseña'
                                )}
                            </IonButton>
                        </motion.div>

                        <motion.div
                            className="reset-footer"
                            variants={itemVariants}
                        >
                            <IonText color="medium">
                                <p>
                                    ¿Recordaste tu contraseña?{' '}
                                    <a href="#" onClick={() => history.push('/login')}>Inicia sesión</a>
                                </p>
                            </IonText>
                        </motion.div>
                    </form>
                </motion.div>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    position="top"
                    color={toastMessage.includes('Error') ? 'danger' : 'success'}
                />
            </IonContent>
        </IonPage>
    );
};

export default ResetPasswordPage;