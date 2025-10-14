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
import { useHistory } from 'react-router-dom'; // Cambia useNavigate por useHistory
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChurch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.scss';
import { authService } from '../services/api';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState(''); // Cambia username por email
    const [password, setPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory(); // Cambia navigate por history
    const { login } = useAuth();

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!email || !password) {
            setToastMessage('Por favor ingresa email y contraseña');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            await login(email, password); // Cambia authService.login por login del contexto
            // El contexto maneja el toast de éxito y la redirección
        } catch (error: any) {
            setToastMessage(error.message || 'Error al iniciar sesión');
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

                    <form onSubmit={handleLogin} className="login-form"> {/* Agrega form */}
                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Email" // Cambia "Usuario" por "Email"
                                    labelPlacement="floating"
                                    type="email" // Agrega type="email"
                                    value={email} // Cambia username por email
                                    onIonInput={(e) => setEmail(e.detail.value || '')} // Cambia setUsername por setEmail
                                    disabled={loading}
                                    required
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
                                    onIonInput={(e) => { // Quita el console.log
                                        const value = e.detail.value || '';
                                        setPassword(value);
                                    }}
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
                                type="submit" // Cambia a type="submit"
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
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.push('/forgot-password'); // Cambia navigate por history.push
                                    }}
                                    className="forgot-password-link"
                                >
                                    Recuperar
                                </a>
                            </p>
                            <p>
                                ¿No tienes cuenta?{' '}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.push('/register'); // Cambia navigate por history.push
                                    }}
                                    className="register-link"
                                >
                                    Regístrate
                                </a>
                            </p>
                        </motion.div>
                    </form> {/* Cierra form */}
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