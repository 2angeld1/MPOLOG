import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonToast, IonSpinner, IonText, IonIcon, IonButtons } from '@ionic/react';
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { arrowBack } from 'ionicons/icons';
import ThemeToggle from '../components/ThemeToggle';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { containerVariants, itemVariants } from '../animations';
import '../styles/ForgotPasswordPage.scss';

const ForgotPasswordPage: React.FC = () => {
    const { email, setEmail, showToast, setShowToast, toastMessage, loading, history, handleForgotPassword } = useForgotPassword();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton fill="clear" slot="start" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>Recuperar Pwd</IonTitle>
                    <IonButtons slot="end">
                        <ThemeToggle />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <motion.div
                    className="forgot-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="forgot-logo"
                        variants={itemVariants}
                    >
                        <div className="logo-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <h1>¿Olvidaste tu contraseña?</h1>
                        <p>Ingresa tu email y te enviaremos un enlace para restablecerla</p>
                    </motion.div>

                    <form onSubmit={handleForgotPassword} className="forgot-form">
                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Email"
                                    labelPlacement="floating"
                                    type="email"
                                    value={email}
                                    onIonInput={(e) => setEmail(e.detail.value || '')}
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
                                className="forgot-button"
                                shape="round"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Enlace de Recuperación'
                                )}
                            </IonButton>
                        </motion.div>

                        <motion.div
                            className="forgot-footer"
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

export default ForgotPasswordPage;