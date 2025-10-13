import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonCard,
    IonCardContent,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonSpinner,
    IonToast,
} from '@ionic/react';
import { motion } from 'framer-motion';
import { documentTextOutline, cloudDownloadOutline, imageOutline } from 'ionicons/icons';
import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import api from '../services/api';
import '../styles/Reports.scss';
import '../styles/Toolbar.scss';

const Reports: React.FC = () => {
    const [periodo, setPeriodo] = useState<string>('mes');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const descargarReporte = async (formato: 'pdf' | 'excel' | 'png') => {
        setLoading(true);
        try {
            const response = await api.get(`/reportes/${formato}?periodo=${periodo}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const extension = formato === 'excel' ? 'xlsx' : formato;
            link.setAttribute('download', `reporte-${periodo}-${Date.now()}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.remove();

            setToastMessage(`Reporte ${formato.toUpperCase()} descargado correctamente`);
            setShowToast(true);
        } catch (error: any) {
            console.error('Error al descargar reporte:', error);
            setToastMessage('Error al descargar el reporte');
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
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
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
                    <motion.div variants={itemVariants}>
                        <IonCard className="reports-card">
                            <IonCardContent>
                                <h2 className="reports-title">📊 Generar Reportes</h2>
                                <p className="reports-subtitle">
                                    Selecciona el período y formato para descargar tu reporte
                                </p>

                                <div className="periodo-selector">
                                    <label className="periodo-label">Período:</label>
                                    <IonSelect
                                        value={periodo}
                                        onIonChange={(e) => setPeriodo(e.detail.value)}
                                        interface="popover"
                                        className="periodo-select"
                                    >
                                        <IonSelectOption value="semana">Esta Semana</IonSelectOption>
                                        <IonSelectOption value="mes">Este Mes</IonSelectOption>
                                        <IonSelectOption value="6meses">Últimos 6 Meses</IonSelectOption>
                                        <IonSelectOption value="año">Este Año</IonSelectOption>
                                    </IonSelect>
                                </div>

                                <div className="download-options">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <IonButton
                                            expand="block"
                                            onClick={() => descargarReporte('pdf')}
                                            disabled={loading}
                                            className="download-button pdf"
                                        >
                                            <IonIcon slot="start" icon={documentTextOutline} />
                                            {loading ? <IonSpinner name="crescent" /> : 'Descargar PDF'}
                                        </IonButton>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <IonButton
                                            expand="block"
                                            onClick={() => descargarReporte('excel')}
                                            disabled={loading}
                                            className="download-button excel"
                                        >
                                            <IonIcon slot="start" icon={cloudDownloadOutline} />
                                            {loading ? <IonSpinner name="crescent" /> : 'Descargar Excel'}
                                        </IonButton>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <IonButton
                                            expand="block"
                                            onClick={() => descargarReporte('png')}
                                            disabled={loading}
                                            className="download-button png"
                                        >
                                            <IonIcon slot="start" icon={imageOutline} />
                                            {loading ? <IonSpinner name="crescent" /> : 'Descargar Gráfico PNG'}
                                        </IonButton>
                                    </motion.div>
                                </div>

                                <div className="reports-info">
                                    <h3>ℹ️ Información</h3>
                                    <ul>
                                        <li><strong>PDF:</strong> Reporte completo con estadísticas y tabla de registros</li>
                                        <li><strong>Excel:</strong> Hoja de cálculo editable con todos los datos</li>
                                        <li><strong>PNG:</strong> Gráfico visual de personas por área</li>
                                    </ul>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    </motion.div>
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

export default Reports;