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
    iglesia: string; // Nuevo campo
    cantidad: number;
    area: string;
    subArea?: string; // Agrega subArea como opcional
}

const AddRecord: React.FC = () => {
    const [fecha, setFecha] = useState<string>(new Date().toISOString());
    const [cantidad, setCantidad] = useState<number | undefined>(undefined);
    const [area, setArea] = useState<string>('');
    const [tipo, setTipo] = useState<'personas' | 'materiales'>('personas'); // Agrega tipo
    const [subArea, setSubArea] = useState<string>(''); // Agrega subArea
    const [iglesia, setIglesia] = useState<string>(''); // Nuevo estado para iglesia
    const [areas, setAreas] = useState<string[]>([]);
    const [registros, setRegistros] = useState<PersonaRegistro[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
    const [loading, setLoading] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const { refreshData } = useData(); // Agrega hook
    const [tipoVista, setTipoVista] = useState<'personas' | 'materiales'>('personas'); // Estado para el tipo de vista

    const [iglesias, setIglesias] = useState<string[]>([]); // Cambia a estado
    const [loadingIglesias, setLoadingIglesias] = useState(true); // Nuevo estado para loading

    const [areasPersonas, setAreasPersonas] = useState<string[]>([]);
    const [areasMateriales, setAreasMateriales] = useState<string[]>([]);
    const [loadingAreasPersonas, setLoadingAreasPersonas] = useState(true);
    const [loadingAreasMateriales, setLoadingAreasMateriales] = useState(true);

    // Cargar iglesias y áreas al montar el componente
    useEffect(() => {
        cargarIglesias();
        cargarAreasPersonas();
        cargarAreasMateriales();
    }, []);

    // Cargar registros cuando cambia la fecha, iglesia o el tipo de vista
    useEffect(() => {
        cargarRegistros();
    }, [fecha, iglesia, tipoVista]); // Agrega iglesia

    const cargarIglesias = async () => {
        setLoadingIglesias(true);
        try {
            console.log('🏛️ Cargando iglesias desde el backend...');
            const response = await conteoService.obtenerIglesias();
            console.log('✅ Iglesias cargadas:', response.data);
            setIglesias(response.data);
        } catch (error: any) {
            console.error('❌ Error al cargar iglesias:', error);
            setToastMessage('Error al cargar las iglesias');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoadingIglesias(false);
        }
    };

    const cargarAreasPersonas = async () => {
        setLoadingAreasPersonas(true);
        try {
            console.log('📍 Cargando áreas de personas desde el backend...');
            const response = await conteoService.obtenerAreas('personas');
            console.log('✅ Áreas de personas cargadas:', response.data);
            setAreasPersonas(response.data);
        } catch (error: any) {
            console.error('❌ Error al cargar áreas de personas:', error);
            setToastMessage('Error al cargar las áreas de personas');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoadingAreasPersonas(false);
        }
    };

    const cargarAreasMateriales = async () => {
        setLoadingAreasMateriales(true);
        try {
            console.log('📍 Cargando áreas de materiales desde el backend...');
            const response = await conteoService.obtenerAreas('materiales');
            console.log('✅ Áreas de materiales cargadas:', response.data);
            setAreasMateriales(response.data);
        } catch (error: any) {
            console.error('❌ Error al cargar áreas de materiales:', error);
            setToastMessage('Error al cargar las áreas de materiales');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setLoadingAreasMateriales(false);
        }
    };

    const cargarRegistros = async () => {
        try {
            const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
            console.log('🔍 Cargando registros para fecha:', fechaFormateada, 'iglesia:', iglesia, 'tipo:', tipoVista);

            const response = await conteoService.obtener(fechaFormateada, iglesia, tipoVista); // Filtra por iglesia
            console.log('📦 Respuesta del servidor:', response);

            const registrosFormateados = response.data.map((item: any, index: number) => ({
                _id: item._id,
                id: index + 1,
                fecha: new Date(item.fecha).toLocaleDateString('es-ES'),
                iglesia: item.iglesia, // Nuevo campo
                cantidad: item.cantidad,
                area: item.area, // Siempre item.area (área fija para materiales, subárea para personas)
                subArea: item.subArea, // Siempre item.subArea (objeto para materiales, opcional para personas)
            }));

            console.log('✅ Registros formateados:', registrosFormateados);
            setRegistros(registrosFormateados);
        } catch (error: any) {
            console.error('❌ Error al cargar registros:', error);
            console.error('Detalles del error:', error.response?.data);
        }
    };

    const handleAddRecord = async () => {
        console.log('📝 Valores actuales:', { cantidad, area, iglesia });

        if (!iglesia || iglesia.trim() === '') {
            setToastMessage('Por favor selecciona una iglesia');
            setToastColor('danger');
            setShowToast(true);
            return;
        }

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

        if (tipo === 'materiales' && !subArea) {
            setToastMessage('Por favor selecciona una sub-área para materiales');
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            console.log('🚀 Enviando registro:', {
                fecha: fecha,
                iglesia: iglesia, // Nuevo campo
                area: area,
                cantidad: cantidad,
                tipo: tipo,
                subArea: subArea,
            });

            await conteoService.crear({
                fecha: fecha,
                iglesia: iglesia, // Nuevo campo
                area: area,
                cantidad: cantidad,
                tipo: tipo,
                subArea: subArea,
            });

            await cargarRegistros();

            setCantidad(undefined);
            setArea('');
            setSubArea('');
            // No resetear iglesia, para mantener selección

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
        await cargarRegistros(); // Solo recarga registros, ya que áreas no cambian
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

    const totalCantidad = registros.reduce((sum, reg) => sum + reg.cantidad, 0); // Cambia a totalCantidad

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
                    {/* Selector de Iglesia */}
                    <motion.div
                        variants={fadeInVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        <IonCard className="iglesia-selector-card">
                            <IonCardHeader>
                                <IonCardTitle>Selecciona Iglesia</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonItem lines="none">
                                    <IonLabel position="stacked">Iglesia</IonLabel>
                                    <IonSelect
                                        value={iglesia}
                                        placeholder={loadingIglesias ? "Cargando..." : "Selecciona una iglesia"}
                                        onIonChange={(e) => {
                                            const newIglesia = e.detail.value;
                                            console.log('🏛️ Nueva iglesia:', newIglesia);
                                            setIglesia(newIglesia);
                                            setArea('');
                                            setSubArea('');
                                        }}
                                        disabled={loadingIglesias} // Deshabilita mientras carga
                                    >
                                        {loadingIglesias ? (
                                            <IonSelectOption value="">Cargando...</IonSelectOption>
                                        ) : (
                                            iglesias.map((iglesiaOption) => (
                                                <IonSelectOption key={iglesiaOption} value={iglesiaOption}>
                                                    {iglesiaOption}
                                                </IonSelectOption>
                                            ))
                                        )}
                                    </IonSelect>
                                </IonItem>
                            </IonCardContent>
                        </IonCard>
                    </motion.div>

                    {/* Selector Principal de Tipo */}
                    <motion.div
                        variants={fadeInVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        <IonCard className="tipo-selector-card">
                            <IonCardHeader>
                                <IonCardTitle>Selecciona Tipo de Conteo</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonItem lines="none">
                                    <IonLabel position="stacked">Tipo</IonLabel>
                                    <IonSelect
                                        value={tipoVista}
                                        onIonChange={(e) => {
                                            const newTipo = e.detail.value as 'personas' | 'materiales';
                                            console.log('📝 Nuevo tipo de vista:', newTipo);
                                            setTipoVista(newTipo);
                                            setTipo(newTipo); // Sincroniza con el formulario
                                            setArea('');
                                            setSubArea('');
                                        }}
                                        disabled={!iglesia} // Deshabilita si no hay iglesia seleccionada
                                    >
                                        <IonSelectOption value="personas">Conteo de Personas</IonSelectOption>
                                        <IonSelectOption value="materiales">Conteo de Materiales</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCardContent>
                        </IonCard>
                    </motion.div>

                    {/* Formulario Condicional - Solo mostrar si iglesia y tipoVista están seleccionados */}
                    {iglesia && tipoVista === 'personas' ? (
                        // Formulario para Personas
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
                                                        disabled={loading || loadingAreasPersonas}
                                                    >
                                                        {loadingAreasPersonas ? (
                                                            <IonSelectOption value="">Cargando...</IonSelectOption>
                                                        ) : (
                                                            areasPersonas.map((areaOption) => (
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
                    ) : iglesia && tipoVista === 'materiales' ? (
                        // Formulario para Materiales
                        <motion.div
                            variants={fadeInVariant}
                            initial="hidden"
                            animate="visible"
                        >
                            <IonCard className="form-card">
                                <IonCardHeader>
                                    <IonCardTitle>
                                        <FontAwesomeIcon icon={faUserPlus} /> Conteo de Materiales (Utensilios)
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
                                                        disabled={loading || loadingAreasMateriales}
                                                    >
                                                        {loadingAreasMateriales ? (
                                                            <IonSelectOption value="">Cargando...</IonSelectOption>
                                                        ) : (
                                                            areasMateriales.map((areaOption) => (
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
                                                    <IonLabel position="stacked">Sub-Área (Objeto)</IonLabel>
                                                    <IonInput
                                                        type="text"
                                                        value={subArea}
                                                        placeholder="Ej. juguetes, biblias, etc."
                                                        onIonInput={(e) => {
                                                            const value = e.detail.value;
                                                            console.log('📍 Nueva sub-área:', value);
                                                            setSubArea(value || '');
                                                        }}
                                                        disabled={loading}
                                                    ></IonInput>
                                                </IonItem>
                                            </IonCol>
                                        </IonRow>

                                        <IonRow>
                                            <IonCol size="12" sizeMd="4">
                                                <IonItem lines="none" className="form-item">
                                                    <IonLabel position="stacked">Cantidad</IonLabel>
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
                                                        disabled={loading}
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
                    ) : null}

                    {/* Estadísticas Condicionales */}
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
                                            <h3>{totalCantidad}</h3>
                                            <p>Total {tipoVista === 'personas' ? 'Personas' : 'Materiales'}</p>
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

                    {/* Lista de Registros Condicionales */}
                    {registros.length > 0 && (
                        <motion.div
                            className="registros-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div className="list-header">
                                <h2>Registros del Día ({tipoVista === 'personas' ? 'Personas' : 'Materiales'}) - {iglesia}</h2> {/* Agrega iglesia al título */}
                            </div>
                            {registros.map((registro, index) => (
                                <RegistroCard
                                    key={registro._id || registro.id}
                                    fecha={registro.fecha}
                                    iglesia={registro.iglesia}
                                    area={registro.area}
                                    subArea={registro.subArea} // Nuevo
                                    tipo={tipoVista} // Nuevo
                                    cantidad={registro.cantidad}
                                    onDelete={() => handleDeleteRecord(registro._id)}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Mensaje vacío Condicional */}
                    {registros.length === 0 && (
                        <motion.div
                            className="empty-state"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <FontAwesomeIcon icon={faUserPlus} size="3x" />
                            <h3>No hay registros</h3>
                            <p>Agrega el primer registro de conteo de {tipoVista === 'personas' ? 'personas' : 'materiales'}</p>
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