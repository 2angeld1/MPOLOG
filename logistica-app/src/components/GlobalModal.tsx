import React from 'react';
import { IonModal, IonButton, IonButtons, IonHeader, IonContent, IonIcon } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/GlobalModal.scss';

interface GlobalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: IconDefinition;
    children: React.ReactNode;
    className?: string; // Para estilos específicos adicionales
}

/**
 * Componente Global de Modal reutilizable con diseño premium
 */
const GlobalModal: React.FC<GlobalModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    icon, 
    children, 
    className 
}) => {
    return (
        <IonModal 
            isOpen={isOpen} 
            onDidDismiss={onClose}
            className={`global-premium-modal ${className || ''}`}
        >
            <IonHeader>
                <div className="global-modal-header">
                    <h2>
                        {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '10px' }} />}
                        {title}
                    </h2>
                    <IonButtons>
                        <IonButton onClick={onClose} className="close-btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </IonButton>
                    </IonButtons>
                </div>
            </IonHeader>
            {/* Reemplazamos IonContent con un div normal para evitar problemas de altura con --height: auto */}
            <div className="global-modal-content custom-modal-scroll">
                <div className="modal-content-wrapper">
                    {children}
                </div>
                
                <div className="modal-footer-actions">
                     <IonButton 
                        expand="block" 
                        onClick={onClose}
                        color="light"
                        className="btn-cerrar-modal"
                    >
                        <FontAwesomeIcon icon={faTimes} style={{ marginRight: '8px' }} />
                        Cerrar
                    </IonButton>
                </div>
            </div>
        </IonModal>
    );
};

export default GlobalModal;
