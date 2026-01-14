import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonToast, IonSpinner, IonText, IonIcon, IonButtons } from '@ionic/react';
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { arrowBack } from 'ionicons/icons';
import ThemeToggle from '../components/ThemeToggle';
import { useRegister } from '../hooks/useRegister';
import { containerVariants, itemVariants } from '../animations';
import '../styles/RegisterPage.scss';

const RegisterPage: React.FC = () => {
    const { formData, loading, history, handleInputChange, handleRegister } = useRegister();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton fill="clear" slot="start" onClick={() => history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>Registro</IonTitle>
                    <IonButtons slot="end">
                        <ThemeToggle />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <motion.div
                    className="register-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="register-logo"
                        variants={itemVariants}
                    >
                        <div className="logo-icon">
                            <FontAwesomeIcon icon={faUserPlus} />
                        </div>
                        <h1>Crear Cuenta</h1>
                        <p>Regístrate para acceder al sistema</p>
                    </motion.div>

                    <form onSubmit={handleRegister} className="register-form">
                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Nombre Completo"
                                    labelPlacement="floating"
                                    value={formData.nombre}
                                    onIonInput={(e) => handleInputChange('nombre', e.detail.value || '')}
                                    disabled={loading}
                                    required
                                ></IonInput>
                            </IonItem>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <IonItem lines="none" className="form-item">
                                <IonInput
                                    label="Email"
                                    labelPlacement="floating"
                                    type="email"
                                    value={formData.email}
                                    onIonInput={(e) => handleInputChange('email', e.detail.value || '')}
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
                                    value={formData.password}
                                    onIonInput={(e) => handleInputChange('password', e.detail.value || '')}
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
                                    value={formData.confirmPassword}
                                    onIonInput={(e) => handleInputChange('confirmPassword', e.detail.value || '')}
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
                                className="register-button"
                                shape="round"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                                        Registrando...
                                    </>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </IonButton>
                        </motion.div>

                        <motion.div
                            className="register-footer"
                            variants={itemVariants}
                        >
                            <div className="divider">
                                <span>O</span>
                            </div>
                            <p className="login-text">¿Ya tienes cuenta?</p>
                            <IonButton
                                type="button"
                                expand="block"
                                fill="clear"
                                className="login-secondary-button"
                                onClick={() => history.push('/login')}
                            >
                                Inicia sesión aquí
                            </IonButton>
                        </motion.div>
                    </form>
                </motion.div>

            </IonContent>
        </IonPage>
    );
};

export default RegisterPage;