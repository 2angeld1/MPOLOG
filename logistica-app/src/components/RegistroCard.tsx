import React from 'react';
import { IonCard, IonCardContent, IonBadge, IonButton } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLocationDot, faUsers, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import '../styles/RegistroCard.scss';

interface RegistroCardProps {
    fecha: string;
    area: string;
    cantidad: number;
    onDelete?: () => void; // Ahora es opcional
    index?: number;
}

const RegistroCard: React.FC<RegistroCardProps> = ({ fecha, area, cantidad, onDelete, index = 0 }) => {
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
                            {area}
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
                            <div className="info-item highlight">
                                <FontAwesomeIcon icon={faUsers} className="info-icon" />
                                <span className="info-label">Personas:</span>
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