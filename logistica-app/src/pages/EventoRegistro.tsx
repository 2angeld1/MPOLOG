import React, { useMemo, useState, useRef } from 'react';
import { IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonToast, IonSpinner, IonRefresher, IonRefresherContent, IonToggle, IonChip, IonSearchbar, IonAccordion, IonAccordionGroup, IonModal, IonButtons, IonList, IonHeader } from '@ionic/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignOutAlt, faCalendarAlt, faUsers, faPlus, faEdit, faTrash, faCheck, faTimes, faMoneyBillWave, faChartBar, faMapMarkerAlt, faChevronDown, faChevronUp, faClock, faDonate, faDollarSign, faEye, faShareAlt, faPhone, faImage, faCreditCard, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { useEventoRegistro } from '../hooks/useEventoRegistro';
import { fadeInVariant, itemVariants, buttonHoverVariants } from '../animations';
import '../styles/EventoRegistro.scss';
import Toolbar from '../components/Toolbar';
import LocationPicker from '../components/LocationPicker';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import DataTable from '../components/DataTable';
import PersonasTable from '../components/PersonasTable';
import GlobalModal from '../components/GlobalModal';
import { ColumnDef } from '@tanstack/react-table';
import { EventoPersona } from '../../types/types';

registerLocale('es', es);

