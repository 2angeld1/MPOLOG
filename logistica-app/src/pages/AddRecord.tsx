import { IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime, IonDatetimeButton, IonModal, IonGrid, IonRow, IonCol, IonToast, IonSpinner, IonRefresher, IonRefresherContent } from '@ionic/react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import RegistroCard from '../components/RegistroCard';
import { useAddRecord } from '../hooks/useAddRecord';
import { fadeInVariant } from '../animations';
import '../styles/AddRecord.scss';
import Toolbar from '../components/Toolbar';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Agrega si no está

const AddRecord: React.FC = () => {
    const { fecha, setFecha, cantidad, setCantidad, area, setArea, tipo, setTipo, subArea, setSubArea, iglesia, setIglesia, registros, showToast, setShowToast, toastMessage, toastColor, loading, loadingAreas, tipoVista, setTipoVista, iglesias, loadingIglesias, areasPersonas, areasMateriales, loadingAreasPersonas, loadingAreasMateriales, totalCantidad, handleAddRecord, handleDeleteRecord, handleRefresh } = useAddRecord();
    const { toolbarTitle, setToolbarTitle } = useData();
    const { logout, user } = useAuth();
    const history = useHistory(); // Agrega

    useIonViewWillEnter(() => {
        setToolbarTitle && setToolbarTitle('Agregar');
    });

    const handleLogout = () => {
        logout();
        history.push('/login'); // Agrega redirección
    };

    const toolbarChildren = (
        <>
            <div className="user-greeting">Hola, {user?.nombre || 'Usuario'}</div>
            <IonButton onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="button-text">Salir</span>
            </IonButton>
        </>
    );

    return (
        <IonPage>
            <Toolbar title={toolbarTitle} children={toolbarChildren} />
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
                                            setIglesia(newIglesia);
                                            setArea('');
                                            setSubArea('');
                                        }}
                                        disabled={loadingIglesias}
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
                                            setTipoVista(newTipo);
                                            setTipo(newTipo);
                                            setArea('');
                                            setSubArea('');
                                        }}
                                        disabled={!iglesia}
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
                                                        disabled={loading || loadingAreasPersonas}
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
                                <h2>Registros del Día ({tipoVista === 'personas' ? 'Personas' : 'Materiales'}) - {iglesia}</h2>
                            </div>
                            {registros.map((registro, index) => (
                                <RegistroCard
                                    key={registro._id || registro.id}
                                    fecha={registro.fecha}
                                    iglesia={registro.iglesia}
                                    area={registro.area}
                                    subArea={registro.subArea}
                                    tipo={tipoVista}
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