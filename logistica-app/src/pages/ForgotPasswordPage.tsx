import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonToast,
    IonSpinner,
    IonText,
    IonIcon,
    IonButtons, // Agrega IonButtons aquí
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { arrowBack } from 'ionicons/icons'; // Agrega arrowBack de Ionicons
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';
import '../styles/ForgotPasswordPage.scss';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleForgotPassword = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!email || email.trim() === '') {
            setToastMessage('Por favor ingresa tu email');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setToastMessage('Se ha enviado un enlace de recuperación a tu email');
            setShowToast(true);
            setTimeout(() => history.push('/login'), 3000); // Redirigir después de 3 segundos
        } catch (error: any) {
            setToastMessage(error.message || 'Error al enviar el enlace de recuperación');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton fill="clear" slot="start" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} /> {/* Cambia faArrowLeft por arrowBack */}
                    </IonButton>
                    <IonTitle>Recuperar Pwd</IonTitle>
                    <IonButtons slot="end"> {/* Ahora IonButtons está importado */}
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