const EventoRegistro: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectorAccordionValue, setSelectorAccordionValue] = useState<string | undefined>('selector');

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
        telefono,
        setTelefono,
        handleTelefonoChange,
        abono,
        setAbono,
        montoAbono,
        setMontoAbono,
        tipoPago,
        setTipoPago,
        comprobanteYappy,
        setComprobanteYappy,
        comprobantes,
        equipo,
        setEquipo,
        
        // Acciones
        handleRegistrarPersona,
        handleEditarPersona,
        handleEliminarPersona,
        handleCancelarEdicion,
        handleVerDetalle,
        handleCompartirUbicacion,
        handleUploadComprobante,
        isEditing,
        showRegistrarPersona,
        setShowRegistrarPersona,
        showDetallePersona,
        setShowDetallePersona,
        personaDetalle,
        
        // Estadísticas
        estadisticas,
        
        // Búsqueda
        searchTerm,
        setSearchTerm,
        
        // UI
        loading,
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

    const columns = useMemo<ColumnDef<EventoPersona>[]>(() => [
        {
            header: 'Nombre Completo',
            accessorFn: row => `${row.nombre} ${row.apellido !== '.' ? row.apellido : ''}`,
            cell: info => <span className="table-cell-bold">{info.getValue() as string}</span>,
        },
        {
            header: 'Edad',
            accessorKey: 'edad',
            cell: info => `${info.getValue()} años`,
        },
        {
            header: 'Teléfono',
            accessorKey: 'telefono',
            cell: info => info.getValue() ? (
                <div className="table-cell-phone">
                    <FontAwesomeIcon icon={faPhone} />
                    <a href={`tel:${info.getValue()}`}>{info.getValue() as string}</a>
                </div>
            ) : <span className="text-muted">-</span>
        },
        {
            header: 'Equipo',
            accessorKey: 'equipo',
            cell: info => info.getValue() ? (
                <span className="equipo-badge">{info.getValue() as string}</span>
            ) : (
                <span className="text-muted italic">Sin asignar</span>
            )
        },
        {
            header: 'Estado de Pago',
            id: 'estadoPago',
            cell: info => {
                const p = info.row.original;
                return (
                    <div className="table-cell-payment">
                        {p.abono ? (
                            <span className="payment-amount paid">
                                <FontAwesomeIcon icon={faCheck} />
                                ${p.montoAbono?.toFixed(2)}
                            </span>
                        ) : (
                            <span className="payment-amount pending">Pendiente</span>
                        )}
                        <span className="payment-method">
                            {p.tipoPago === 'yappy' ? 'Yappy' : 'Efectivo'}
                        </span>
                    </div>
                )
            }
        },
        {
            id: 'acciones',
            header: 'Acciones',
            cell: info => (
                <div
                    className="action-btn-group"
                    onClick={(e) => {
                        console.log('Div clicked, target:', e.target, 'currentTarget:', e.currentTarget);
                    }}
                >
                    <button
                        className="action-btn action-btn-view"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Ver detalle clicked for:', info.row.original._id);
                            handleVerDetalle(info.row.original._id!);
                        }}
                        title="Ver detalles"
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                        className="action-btn action-btn-edit"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Editar persona clicked for:', info.row.original._id);
                            handleEditarPersona(info.row.original._id!);
                        }}
                        title="Editar"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        className="action-btn action-btn-delete"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Eliminar persona clicked for:', info.row.original._id);
                            handleEliminarPersona(info.row.original._id!);
                        }}
                        title="Eliminar"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            )
        }
    ], [handleVerDetalle, handleEditarPersona, handleEliminarPersona]);


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
                        <IonAccordionGroup
                            value={selectorAccordionValue}
                            onIonChange={(e) => setSelectorAccordionValue(e.detail.value)}
                            className="selector-accordion-group"
                        >
                            <IonAccordion value="selector">
                                <IonItem slot="header" lines="none" className="selector-accordion-header">
                                    <IonLabel>
                                        <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px' }} />
                                        {eventoSeleccionado ? "Cambiar Evento" : "Selecciona un Evento"}
                                    </IonLabel>
                                </IonItem>
                                <div slot="content" className="ion-padding selector-content">
                                    <div className="evento-select-row">
                                        <IonItem lines="none" className="form-item evento-select-item">
                                            <IonLabel position="stacked">Evento Activo</IonLabel>
                                            <IonSelect
                                                value={eventoSeleccionado}
                                                placeholder={loadingEventos ? "Cargando..." : "Selecciona un evento"}
                                                onIonChange={(e) => {
                                                    setEventoSeleccionado(e.detail.value);
                                                    setSelectorAccordionValue(undefined); // Colapsar al seleccionar
                                                }}
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
                                </div>
                            </IonAccordion>
                        </IonAccordionGroup>
                    </motion.div>

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

                                            {/* Botón para compartir ubicación */}
                                            {eventoActual.ubicacion && (
                                                <motion.div variants={buttonHoverVariants} whileHover="whileHover" whileTap="whileTap">
                                                    <IonButton
                                                        expand="block"
                                                        fill="outline"
                                                        onClick={handleCompartirUbicacion}
                                                        className="share-location-btn"
                                                    >
                                                        <FontAwesomeIcon icon={faShareAlt} style={{ marginRight: '8px' }} />
                                                        Compartir Ubicación
                                                    </IonButton>
                                                </motion.div>
                                            )}
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
                                                <motion.div className="stat-card total" variants={itemVariants}>
                                                    <div className="stat-icon">
                                                        {estadisticas.totalPersonas}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Total Personas</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div className="stat-card success" variants={itemVariants}>
                                                    <div className="stat-icon">
                                                        {estadisticas.personasConAbono}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Con Abono</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div className="stat-card warning" variants={itemVariants}>
                                                    <div className="stat-icon">
                                                        {estadisticas.personasSinAbono}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Sin Abono</p>
                                                    </div>
                                                </motion.div>
                                                <motion.div className="stat-card money" variants={itemVariants}>
                                                    <div className="stat-icon">
                                                        ${estadisticas.montoTotalRecaudado.toLocaleString()}
                                                    </div>
                                                    <div className="stat-content">
                                                        <p>Recaudado</p>
                                                    </div>
                                                </motion.div>
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
                                                    <IonCol size="12" sizeMd="6">
                                                        <IonItem lines="none" className="form-item">
                                                            <IonLabel position="stacked">Teléfono *</IonLabel>
                                                            <IonInput
                                                                type="tel"
                                                                value={telefono}
                                                                placeholder="6000-0000"
                                                                onIonInput={(e) => handleTelefonoChange(e.detail.value || '')}
                                                                maxlength={9} // 8 dígitos + 1 guion
                                                            />
                                                        </IonItem>
                                                    </IonCol>
                                                    <IonCol size="12" sizeMd="6">
                                                        <IonItem lines="none" className="form-item">
                                                            <IonLabel position="stacked">Tipo de Pago</IonLabel>
                                                            <IonSelect
                                                                value={tipoPago}
                                                                onIonChange={(e) => setTipoPago(e.detail.value)}
                                                            >
                                                                <IonSelectOption value="efectivo">
                                                                    <FontAwesomeIcon icon={faDollarSign} /> Efectivo
                                                                </IonSelectOption>
                                                                <IonSelectOption value="yappy">
                                                                    <FontAwesomeIcon icon={faCreditCard} /> Yappy
                                                                </IonSelectOption>
                                                            </IonSelect>
                                                        </IonItem>
                                                    </IonCol>
                                                </IonRow>

                                                {/* Campo de comprobante si es Yappy */}
                                                {tipoPago === 'yappy' && (
                                                    <IonRow>
                                                        <IonCol size="12">
                                                            <div className="comprobante-header">
                                                                <FontAwesomeIcon icon={faImage} className="header-icon" />
                                                                <IonLabel>Comprobantes de Yappy</IonLabel>
                                                            </div>

                                                            {/* Galería de comprobantes existentes */}
                                                            {comprobantes && comprobantes.length > 0 && (
                                                                <div className="existing-proofs-section">
                                                                    <IonLabel color="medium" className="section-subtitle">Comprobantes Guardados:</IonLabel>
                                                                    <div className="proofs-grid">
                                                                        {comprobantes.map((url, idx) => (
                                                                            <div key={idx} className="proof-thumbnail">
                                                                                <img
                                                                                    src={url}
                                                                                    alt={`Comprobante ${idx + 1}`}
                                                                                    onClick={() => window.open(url, '_blank')}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <IonLabel color="medium" className="section-subtitle mt-3">Agregar Nuevo Comprobante:</IonLabel>
                                                                </div>
                                                            )}

                                                            <div className="proof-upload-section">
                                                                {!comprobanteYappy ? (
                                                                    <div
                                                                        className="upload-dropzone"
                                                                        onClick={() => fileInputRef.current?.click()}
                                                                    >
                                                                        <input
                                                                            type="file"
                                                                            ref={fileInputRef}
                                                                            accept="image/*"
                                                                            hidden
                                                                            onChange={async (e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) {
                                                                                    try {
                                                                                        const base64 = await handleUploadComprobante(file);
                                                                                        setComprobanteYappy(base64);
                                                                                    } catch (error) {
                                                                                        console.error('Error al cargar imagen:', error);
                                                                                    }
                                                                                }
                                                                            }}
                                                                        />
                                                                        <div className="upload-content">
                                                                            <div className="icon-circle">
                                                                                <FontAwesomeIcon icon={faCloudUploadAlt} />
                                                                            </div>
                                                                            <p className="upload-text">Sube tu comprobante</p>
                                                                            <span className="upload-hint">Toca para seleccionar imagen</span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <motion.div
                                                                        className="proof-preview-container premium-preview"
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                    >
                                                                        <div className="image-wrapper">
                                                                            <img
                                                                                src={comprobanteYappy}
                                                                                alt="Comprobante"
                                                                                className="proof-image"
                                                                            />
                                                                            <div className="image-overlay">
                                                                                <IonButton
                                                                                    fill="clear"
                                                                                    color="light"
                                                                                    onClick={() => setComprobanteYappy(null)}
                                                                                    title="Eliminar imagen"
                                                                                >
                                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                                </IonButton>
                                                                            </div>
                                                                        </div>
                                                                        <IonButton
                                                                            size="default"
                                                                            fill="outline"
                                                                            color="danger"
                                                                            className="delete-proof-btn-large"
                                                                            onClick={() => setComprobanteYappy(null)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrash} style={{ marginRight: '8px' }} />
                                                                            Eliminar Comprobante
                                                                        </IonButton>
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </IonCol>
                                                    </IonRow>
                                                )}

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
                                                                    <div className="loading-container">
                                                                        <IonSpinner name="crescent" />
                                                                        <span>Procesando...</span>
                                                                    </div>
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
                                    <IonCardContent className="no-padding">
                                        {loadingPersonas ? (
                                            <div className="centered-loading">
                                                <IonSpinner name="crescent" />
                                                <p>Cargando personas...</p>
                                            </div>
                                        ) : (
                                                <PersonasTable
                                                    personas={personas}
                                                    onVerDetalle={handleVerDetalle}
                                                    onEditar={handleEditarPersona}
                                                    onEliminar={handleEliminarPersona}
                                                    loading={loadingPersonas}
                                                />
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


                {/* Modal de Detalles de Persona */}
                <GlobalModal
                    isOpen={showDetallePersona}
                    onClose={() => setShowDetallePersona(false)}
                    title="Detalles del Registro"
                    icon={faUserPlus}
                >
                    {personaDetalle ? (
                        <IonList lines="none">
                            <IonItem>
                                <IonLabel>
                                    <h2>
                                        <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '8px' }} />
                                        Nombre Completo
                                    </h2>
                                    <p>{personaDetalle.nombre} {personaDetalle.apellido !== '.' ? personaDetalle.apellido : ''}</p>
                                </IonLabel>
                            </IonItem>

                            <IonItem>
                                <IonLabel>
                                    <h2>
                                        <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
                                        Edad
                                    </h2>
                                    <p>{personaDetalle.edad} años</p>
                                </IonLabel>
                            </IonItem>

                            <IonItem>
                                <IonLabel>
                                    <h2>
                                        <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                                        Teléfono
                                    </h2>
                                    <p>
                                        <a href={`tel:${personaDetalle.telefono}`}>
                                            <FontAwesomeIcon icon={faPhone} />
                                            {personaDetalle.telefono}
                                        </a>
                                    </p>
                                </IonLabel>
                            </IonItem>

                            <IonItem>
                                <IonLabel>
                                    <h2>
                                        <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '8px' }} />
                                        Tipo de Pago
                                    </h2>
                                    <div className="abono-status">
                                        {personaDetalle.tipoPago === 'yappy' ? (
                                            <span className="status-badge primary">
                                                <FontAwesomeIcon icon={faCreditCard} /> Yappy
                                            </span>
                                        ) : (
                                            <span className="status-badge success">
                                                <FontAwesomeIcon icon={faDollarSign} /> Efectivo
                                            </span>
                                        )}
                                    </div>
                                </IonLabel>
                            </IonItem>

                            {/* Sección de Comprobantes */}
                            {(personaDetalle.comprobantes && personaDetalle.comprobantes.length > 0) ? (
                                <IonItem>
                                    <IonLabel>
                                        <h2>
                                            <FontAwesomeIcon icon={faImage} style={{ marginRight: '8px' }} />
                                            Comprobantes de Pago ({personaDetalle.comprobantes.length})
                                        </h2>
                                        <div className="proofs-detail-grid">
                                            {personaDetalle.comprobantes.map((url, idx) => (
                                                <div key={idx} className="image-container">
                                                    <img
                                                        src={url}
                                                        alt={`Comprobante ${idx + 1}`}
                                                        onClick={() => window.open(url, '_blank')}
                                                    />
                                                    <p>Comprobante {idx + 1}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </IonLabel>
                                </IonItem>
                            ) : (
                                personaDetalle.comprobanteYappy && (
                                    <IonItem>
                                        <IonLabel>
                                            <h2>
                                                <FontAwesomeIcon icon={faImage} style={{ marginRight: '8px' }} />
                                                Comprobante de Pago
                                            </h2>
                                            <div className="image-container">
                                                <img
                                                    src={personaDetalle.comprobanteYappy}
                                                    alt="Comprobante"
                                                    onClick={() => window.open(personaDetalle.comprobanteYappy || undefined, '_blank')}
                                                />
                                                <p>Toca la imagen para ampliar</p>
                                            </div>
                                        </IonLabel>
                                    </IonItem>
                                    )
                            )}

                            <IonItem>
                                <IonLabel>
                                    <h2>
                                        <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
                                        Equipo
                                    </h2>
                                    <div>
                                        {personaDetalle.equipo ? (
                                            <span className="equipo-badge">{personaDetalle.equipo}</span>
                                        ) : (
                                            <span className="text-muted-italics">Sin equipo asignado</span>
                                        )}
                                    </div>
                                </IonLabel>
                            </IonItem>

                            <IonItem>
                                <IonLabel>
                                    <h2>
                                        <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: '8px' }} />
                                        Información de Abono
                                    </h2>
                                    <div className="abono-status">
                                        {personaDetalle.abono ? (
                                            <div className="flex-abono-detail">
                                                <span className="status-badge success">
                                                    <FontAwesomeIcon icon={faCheck} /> ABONADO
                                                </span>
                                                <span className="abono-amount">
                                                    ${personaDetalle.montoAbono?.toFixed(2) || '0.00'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="status-badge danger">
                                                <FontAwesomeIcon icon={faTimes} /> PENDIENTE
                                            </span>
                                        )}
                                    </div>
                                </IonLabel>
                            </IonItem>

                            {personaDetalle.createdAt && (
                                <IonItem>
                                    <IonLabel>
                                        <h2>
                                            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                                            Fecha de Registro
                                        </h2>
                                        <p className="text-muted-p">
                                            {new Date(personaDetalle.createdAt).toLocaleString('es-ES', {
                                                day: '2-digit', month: 'long', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </IonLabel>
                                </IonItem>
                            )}
                        </IonList>
                    ) : (
                        <div className="modal-empty-state">
                            No hay información disponible
                        </div>
                    )}
                </GlobalModal>

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