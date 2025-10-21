import { IonButton, IonContent, IonInput, IonPage, IonItem, IonToast, IonSpinner } from '@ionic/react';
import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChurch } from '@fortawesome/free-solid-svg-icons';
import { useLogin } from '../hooks/useLogin';
import '../styles/LoginPage.scss';
import { containerVariants, itemVariants, logoVariants } from '../animations';

const LoginPage: React.FC = () => {
    const { email, setEmail, password, setPassword, showToast, setShowToast, toastMessage, loading, history, handleLogin } = useLogin();

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

                    <form onSubmit={handleLogin} className="login-form">
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

                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Contraseña"
                                    labelPlacement="floating"
                                    type="password"
                                    value={password}
                                    onIonInput={(e) => {
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
                                type="submit"
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
                                        history.push('/forgot-password');
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
                                        history.push('/register');
                                    }}
                                    className="register-link"
                                >
                                    Regístrate
                                </a>
                            </p>
                        </motion.div>
                    </form>
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