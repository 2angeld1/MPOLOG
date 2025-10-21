import React from 'react';
import { IonCard, IonCardContent, IonBadge, IonButton } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLocationDot, faUsers, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import type { RegistroCardProps } from '../../types/types';
import '../styles/RegistroCard.scss';

const RegistroCard: React.FC<RegistroCardProps> = ({ fecha, iglesia, area, subArea, tipo, cantidad, onDelete, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <IonCard className="registro-card">
                <IonCardContent>
                    <div className="registro-header">
                        <IonBadge color="primary" className="area-badge">
                            {iglesia} - {area} {/* Muestra iglesia y área fija para ambos tipos */}
                        </IonBadge>
                        {onDelete && (
                            <IonButton fill="clear" color="danger" size="small" onClick={onDelete}>
                                <FontAwesomeIcon icon={faTrash} />
                            </IonButton>
                        )}
                    </div>
                    <div className="registro-body">
                        <div className="registro-info">
                            <div className="info-item">
                                <FontAwesomeIcon icon={faCalendar} className="info-icon" />
                                <span className="info-label">Fecha:</span>
                                <span className="info-value">{fecha}</span>
                            </div>
                            <div className="info-item">
                                <FontAwesomeIcon icon={faLocationDot} className="info-icon" />
                                <span className="info-label">Área:</span>
                                <span className="info-value">{area}</span>
                            </div>
                            {tipo === 'materiales' && subArea && (
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faTrash} className="info-icon" /> {/* Usa un icono apropiado, e.g., faBox para objeto */}
                                    <span className="info-label">Objeto:</span>
                                    <span className="info-value">{subArea}</span>
                                </div>
                            )}
                            <div className="info-item highlight">
                                <FontAwesomeIcon icon={faUsers} className="info-icon" />
                                <span className="info-label">Cantidad:</span>
                                <span className="info-value cantidad">{cantidad}</span>
                            </div>
                        </div>
                    </div>
                </IonCardContent>
            </IonCard>
        </motion.div>
    );
};

export default RegistroCard;