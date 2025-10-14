import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
    IonToast,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from '../components/ThemeToggle';
import RegistroCard from '../components/RegistroCard';
import { conteoService } from '../services/api';
import { useData } from '../context/DataContext'; // Agrega import
import '../styles/AddRecord.scss';
import '../styles/Toolbar.scss';

interface PersonaRegistro {
    _id?: string;
    id: number;
    fecha: string;
    cantidad: number;
    area: string;
}

const AddRecord: React.FC = () => {
    const [fecha, setFecha] = useState<string>(new Date().toISOString());
    const [cantidad, setCantidad] = useState<number | undefined>(undefined);
    const [area, setArea] = useState<string>('');
    const [areas, setAreas] = useState<string[]>([]);
    const [registros, setRegistros] = useState<PersonaRegistro[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
    const [loading, setLoading] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const { refreshData } = useData(); // Agrega hook

    // Cargar áreas al montar el componente
    useEffect(() => {
        cargarAreas();
    }, []);

    // Cargar registros cuando cambia la fecha
    useEffect(() => {
        cargarRegistros();
    }, [fecha]);

    const cargarAreas = async () => {
        setLoadingAreas(true);
        try {
            console.log('📍 Cargando áreas desde el backend...');
            const response = await conteoService.obtenerAreas();
            console.log('✅ Áreas cargadas:', response.data);
            setAreas(response.data);
        } catch (error: any) {
            console.error('❌ Error al cargar áreas:', error);
            setToastMessage('Error al cargar las áreas');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoadingAreas(false);
        }
    };

    const cargarRegistros = async () => {
        try {
            const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
            console.log('🔍 Cargando registros para fecha:', fechaFormateada);

            const response = await conteoService.obtener(fechaFormateada);
            console.log('📦 Respuesta del servidor:', response);

            const registrosFormateados = response.data.map((item: any, index: number) => ({
                _id: item._id,
                id: index + 1,
                fecha: new Date(item.fecha).toLocaleDateString('es-ES'),
                cantidad: item.cantidad,
                area: item.area,
            }));

            console.log('✅ Registros formateados:', registrosFormateados);
            setRegistros(registrosFormateados);
        } catch (error: any) {
            console.error('❌ Error al cargar registros:', error);
            console.error('Detalles del error:', error.response?.data);
        }
    };

    const handleAddRecord = async () => {
        console.log('📝 Valores actuales:', { cantidad, area });

        if (!cantidad || cantidad <= 0) {
            setToastMessage('Por favor ingresa una cantidad válida');
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        if (!area || area.trim() === '') {
            setToastMessage('Por favor selecciona un área');
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log('🚀 Enviando registro:', {
                fecha: fecha,
                area: area,
                cantidad: cantidad,
            });

            await conteoService.crear({
                fecha: fecha,
                area: area,
                cantidad: cantidad,
            });

            await cargarRegistros();

            setCantidad(undefined);
            setArea('');

            setToastMessage('Registro agregado correctamente');
            setToastColor('success');
            setShowToast(true);
            refreshData();
        } catch (error: any) {
            console.error('❌ Error al agregar:', error);
            setToastMessage(error.response?.data?.message || 'Error al agregar registro');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecord = async (id: string | undefined) => {
        if (!id) return;

        try {
            await conteoService.eliminar(id);
            await cargarRegistros();

            setToastMessage('Registro eliminado correctamente');
            setToastColor('success');
            setShowToast(true);
        } catch (error: any) {
            setToastMessage(error.response?.data?.message || 'Error al eliminar registro');
            setToastColor('danger');
            setShowToast(true);
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await Promise.all([cargarAreas(), cargarRegistros()]);
        event.detail.complete();
    };

    const fadeInVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    };

    const totalPersonas = registros.reduce((sum, reg) => sum + reg.cantidad, 0);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Agregar Registro</IonTitle>
                    <IonButtons slot="end">
                        <ThemeToggle />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="add-record-content">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="add-record-container">
                    {/* Formulario */}
                    <motion.div
                        variants={fadeInVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        <IonCard className="form-card">
                            <IonCardHeader>
                                <IonCardTitle>
                                    <FontAwesomeIcon icon={faUserPlus} /> Conteo de Personas
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="4">
                                            <IonItem lines="none" className="form-item">
                                                <IonLabel position="stacked">Fecha</IonLabel>
                                                <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                                                <IonModal keepContentsMounted={true}>
                                                    <IonDatetime
                                                        id="datetime"
                                                        presentation="date"
                                                        value={fecha}
                                                        onIonChange={(e) => {
                                                            const newFecha = e.detail.value as string;
                                                            console.log('📅 Nueva fecha:', newFecha);
                                                            setFecha(newFecha);
                                                        }}
                                                    ></IonDatetime>
                                                </IonModal>
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem lines="none" className="form-item">
                                                <IonLabel position="stacked">Área</IonLabel>
                                                <IonSelect
                                                    value={area}
                                                    placeholder="Selecciona un área"
                                                    onIonChange={(e) => {
                                                        const newArea = e.detail.value;
                                                        console.log('📍 Nueva área:', newArea);
                                                        setArea(newArea);
                                                    }}
                                                    disabled={loading || loadingAreas}
                                                >
                                                    {loadingAreas ? (
                                                        <IonSelectOption value="">Cargando...</IonSelectOption>
                                                    ) : (
                                                        areas.map((areaOption) => (
                                                            <IonSelectOption key={areaOption} value={areaOption}>
                                                                {areaOption}
                                                            </IonSelectOption>
                                                        ))
                                                    )}
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size="12" sizeMd="4">
                                            <IonItem lines="none" className="form-item">
                                                <IonLabel position="stacked">Cantidad de Personas</IonLabel>
                                                <IonInput
                                                    type="number"
                                                    value={cantidad}
                                                    placeholder="0"
                                                    onIonInput={(e) => {
                                                        const value = e.detail.value;
                                                        const numValue = value ? parseInt(value) : undefined;
                                                        console.log('🔢 Nueva cantidad:', numValue);
                                                        setCantidad(numValue);
                                                    }}
                                                    disabled={loading}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>

                                    <IonRow>
                                        <IonCol>
                                            <motion.div
                                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                            >
                                                <IonButton
                                                    expand="block"
                                                    onClick={handleAddRecord}
                                                    className="add-button"
                                                    disabled={loading || loadingAreas}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                                                            Agregando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '8px' }} />
                                                            Agregar Registro
                                                        </>
                                                    )}
                                                </IonButton>
                                            </motion.div>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>
                    </motion.div>

                    {/* Estadísticas */}
                    {registros.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <IonCard className="stats-card">
                                <IonCardContent>
                                    <div className="stats-summary">
                                        <div className="stat-item">
                                            <h3>{registros.length}</h3>
                                            <p>Registros</p>
                                        </div>
                                        <div className="stat-item">
                                            <h3>{totalPersonas}</h3>
                                            <p>Total Personas</p>
                                        </div>
                                        <div className="stat-item">
                                            <h3>{new Date(fecha).toLocaleDateString('es-ES')}</h3>
                                            <p>Fecha Seleccionada</p>
                                        </div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </motion.div>
                    )}

                    {/* Lista de Registros con Tarjetas */}
                    {registros.length > 0 && (
                        <motion.div
                            className="registros-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div className="list-header">
                                <h2>Registros del Día</h2>
                            </div>
                            {registros.map((registro, index) => (
                                <RegistroCard
                                    key={registro._id || registro.id}
                                    fecha={registro.fecha}
                                    area={registro.area}
                                    cantidad={registro.cantidad}
                                    onDelete={() => handleDeleteRecord(registro._id)}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Mensaje vacío */}
                    {registros.length === 0 && (
                        <motion.div
                            className="empty-state"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <FontAwesomeIcon icon={faUserPlus} size="3x" />
                            <h3>No hay registros</h3>
                            <p>Agrega el primer registro de conteo de personas</p>
                        </motion.div>
                    )}
                </div>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    color={toastColor}
                    position="top"
                />
            </IonContent>
        </IonPage>
    );
};

export default AddRecord;