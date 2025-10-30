import { IonPage, IonContent, IonButtons, IonCard, IonCardContent, IonButton, IonSelect, IonSelectOption, IonIcon, IonSpinner, IonToast } from '@ionic/react';
import { motion } from 'framer-motion';
import { documentTextOutline, cloudDownloadOutline, imageOutline } from 'ionicons/icons';
import ThemeToggle from '../components/ThemeToggle';
import { useReports } from '../hooks/useReports';
import { containerVariants, itemVariants } from '../animations';
import '../styles/Reports.scss';
import Toolbar from '../components/Toolbar';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useIonViewWillEnter } from '@ionic/react';

const Reports: React.FC = () => {
    const { periodo, setPeriodo, loading, showToast, setShowToast, toastMessage, descargarReporte } = useReports();
    const { toolbarTitle, setToolbarTitle } = useData();
    const { logout, user } = useAuth();

    useIonViewWillEnter(() => {
        setToolbarTitle && setToolbarTitle('Reportes');
    });

    const toolbarChildren = (
        <>
            <div className="user-greeting">Hola, {user?.nombre || 'Usuario'}</div>
            <IonButton onClick={() => logout()} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="button-text">Salir</span>
            </IonButton>
        </>
    );

    return (
        <IonPage>
            <Toolbar title={toolbarTitle} children={toolbarChildren} />
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