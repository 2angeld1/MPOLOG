import { 
    IonPage, 
    IonContent, 
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
    IonGrid, 
    IonRow, 
    IonCol, 
    IonToast, 
    IonSpinner, 
    IonRefresher, 
    IonRefresherContent,
    IonToggle,
    IonChip,
    IonSearchbar,
    IonAccordion,
    IonAccordionGroup
} from '@ionic/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
registerLocale('es', es);
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserPlus, 
    faSignOutAlt, 
    faCalendarAlt, 
    faUsers, 
    faPlus,
    faEdit,
    faTrash,
    faCheck,
    faTimes,
    faMoneyBillWave,
    faChartBar,
    faMapMarkerAlt,
    faChevronDown,
    faChevronUp,
    faClock,
    faDonate,
    faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import { useEventoRegistro } from '../hooks/useEventoRegistro';
import { fadeInVariant, itemVariants, buttonHoverVariants } from '../animations';
import '../styles/EventoRegistro.scss';
import Toolbar from '../components/Toolbar';
import LocationPicker from '../components/LocationPicker';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const EventoRegistro: React.FC = () => {
    const {
        // Eventos
        eventos,
        eventoSeleccionado,
        setEventoSeleccionado,
        loadingEventos,
        
        // Crear evento
        showCrearEvento,
        setShowCrearEvento,
        nuevoEventoNombre,
        setNuevoEventoNombre,
        nuevoEventoTipo,
        setNuevoEventoTipo,
        nuevoEventoFechaInicio,
        setNuevoEventoFechaInicio,
        nuevoEventoFechaFin,
        setNuevoEventoFechaFin,
        nuevoEventoPrecio,
        setNuevoEventoPrecio,
        nuevoEventoDescripcion,
        setNuevoEventoDescripcion,
        handleCrearEvento,
        limpiarFormularioEvento,
        
        // Personas
        personas,
        loadingPersonas,
        
        // Formulario persona
        nombre,
        setNombre,
        apellido,
        setApellido,
        edad,
        setEdad,
        abono,
        setAbono,
        montoAbono,
        setMontoAbono,
        equipo,
        setEquipo,
        
        // Acciones
        handleRegistrarPersona,
        handleEditarPersona,
        handleEliminarPersona,
        handleCancelarEdicion,
        isEditing,
        showRegistrarPersona,
        setShowRegistrarPersona,
        
        // Estadísticas
        estadisticas,
        
        // Búsqueda
        searchTerm,
        setSearchTerm,
        
        // UI
        loading,
        showToast,
        setShowToast,
        toastMessage,
        toastColor,
        handleRefresh,

        // Ubicación
        nuevoEventoUbicacion,
        setNuevoEventoUbicacion,
        showLocationPicker,
        setShowLocationPicker,

        // Edición Evento
        handleEditarEventoClick,
        isEditingEvento,
        setIsEditingEvento,

        // Sugerencias de equipo
        equiposUnicos,
        sugerenciasEquipo,
        showEquipoSugerencias,
        setShowEquipoSugerencias,
        handleSeleccionarEquipo,
        buscarEquipoCoincidente
    } = useEventoRegistro();

    const { setToolbarTitle } = useData();
    const { logout, user } = useAuth();
    const history = useHistory();

    useIonViewWillEnter(() => {
        setToolbarTitle && setToolbarTitle('Eventos');
    });

    const handleLogout = () => {
        logout();
        history.push('/login');
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

    const eventoActual = eventos.find(e => e._id === eventoSeleccionado);

    return (
        <IonPage>
            <Toolbar title="Eventos" children={toolbarChildren} />
            <IonContent fullscreen className="evento-registro-content">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="evento-registro-container">
                    {/* Selector de Evento */}
                    <motion.div
                        variants={fadeInVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        <IonCard className="evento-selector-card">
                            <IonCardHeader>
                                <IonCardTitle>
                                    <FontAwesomeIcon icon={faCalendarAlt} /> Selecciona un Evento
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="evento-select-row">
                                    <IonItem lines="none" className="form-item evento-select-item">
                                        <IonLabel position="stacked">Evento Activo</IonLabel>
                                        <IonSelect
                                            value={eventoSeleccionado}
                                            placeholder={loadingEventos ? "Cargando..." : "Selecciona un evento"}
                                            onIonChange={(e) => setEventoSeleccionado(e.detail.value)}
                                            disabled={loadingEventos}
                                        >
                                            {eventos.map((evento) => (
                                                <IonSelectOption key={evento._id} value={evento._id}>
                                                    {evento.nombre} ({evento.tipo})
                                                </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                    <div className="action-buttons-group">
                                        <IonButton
                                            className="crear-evento-btn"
                                            fill={showCrearEvento && !isEditingEvento ? "solid" : "outline"}
                                            onClick={() => {
                                                if (showCrearEvento && isEditingEvento) {
                                                    limpiarFormularioEvento();
                                                    setShowCrearEvento(true);
                                                    setIsEditingEvento(false);
                                                } else {
                                                    setShowCrearEvento(!showCrearEvento);
                                                }
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '6px' }} />
                                            {showCrearEvento && !isEditingEvento ? 'Cancelar' : 'Nuevo Evento'}
                                        </IonButton>

                                        {eventoSeleccionado && (
                                            <IonButton
                                                className="editar-evento-btn"
                                                fill={isEditingEvento ? "solid" : "outline"}
                                                color="secondary"
                                                onClick={() => handleEditarEventoClick(eventoSeleccionado)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} style={{ marginRight: '6px' }} />
                                                Editar Evento
                                            </IonButton>
                                        )}
                                    </div>
                                </div>

                                {/* Formulario para crear/editar evento */}
                                {showCrearEvento && (
                                    <motion.div 
                                        className="crear-evento-modal"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                    >
                                        <h3>{isEditingEvento ? 'Editar Evento' : 'Crear Nuevo Evento'}</h3>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="12" sizeMd="6">
                                                    <IonItem lines="none" className="form-item">
                                                        <IonLabel position="stacked">Nombre del Evento *</IonLabel>
                                                        <IonInput
                                                            value={nuevoEventoNombre}
                                                            placeholder="Ej: Campamento Juvenil 2026"
                                                            onIonInput={(e) => setNuevoEventoNombre(e.detail.value || '')}
                                                        />
                                                    </IonItem>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="6">
                                                    <IonItem lines="none" className="form-item">
                                                        <IonLabel position="stacked">Tipo de Evento</IonLabel>
                                                        <IonSelect
                                                            value={nuevoEventoTipo}
                                                            onIonChange={(e) => setNuevoEventoTipo(e.detail.value)}
                                                        >
                                                            <IonSelectOption value="campamento">Campamento</IonSelectOption>
                                                            <IonSelectOption value="retiro">Retiro</IonSelectOption>
                                                            <IonSelectOption value="conferencia">Conferencia</IonSelectOption>
                                                            <IonSelectOption value="otro">Otro</IonSelectOption>
                                                        </IonSelect>
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size="12" sizeMd="8">
                                                    <IonItem lines="none" className="form-item date-range-picker-item">
                                                        <IonLabel position="stacked">Rango de Fechas (Inicio - Fin) *</IonLabel>
                                                        <div className="datepicker-container">
                                                            <DatePicker
                                                                selectsRange={true}
                                                                startDate={nuevoEventoFechaInicio}
                                                                endDate={nuevoEventoFechaFin}
                                                                onChange={(update) => {
                                                                    const [start, end] = update;
                                                                    setNuevoEventoFechaInicio(start);
                                                                    setNuevoEventoFechaFin(end);
                                                                }}
                                                                isClearable={true}
                                                                placeholderText="Selecciona el rango de fechas"
                                                                className="custom-datepicker"
                                                                locale={es}
                                                                dateFormat="dd/MM/yyyy"
                                                                portalId="datepicker-portal"
                                                            />
                                                        </div>
                                                    </IonItem>
                                                </IonCol>
                                                <IonCol size="12" sizeMd="4">
                                                    <IonItem lines="none" className="form-item">
                                                        <IonLabel position="stacked">Precio Total *</IonLabel>
                                                        <IonInput
                                                            type="number"
                                                            value={nuevoEventoPrecio}
                                                            placeholder="0.00"
                                                            onIonInput={(e) => setNuevoEventoPrecio(parseFloat(e.detail.value || '0'))}
                                                        />
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size="12">
                                                    <IonItem lines="none" className="form-item">
                                                        <IonLabel position="stacked">Descripción (opcional)</IonLabel>
                                                        <IonInput
                                                            value={nuevoEventoDescripcion}
                                                            placeholder="Descripción del evento..."
                                                            onIonInput={(e) => setNuevoEventoDescripcion(e.detail.value || '')}
                                                        />
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol size="12">
                                                    <div className="ubicacion-form-section">
                                                        <IonLabel position="stacked">Ubicación del Evento</IonLabel>
                                                        {nuevoEventoUbicacion ? (
                                                            <div className="ubicacion-preview-card">
                                                                <div className="ubicacion-info">
                                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="map-icon" />
                                                                    <div className="text-container">
                                                                        <p className="lugar-nombre">{nuevoEventoUbicacion.nombreLugar}</p>
                                                                        <p className="lugar-coords">{nuevoEventoUbicacion.lat.toFixed(4)}, {nuevoEventoUbicacion.lng.toFixed(4)}</p>
                                                                    </div>
                                                                </div>
                                                                <IonButton
                                                                    fill="clear"
                                                                    size="small"
                                                                    onClick={() => setShowLocationPicker(true)}
                                                                >
                                                                    Cambiar
                                                                </IonButton>
                                                            </div>
                                                        ) : (
                                                            <IonButton
                                                                expand="block"
                                                                fill="outline"
                                                                className="add-location-btn"
                                                                onClick={() => setShowLocationPicker(true)}
                                                            >
                                                                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                                                                Añadir Lugar / Mapa
                                                            </IonButton>
                                                        )}
                                                    </div>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                        <div className="modal-buttons">
                                            <IonButton 
                                                fill="outline" 
                                                color="medium"
                                                onClick={limpiarFormularioEvento}
                                            >
                                                Cancelar
                                            </IonButton>
                                            <IonButton 
                                                onClick={handleCrearEvento}
                                                disabled={loading}
                                            >
                                                {loading ? <IonSpinner name="crescent" /> : (isEditingEvento ? 'Actualizar Evento' : 'Crear Evento')}
                                            </IonButton>
                                        </div>
                                    </motion.div>
                                )}
                            </IonCardContent>
                        </IonCard>
                    </motion.div>

                    {/* Mostrar contenido solo si hay evento seleccionado */}
                    {/* Mostrar contenido solo si hay evento seleccionado */}
                    {eventoSeleccionado && (
                        <>
                            {/* Información del Evento Activo */}
                            {eventoActual && (
                                <motion.div
                                    variants={fadeInVariant}
                                    initial="hidden"
                                    animate="visible"
                                    className="evento-info-card-container"
                                >
                                    <IonCard className="evento-info-card">
                                        <IonCardContent>
                                            <div className="evento-info-grid">
                                                <div className="info-item">
                                                    <div className="icon-box date">
                                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                                    </div>
                                                    <div>
                                                        <p className="label">Fechas</p>
                                                        <p className="value">
                                                            {new Date(eventoActual.fechaInicio).toLocaleDateString('es-ES')} - {new Date(eventoActual.fechaFin).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {eventoActual.ubicacion && (
                                                    <div className="info-item">
                                                        <div className="icon-box location">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                        </div>
                                                        <div>
                                                            <p className="label">Ubicación</p>
                                                            <p className="value highlight">{eventoActual.ubicacion.nombreLugar}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {eventoActual.descripcion && (
                                                    <div className="info-item description">
                                                        <p className="value">{eventoActual.descripcion}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </IonCardContent>
                                    </IonCard>
                                </motion.div>
                            )}

                            {/* Estadísticas */}
                            {estadisticas && (
                                <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <IonCard className="stats-card">
                                        <IonCardHeader>
                                            <IonCardTitle>
                                                <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '8px' }} />
                                                Estadísticas - {eventoActual?.nombre}
                                            </IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <div className="stats-grid">
                                                <div className="stat-card total">
                                                    <div className="stat-icon">
                                                        {estadisticas.totalPersonas}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Total Personas</p>
                                                    </div>
                                                </div>
                                                <div className="stat-card success">
                                                    <div className="stat-icon">
                                                        {estadisticas.personasConAbono}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Con Abono</p>
                                                    </div>
                                                </div>
                                                <div className="stat-card warning">
                                                    <div className="stat-icon">
                                                        {estadisticas.personasSinAbono}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Sin Abono</p>
                                                    </div>
                                                </div>
                                                <div className="stat-card money">
                                                    <div className="stat-icon">
                                                        ${estadisticas.montoTotalRecaudado.toLocaleString()}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Recaudado</p>
                                                    </div>
                                                </div>
                                                <div className="stat-card danger full-width">
                                                    <div className="stat-icon">
                                                        ${estadisticas.montoPendiente.toLocaleString()}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Saldo Pendiente</p>
                                                    </div>
                                                </div>
                                            </div>


                                        </IonCardContent>
                                    </IonCard>
                                </motion.div>
                            )}

                            {/* Formulario de Registro de Persona */}
                            <motion.div
                                variants={fadeInVariant}
                                initial="hidden"
                                animate="visible"
                                className="registration-container"
                            >
                                <IonAccordionGroup
                                    className="form-accordion-group"
                                    value={showRegistrarPersona ? "registro" : undefined}
                                    onIonChange={(e) => setShowRegistrarPersona(!!e.detail.value)}
                                >
                                    <IonAccordion value="registro">
                                        <IonItem slot="header" className="form-header-item">
                                            <IonLabel>
                                                <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '10px' }} />
                                                {isEditing ? ' Editar Registro' : ' Registrar Persona'}
                                            </IonLabel>
                                        </IonItem>

                                        <div slot="content" className="form-content-wrapper">
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol size="12" sizeMd="8">
                                                        <IonItem lines="none" className="form-item">
                                                            <IonLabel position="stacked">Nombre Completo *</IonLabel>
                                                            <IonInput
                                                                value={nombre}
                                                                placeholder="Ej: Juan Pérez"
                                                                onIonInput={(e) => setNombre(e.detail.value || '')}
                                                            />
                                                        </IonItem>
                                                    </IonCol>
                                                    <IonCol size="12" sizeMd="4">
                                                        <IonItem lines="none" className="form-item">
                                                            <IonLabel position="stacked">Edad</IonLabel>
                                                            <IonInput
                                                                type="number"
                                                                value={edad}
                                                                placeholder="0"
                                                                onIonInput={(e) => setEdad(parseInt(e.detail.value || '0'))}
                                                            />
                                                        </IonItem>
                                                    </IonCol>
                                                </IonRow>
                                                <IonRow>
                                                    <IonCol size="12" sizeMd="4">
                                                        <IonItem lines="none" className="form-item toggle-item">
                                                            <IonLabel>¿Tiene Abono?</IonLabel>
                                                            <IonToggle
                                                                checked={abono}
                                                                onIonChange={(e) => setAbono(e.detail.checked)}
                                                            />
                                                        </IonItem>
                                                    </IonCol>

                                                    {abono && (
                                                        <IonCol size="12" sizeMd="4">
                                                            <IonItem lines="none" className="form-item">
                                                                <IonLabel position="stacked">Monto de Abono</IonLabel>
                                                                <IonInput
                                                                    type="number"
                                                                    value={montoAbono}
                                                                    placeholder="0.00"
                                                                    onIonInput={(e) => setMontoAbono(parseFloat(e.detail.value || '0'))}
                                                                />
                                                            </IonItem>
                                                        </IonCol>
                                                    )}

                                                    <IonCol size="12" sizeMd={abono ? "4" : "8"}>
                                                        <div className="equipo-input-container">
                                                            <IonItem lines="none" className="form-item">
                                                                <IonLabel position="stacked">Equipo (opcional)</IonLabel>
                                                                <IonInput
                                                                    value={equipo}
                                                                    placeholder="Ej: Azul, Rojo, Verde..."
                                                                    onIonInput={(e) => {
                                                                        setEquipo(e.detail.value || '');
                                                                        setShowEquipoSugerencias(true);
                                                                    }}
                                                                    onIonFocus={() => setShowEquipoSugerencias(true)}
                                                                    onIonBlur={() => setTimeout(() => setShowEquipoSugerencias(false), 200)}
                                                                />
                                                            </IonItem>

                                                            {/* Lista de sugerencias */}
                                                            {showEquipoSugerencias && sugerenciasEquipo.length > 0 && (
                                                                <div className="equipo-sugerencias">
                                                                    <p className="sugerencias-titulo">Equipos existentes:</p>
                                                                    <div className="sugerencias-lista">
                                                                        {sugerenciasEquipo.map((eq, idx) => (
                                                                            <IonChip
                                                                                key={idx}
                                                                                onClick={() => handleSeleccionarEquipo(eq)}
                                                                                className="sugerencia-chip"
                                                                            >
                                                                                {eq}
                                                                            </IonChip>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </IonCol>
                                                </IonRow>
                                                <IonRow className="ion-margin-top">
                                                    <IonCol size="12" sizeMd={isEditing ? "6" : "12"}>
                                                        <motion.div
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                            variants={buttonHoverVariants}
                                                        >
                                                            <IonButton
                                                                expand="block"
                                                                onClick={handleRegistrarPersona}
                                                                className="submit-button"
                                                                disabled={loading}
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <IonSpinner name="crescent" />
                                                                        <span style={{ marginLeft: '10px' }}>Procesando...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FontAwesomeIcon icon={isEditing ? faEdit : faUserPlus} style={{ marginRight: '8px' }} />
                                                                        {isEditing ? 'Actualizar Registro' : 'Registrar Persona'}
                                                                    </>
                                                                )}
                                                            </IonButton>
                                                        </motion.div>
                                                    </IonCol>
                                                    {isEditing && (
                                                        <IonCol size="12" sizeMd="6">
                                                            <IonButton
                                                                expand="block"
                                                                onClick={handleCancelarEdicion}
                                                                color="medium"
                                                                fill="outline"
                                                            >
                                                                Cancelar Edición
                                                            </IonButton>
                                                        </IonCol>
                                                    )}
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    </IonAccordion>
                                </IonAccordionGroup>
                            </motion.div>

                            {/* Lista de Personas */}
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <IonCard className="personas-list-card">
                                    <IonCardHeader>
                                        <IonCardTitle>
                                            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
                                            Personas Registradas ({personas.length})
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent style={{ padding: 0 }}>
                                        <div className="search-container">
                                            <IonSearchbar
                                                value={searchTerm}
                                                onIonInput={(e) => setSearchTerm(e.detail.value || '')}
                                                placeholder="Buscar por nombre, apellido o equipo..."
                                                animated={true}
                                            />
                                        </div>

                                        {loadingPersonas ? (
                                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                                <IonSpinner name="crescent" />
                                                <p>Cargando personas...</p>
                                            </div>
                                        ) : personas.length > 0 ? (
                                            <div className="personas-table-container">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                                <th>Nombre Completo</th>
                                                            <th>Edad</th>
                                                            <th>Abono</th>
                                                            <th>Monto</th>
                                                            <th>Equipo</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {personas.map((persona) => (
                                                            <tr key={persona._id}>
                                                                <td className="nombre-cell">
                                                                    {persona.nombre} {persona.apellido === '.' ? '' : persona.apellido}
                                                                </td>
                                                                <td>{persona.edad} años</td>
                                                                <td>
                                                                    <span className={`abono-badge ${persona.abono ? 'abono-si' : 'abono-no'}`}>
                                                                        <FontAwesomeIcon icon={persona.abono ? faCheck : faTimes} />
                                                                        {persona.abono ? 'Sí' : 'No'}
                                                                    </span>
                                                                </td>
                                                                <td className="monto-cell">
                                                                    ${persona.montoAbono?.toFixed(2) || '0.00'}
                                                                </td>
                                                                <td>
                                                                    {persona.equipo ? (
                                                                        <span className="equipo-badge">{persona.equipo}</span>
                                                                    ) : '-'}
                                                                </td>
                                                                <td>
                                                                    <div className="action-buttons">
                                                                        <IonButton
                                                                            size="small"
                                                                            fill="clear"
                                                                            color="primary"
                                                                            onClick={() => handleEditarPersona(persona._id!)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faEdit} />
                                                                        </IonButton>
                                                                        <IonButton
                                                                            size="small"
                                                                            fill="clear"
                                                                            color="danger"
                                                                            onClick={() => handleEliminarPersona(persona._id)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                        </IonButton>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="empty-state">
                                                <FontAwesomeIcon icon={faUsers} size="3x" />
                                                <h3>No hay personas registradas</h3>
                                                <p>Agrega la primera persona al evento usando el formulario de arriba</p>
                                            </div>
                                        )}
                                    </IonCardContent>
                                </IonCard>
                            </motion.div>
                        </>
                    )}

                    {/* Mensaje cuando no hay evento seleccionado */}
                    {!eventoSeleccionado && !showCrearEvento && (
                        <motion.div 
                            className="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} size="3x" />
                            <h3>Selecciona un Evento</h3>
                            <p>Elige un evento de la lista o crea uno nuevo para comenzar a registrar personas</p>
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
                
                {/* Modal de Mapa */}
                <LocationPicker
                    isOpen={showLocationPicker}
                    onClose={() => setShowLocationPicker(false)}
                    onSelect={(ubicacion) => setNuevoEventoUbicacion(ubicacion)}
                    initialLocation={nuevoEventoUbicacion}
                />

                {/* Portal para el calendario del datepicker */}
                <div id="datepicker-portal" />
            </IonContent>
        </IonPage>
    );
};

export default EventoRegistro;
