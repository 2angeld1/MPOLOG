import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IonIcon } from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import '../styles/UserStatusBubble.scss';

const UserStatusBubble: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    const getRoleColors = (role: string) => {
        switch (role.toLowerCase()) {
            case 'superadmin': return { bg: '#ff4d4d', text: '#ffffff' };
            case 'logisticadmin': return { bg: '#3880ff', text: '#ffffff' };
            case 'eventsadmin': return { bg: '#2dd36f', text: '#ffffff' };
            case 'sameadmin': return { bg: '#ffc409', text: '#000000' }; // Dark text for yellow
            default: return { bg: '#92949c', text: '#ffffff' };
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const roleColors = getRoleColors(user.rol);

    return (
        <AnimatePresence>
            <motion.div 
                className="user-status-bubble-container"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="bubble-content">
                    <div className="user-avatar">
                        {getInitials(user.nombre)}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user.nombre}</span>
                        <div 
                            className="role-tag" 
                            style={{ 
                                backgroundColor: roleColors.bg,
                                color: roleColors.text
                            }}
                        >
                            <span className="role-dot" style={{ backgroundColor: roleColors.text }} />
                            {user.rol}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserStatusBubble;
