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
    IonButtons,
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { arrowBack } from 'ionicons/icons';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';
import '../styles/RegisterPage.scss';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nombre: ''
        // Quita username y rol
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const { email, password, confirmPassword, nombre } = formData;

        if (!email || !password || !confirmPassword || !nombre) { // Quita username
            setToastMessage('Por favor completa todos los campos');
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
            await api.post('/auth/register', formData); // Envía solo los campos restantes
            setToastMessage('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
            setShowToast(true);
            setTimeout(() => history.push('/login'), 3000);
        } catch (error: any) {
            setToastMessage(error.message || 'Error al registrar usuario');
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

                        {/* Quita el IonInput para username */}

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

                        {/* Quita el IonSelect para rol */}

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
                            <IonText color="medium">
                                <p>
                                    ¿Ya tienes cuenta?{' '}
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

export default RegisterPage;