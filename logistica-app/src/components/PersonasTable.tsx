import React, { useState } from 'react';
import { IonSearchbar, IonButton, IonSpinner } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPhone, faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { EventoPersona } from '../../types/types';
import '../styles/PersonasTable.scss';

interface PersonasTableProps {
    personas: EventoPersona[];
    onVerDetalle: (id: string) => void;
    onEditar: (id: string) => void;
    onEliminar: (id: string) => void;
    loading?: boolean;
}

const PersonasTable: React.FC<PersonasTableProps> = ({
    personas,
    onVerDetalle,
    onEditar,
    onEliminar,
    loading = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    // Filtrar personas por búsqueda
    const filteredPersonas = personas.filter(persona => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            persona.nombre.toLowerCase().includes(term) ||
            persona.apellido.toLowerCase().includes(term) ||
            (persona.equipo && persona.equipo.toLowerCase().includes(term)) ||
            (persona.telefono && persona.telefono.includes(term))
        );
    });

    // Paginación
    const totalPages = Math.ceil(filteredPersonas.length / pageSize);
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPersonas = filteredPersonas.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    if (loading) {
        return (
            <div className="personas-table-loading">
                <IonSpinner name="crescent" />
                <p>Cargando personas...</p>
            </div>
        );
    }

    return (
        <div className="personas-table-container">
            {/* Barra de búsqueda */}
            <div className="personas-table-search">
                <IonSearchbar
                    value={searchTerm}
                    onIonInput={(e) => setSearchTerm(e.detail.value || '')}
                    placeholder="Buscar por nombre, apellido, equipo o teléfono..."
                    animated={true}
                />
            </div>

            {/* Tabla */}
            <div className="personas-table-wrapper">
                {currentPersonas.length === 0 ? (
                    <div className="personas-table-empty">
                        <p>No se encontraron personas registradas</p>
                    </div>
                ) : (
                    <table className="personas-table">
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Edad</th>
                                <th>Teléfono</th>
                                <th>Equipo</th>
                                <th>Estado de Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPersonas.map((persona) => (
                                <tr key={persona._id}>
                                    <td className="nombre-cell">
                                        {persona.nombre} {persona.apellido !== '.' ? persona.apellido : ''}
                                    </td>
                                    <td>{persona.edad} años</td>
                                    <td>
                                        {persona.telefono ? (
                                            <a href={`tel:${persona.telefono}`} className="phone-link">
                                                <FontAwesomeIcon icon={faPhone} />
                                                {persona.telefono}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td>
                                        {persona.equipo ? (
                                            <span className="equipo-badge">{persona.equipo}</span>
                                        ) : (
                                            <span className="text-muted">Sin asignar</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="payment-info">
                                            {persona.abono ? (
                                                <span className="payment-amount paid">
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    ${persona.montoAbono?.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="payment-amount pending">Pendiente</span>
                                            )}
                                            <span className="payment-method">
                                                {persona.tipoPago === 'yappy' ? 'Yappy' : 'Efectivo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Ver detalle:', persona._id);
                                                    onVerDetalle(persona._id!);
                                                }}
                                                title="Ver detalles"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Editar:', persona._id);
                                                    onEditar(persona._id!);
                                                }}
                                                title="Editar"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Eliminar:', persona._id);
                                                    onEliminar(persona._id!);
                                                }}
                                                title="Eliminar"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginación */}
            {filteredPersonas.length > 0 && (
                <div className="personas-table-pagination">
                    <div className="pagination-info">
                        Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPersonas.length)} de {filteredPersonas.length} registros
                    </div>
                    <div className="pagination-controls">
                        <IonButton
                            fill="outline"
                            size="small"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </IonButton>
                        <span className="page-number">
                            Página {currentPage + 1} de {totalPages || 1}
                        </span>
                        <IonButton
                            fill="outline"
                            size="small"
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </IonButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonasTable;
