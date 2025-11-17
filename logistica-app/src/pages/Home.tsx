import { IonPage, IonContent, IonButton, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonSpinner, IonRefresher, IonRefresherContent, IonBadge, IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/react';
import ThemeToggle from '../components/ThemeToggle';
import DataTable from '../components/DataTable';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarAlt, faChartLine, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ColumnDef } from '@tanstack/react-table';
import '../styles/Home.scss';
import { useHome } from '../hooks/useHome';
import { Registro } from '../../types/types';
import { containerVariants, itemVariants } from '../animations';
import Toolbar from '../components/Toolbar';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom'; // Agrega si no está

const Home: React.FC = () => {
    const { estadisticasPersonas, estadisticasMateriales, registrosPersonas, registrosMateriales, loading, history: historyProp, handleRefresh } = useHome();
    const { toolbarTitle } = useData();
    const { logout, user } = useAuth();
    const history = useHistory(); // Agrega

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

    // Columnas para personas
    const columnsPersonas: ColumnDef<Registro>[] = [
        {
            accessorKey: 'fecha',
            header: 'Fecha',
            cell: (info) => {
                const fecha = new Date(info.getValue() as string);
                return (
                    <span className="fecha-cell">
                        {fecha.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                );
            },
        },
        {
            accessorKey: 'iglesia',
            header: 'Iglesia',
            cell: (info) => (
                <IonBadge color="success" className="iglesia-badge">
                    {info.getValue() as string}
                </IonBadge>
            ),
        },
        {
            accessorKey: 'area',
            header: 'Área',
            cell: (info) => (
                <IonBadge color="primary" className="area-badge">
                    {info.getValue() as string}
                </IonBadge>
            ),
        },
        {
            accessorKey: 'cantidad',
            header: 'Cantidad',
            cell: (info) => (
                <span className="cantidad-cell">
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px', color: 'var(--ion-color-primary)' }} />
                    <strong>{info.getValue() as number}</strong>
                </span>
            ),
        },
    ];

    // Columnas para materiales (agrega subArea)
    const columnsMateriales: ColumnDef<Registro>[] = [
        {
            accessorKey: 'fecha',
            header: 'Fecha',
            cell: (info) => {
                const fecha = new Date(info.getValue() as string);
                return (
                    <span className="fecha-cell">
                        {fecha.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                );
            },
        },
        {
            accessorKey: 'iglesia',
            header: 'Iglesia',
            cell: (info) => (
                <IonBadge color="success" className="iglesia-badge">
                    {info.getValue() as string}
                </IonBadge>
            ),
        },
        {
            accessorKey: 'area',
            header: 'Área',
            cell: (info) => (
                <IonBadge color="primary" className="area-badge">
                    {info.getValue() as string}
                </IonBadge>
            ),
        },
        {
            accessorKey: 'subArea',
            header: 'Objeto',
            cell: (info) => (
                <IonBadge color="secondary" className="subarea-badge">
                    {info.getValue() as string || 'N/A'}
                </IonBadge>
            ),
        },
        {
            accessorKey: 'cantidad',
            header: 'Cantidad',
            cell: (info) => (
                <span className="cantidad-cell">
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px', color: 'var(--ion-color-primary)' }} />
                    <strong>{info.getValue() as number}</strong>
                </span>
            ),
        },
    ];

    // Generar statsData para personas
    const statsDataPersonas = estadisticasPersonas ? [
        {
            id: 1,
            title: 'Total Personas',
            value: estadisticasPersonas.totalPersonas || 0,
            icon: faUsers,
            color: 'primary'
        },
        {
            id: 2,
            title: 'Promedio',
            value: Math.round(estadisticasPersonas.promedioPersonas || 0),
            icon: faChartLine,
            color: 'secondary'
        },
        {
            id: 3,
            title: 'Registros',
            value: estadisticasPersonas.totalRegistros || 0,
            icon: faCalendarAlt,
            color: 'tertiary'
        },
    ] : [];

    // Generar statsData para materiales
    const statsDataMateriales = estadisticasMateriales ? [
        {
            id: 1,
            title: 'Total Materiales',
            value: estadisticasMateriales.totalPersonas || 0,
            icon: faUsers,
            color: 'primary'
        },
        {
            id: 2,
            title: 'Promedio',
            value: Math.round(estadisticasMateriales.promedioPersonas || 0),
            icon: faChartLine,
            color: 'secondary'
        },
        {
            id: 3,
            title: 'Registros',
            value: estadisticasMateriales.totalRegistros || 0,
            icon: faCalendarAlt,
            color: 'tertiary'
        },
    ] : [];

    return (
        <IonPage>
            <Toolbar title={toolbarTitle} children={toolbarChildren} />
            <IonContent fullscreen className="dashboard-content">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                {loading ? (
                    <div className="loading-container">
                        <IonSpinner name="crescent" />
                        <p>Cargando datos...</p>
                    </div>
                ) : (
                    <motion.div
                        className="dashboard-container"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Accordiones para Personas y Materiales */}
                        <IonAccordionGroup value="personas">
                            {/* Sección Personas */}
                            <IonAccordion value="personas">
                                <IonItem slot="header" color="light">
                                    <IonLabel>Conteo de Personas</IonLabel>
                                </IonItem>
                                <div slot="content">
                                    {/* Stats Cards para Personas */}
                                    {estadisticasPersonas && (
                                        <IonGrid>
                                            <IonRow>
                                                {statsDataPersonas.map((stat) => (
                                                    <IonCol size="12" sizeMd="4" key={stat.id}>
                                                        <IonCard className={`stat-card stat-card-${stat.color}`}>
                                                            <IonCardContent>
                                                                <div className="stat-content">
                                                                    <div className="stat-icon">
                                                                        <FontAwesomeIcon icon={stat.icon} />
                                                                    </div>
                                                                    <div className="stat-info">
                                                                        <h3>{stat.value.toLocaleString()}</h3>
                                                                        <p>{stat.title}</p>
                                                                    </div>
                                                                </div>
                                                            </IonCardContent>
                                                        </IonCard>
                                                    </IonCol>
                                                ))}
                                            </IonRow>
                                        </IonGrid>
                                    )}

                                    {/* Registros por Área para Personas */}
                                    {estadisticasPersonas && estadisticasPersonas.registrosPorArea && estadisticasPersonas.registrosPorArea.length > 0 && (
                                        <div className="area-section">
                                            <IonCard className="area-card">
                                                <IonCardHeader>
                                                    <IonCardTitle>Personas por Área (Últimos 30 días)</IonCardTitle>
                                                </IonCardHeader>
                                                <div className="area-grid">
                                                    {estadisticasPersonas.registrosPorArea.map((area, index) => (
                                                        <motion.div
                                                            key={index}
                                                            className="area-item"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <div className="area-name">{area.area}</div>
                                                            <div className="area-stats">
                                                                <div className="area-count">
                                                                    <FontAwesomeIcon icon={faUsers} />
                                                                    <span>{area.totalPersonas}</span>
                                                                </div>
                                                                <div className="area-registros">
                                                                    {area.cantidad} registros
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </IonCard>
                                        </div>
                                    )}

                                    {/* Tabla de Registros para Personas */}
                                    {registrosPersonas.length > 0 && (
                                        <div className="table-section">
                                            <IonCard className="data-table-card">
                                                <IonCardHeader>
                                                    <IonCardTitle>
                                                        <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px' }} />
                                                        Historial de Registros de Personas
                                                    </IonCardTitle>
                                                </IonCardHeader>
                                                <IonCardContent>
                                                    <DataTable data={registrosPersonas} columns={columnsPersonas} />
                                                </IonCardContent>
                                            </IonCard>
                                        </div>
                                    )}
                                </div>
                            </IonAccordion>

                            {/* Sección Materiales */}
                            <IonAccordion value="materiales">
                                <IonItem slot="header" color="light">
                                    <IonLabel>Conteo de Materiales (Utensilios)</IonLabel>
                                </IonItem>
                                <div slot="content">
                                    {/* Stats Cards para Materiales */}
                                    {estadisticasMateriales && (
                                        <IonGrid>
                                            <IonRow>
                                                {statsDataMateriales.map((stat) => (
                                                    <IonCol size="12" sizeMd="4" key={stat.id}>
                                                        <IonCard className={`stat-card stat-card-${stat.color}`}>
                                                            <IonCardContent>
                                                                <div className="stat-content">
                                                                    <div className="stat-icon">
                                                                        <FontAwesomeIcon icon={stat.icon} />
                                                                    </div>
                                                                    <div className="stat-info">
                                                                        <h3>{stat.value.toLocaleString()}</h3>
                                                                        <p>{stat.title}</p>
                                                                    </div>
                                                                </div>
                                                            </IonCardContent>
                                                        </IonCard>
                                                    </IonCol>
                                                ))}
                                            </IonRow>
                                        </IonGrid>
                                    )}

                                    {/* Registros por Área para Materiales */}
                                    {estadisticasMateriales && estadisticasMateriales.registrosPorArea && estadisticasMateriales.registrosPorArea.length > 0 && (
                                        <div className="area-section">
                                            <IonCard className="area-card">
                                                <IonCardHeader>
                                                    <IonCardTitle>Materiales por Área (Últimos 30 días)</IonCardTitle>
                                                </IonCardHeader>
                                                <div className="area-grid">
                                                    {estadisticasMateriales.registrosPorArea.map((area, index) => (
                                                        <motion.div
                                                            key={index}
                                                            className="area-item"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <div className="area-name">{area.area}</div>
                                                            <div className="area-stats">
                                                                <div className="area-count">
                                                                    <FontAwesomeIcon icon={faUsers} />
                                                                    <span>{area.totalPersonas}</span>
                                                                </div>
                                                                <div className="area-registros">
                                                                    {area.cantidad} registros
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </IonCard>
                                        </div>
                                    )}

                                    {/* Tabla de Registros para Materiales */}
                                    {registrosMateriales.length > 0 && (
                                        <div className="table-section">
                                            <IonCard className="data-table-card">
                                                <IonCardHeader>
                                                    <IonCardTitle>
                                                        <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px' }} />
                                                        Historial de Registros de Materiales
                                                    </IonCardTitle>
                                                </IonCardHeader>
                                                <IonCardContent>
                                                    <DataTable data={registrosMateriales} columns={columnsMateriales} />
                                                </IonCardContent>
                                            </IonCard>
                                        </div>
                                    )}
                                </div>
                            </IonAccordion>
                        </IonAccordionGroup>

                        {/* Estado vacío si no hay datos en ninguna sección */}
                        {!loading && (!estadisticasPersonas || estadisticasPersonas.totalRegistros === 0) && (!estadisticasMateriales || estadisticasMateriales.totalRegistros === 0) && (
                            <motion.div
                                variants={itemVariants}
                                className="empty-state"
                            >
                                <FontAwesomeIcon icon={faUsers} size="3x" />
                                <h3>No hay datos disponibles</h3>
                                <p>Comienza agregando registros de conteo de personas o materiales</p>
                                <IonButton onClick={() => historyProp.push('/tabs/add')}>
                                    Agregar Registro
                                </IonButton>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Home;
