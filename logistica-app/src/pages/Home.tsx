import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonBadge,
} from '@ionic/react';
import ThemeToggle from '../components/ThemeToggle';
import DataTable from '../components/DataTable';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarAlt, faChartLine, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { conteoService } from '../services/api';
import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import '../styles/Home.scss';
import '../styles/Toolbar.scss';

interface Estadisticas {
    totalRegistros: number;
    totalPersonas: number;
    promedioPersonas: number;
    registrosPorArea: {
        area: string;
        cantidad: number;
        totalPersonas: number;
    }[];
}

interface Registro {
    _id: string;
    fecha: string;
    area: string;
    cantidad: number;
}

const Home: React.FC = () => {
    const history = useHistory();
    const { logout, user } = useAuth();
    const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
    const [registrosRecientes, setRegistrosRecientes] = useState<Registro[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // Obtener estadísticas
            const fechaHoy = new Date().toISOString().split('T')[0];
            const fechaInicio = new Date();
            fechaInicio.setDate(fechaInicio.getDate() - 30);
            const fechaInicioStr = fechaInicio.toISOString().split('T')[0];

            const statsResponse = await conteoService.obtenerEstadisticas(fechaInicioStr, fechaHoy);
            setEstadisticas(statsResponse.data);

            // Obtener todos los registros para la tabla
            const registrosResponse = await conteoService.obtener();
            const registrosOrdenados = registrosResponse.data
                .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            setRegistrosRecientes(registrosOrdenados);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await cargarDatos();
        event.detail.complete();
    };

    const handleLogout = () => {
        logout(); // Ya redirige a /login
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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

    // Definir columnas para la tabla
    const columns: ColumnDef<Registro>[] = [
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
            header: 'Cantidad Personas',
            cell: (info) => (
                <span className="cantidad-cell">
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px', color: 'var(--ion-color-primary)' }} />
                    <strong>{info.getValue() as number}</strong>
                </span>
            ),
        },
    ];

    // Generar statsData solo si estadisticas no es null
    const statsData = estadisticas ? [
        {
            id: 1,
            title: 'Total Personas',
            value: estadisticas.totalPersonas || 0,
            icon: faUsers,
            color: 'primary'
        },
        {
            id: 2,
            title: 'Promedio',
            value: Math.round(estadisticas.promedioPersonas || 0),
            icon: faChartLine,
            color: 'secondary'
        },
        {
            id: 3,
            title: 'Registros',
            value: estadisticas.totalRegistros || 0,
            icon: faCalendarAlt,
            color: 'tertiary'
        },
    ] : [];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot="start">MPOLOG</IonTitle>
                    <IonButtons slot="end">
                        <div className="user-greeting">
                            Hola, {user?.nombre || 'Usuario'}
                        </div>
                        <ThemeToggle />
                        <IonButton onClick={handleLogout} className="logout-button">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span className="button-text">Salir</span>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
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
                        {/* Stats Cards */}
                        {estadisticas && (
                            <IonGrid>
                                <IonRow>
                                    {statsData.map((stat) => (
                                        <IonCol size="12" sizeMd="4" key={stat.id}>
                                            <motion.div variants={itemVariants}>
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
                                            </motion.div>
                                        </IonCol>
                                    ))}
                                </IonRow>
                            </IonGrid>
                        )}

                        {/* Registros por Área */}
                        {estadisticas && estadisticas.registrosPorArea && estadisticas.registrosPorArea.length > 0 && (
                            <motion.div variants={itemVariants} className="area-section">
                                <IonCard className="area-card">
                                    <IonCardHeader>
                                        <IonCardTitle>Personas por Área (Últimos 30 días)</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <div className="area-grid">
                                            {estadisticas.registrosPorArea.map((area, index) => (
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
                                    </IonCardContent>
                                </IonCard>
                            </motion.div>
                        )}

                        {/* Tabla de Registros */}
                        {registrosRecientes.length > 0 && (
                            <motion.div variants={itemVariants} className="table-section">
                                <IonCard className="data-table-card">
                                    <IonCardHeader>
                                        <IonCardTitle>
                                            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px' }} />
                                            Historial de Registros
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <DataTable data={registrosRecientes} columns={columns} />
                                    </IonCardContent>
                                </IonCard>
                            </motion.div>
                        )}

                        {/* Estado vacío */}
                        {!loading && (!estadisticas || estadisticas.totalRegistros === 0) && (
                            <motion.div
                                variants={itemVariants}
                                className="empty-state"
                            >
                                <FontAwesomeIcon icon={faUsers} size="3x" />
                                <h3>No hay datos disponibles</h3>
                                <p>Comienza agregando registros de conteo de personas</p>
                                <IonButton onClick={() => history.push('/tabs/add')}>
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
