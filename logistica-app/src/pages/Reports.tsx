import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonCard,
    IonCardContent,
} from '@ionic/react';
import { motion } from 'framer-motion';
import { easeOut, easeInOut } from 'framer-motion'; // Importa las funciones de easing
import Lottie from 'lottie-react';
import ThemeToggle from '../components/ThemeToggle';
import comingSoonAnimation from '../assets/lottie/coming-soon.json';
import '../styles/Reports.scss';
import '../styles/Toolbar.scss';

const Reports: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: easeOut // Usa la función importada
            }
        }
    };

    const pulseVariants = {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: easeInOut // Usa la función importada
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Reportes</IonTitle>
                    <IonButtons slot="end">
                        <ThemeToggle />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="reports-content">
                <motion.div
                    className="reports-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="animation-wrapper">
                        <Lottie
                            animationData={comingSoonAnimation}
                            loop={true}
                            style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="coming-soon-content">
                        <IonCard className="coming-soon-card">
                            <IonCardContent>
                                <motion.h1
                                    className="coming-soon-title"
                                    animate={pulseVariants}
                                >
                                    Próximamente
                                </motion.h1>
                                <p className="coming-soon-subtitle">
                                    Estamos trabajando en esta sección
                                </p>
                                <div className="features-list">
                                    <motion.div
                                        className="feature-item"
                                        variants={itemVariants}
                                    >
                                        <div className="feature-icon">📊</div>
                                        <div className="feature-text">
                                            <h3>Reportes Detallados</h3>
                                            <p>Visualiza estadísticas completas por fechas y áreas</p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="feature-item"
                                        variants={itemVariants}
                                    >
                                        <div className="feature-icon">📥</div>
                                        <div className="feature-text">
                                            <h3>Exportación de Datos</h3>
                                            <p>Descarga reportes en PDF, Excel y CSV</p>
                                        </div>
                                    </motion.div>
                                </div>
                                <motion.div
                                    className="timeline"
                                    variants={itemVariants}
                                >
                                    <div className="timeline-badge">
                                        <span className="timeline-icon">🚀</span>
                                    </div>
                                    <p className="timeline-text">
                                        Fecha estimada: <strong>Próximamente</strong>
                                    </p>
                                </motion.div>
                            </IonCardContent>
                        </IonCard>
                    </motion.div>
                </motion.div>
            </IonContent>
        </IonPage>
    );
};

export default Reports;