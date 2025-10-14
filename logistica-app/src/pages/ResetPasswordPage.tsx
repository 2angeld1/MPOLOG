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
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons'; // Remueve faArrowLeft
import { arrowBack } from 'ionicons/icons'; // Agrega arrowBack de Ionicons
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';
import '../styles/ResetPasswordPage.scss';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        // Obtener token de la URL (ej. /reset-password?token=abc123)
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setToastMessage('Token inválido o expirado');
            setShowToast(true);
        }
    }, [location]);

    const handleResetPassword = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!password || password.trim() === '') {
            setToastMessage('Por favor ingresa una nueva contraseña');
            setShowToast(true);
            return;
        }

        if (password !== confirmPassword) {
            setToastMessage('Las contraseñas no coinciden');
            setShowToast(true);
            return;
        }

        if (password.length < 6) {
            setToastMessage('La contraseña debe tener al menos 6 caracteres');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setToastMessage('Contraseña restablecida correctamente');
            setShowToast(true);
            setTimeout(() => history.push('/login'), 3000);
        } catch (error: any) {
            setToastMessage(error.message || 'Error al restablecer la contraseña');
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
                    <IonTitle>Restablecer Contraseña</IonTitle>
                    <IonButtons slot="end"> {/* Ahora IonButtons está importado */}
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