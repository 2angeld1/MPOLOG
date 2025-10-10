import {
    IonButton,
    IonContent,
    IonInput,
    IonPage,
    IonItem,
    IonToast,
    IonSpinner,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChurch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.scss';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            setToastMessage('Por favor ingresa usuario y contraseña');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            await login(username, password);
            history.replace('/tabs/home');
        } catch (error: any) {
            setToastMessage(error.message || 'Error al iniciar sesión');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
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
            transition: {
                duration: 0.5
            }
        }
    };

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6
            }
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding">
                <div className="theme-toggle-wrapper">
                    <ThemeToggle />
                </div>
                <motion.div
                    className="login-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="login-logo"
                        variants={logoVariants}
                    >
                        <div className="logo-icon">
                            <FontAwesomeIcon icon={faChurch} />
                        </div>
                        <h1>Logística App</h1>
                        <p>Inicia sesión para continuar</p>
                    </motion.div>

                    <div className="login-form">
                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Usuario"
                                    labelPlacement="floating"
                                    value={username}
                                    onIonChange={(e) => setUsername(e.detail.value!)}
                                    onKeyPress={handleKeyPress}
                                    disabled={loading}
                                ></IonInput>
                            </IonItem>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Contraseña"
                                    labelPlacement="floating"
                                    type="password"
                                    value={password}
                                    onIonChange={(e) => setPassword(e.detail.value!)}
                                    onKeyPress={handleKeyPress}
                                    disabled={loading}
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
                                onClick={handleLogin}
                                className="login-button"
                                shape="round"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </IonButton>
                        </motion.div>

                        <motion.div
                            className="login-footer"
                            variants={itemVariants}
                        >
                            <p>
                                ¿Olvidaste tu contraseña?{' '}
                                <a href="#">Recuperar</a>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    color="danger"
                    position="top"
                />
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;