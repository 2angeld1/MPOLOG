import React, { createContext, useContext, useState, useCallback } from 'react';
import { IonToast } from '@ionic/react';
import { ToastContextType } from '../../types/types';

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [color, setColor] = useState<'success' | 'danger' | 'warning' | 'primary' | 'medium'>('primary');

    const showToast = useCallback((msg: string, col: 'success' | 'danger' | 'warning' | 'primary' | 'medium' = 'primary') => {
        setMessage(msg);
        setColor(col);
        setIsOpen(true);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <IonToast
                isOpen={isOpen}
                onDidDismiss={() => setIsOpen(false)}
                message={message}
                duration={3000}
                color={color}
                position="top"
                buttons={[
                    {
                        text: 'Cerrar',
                        role: 'cancel',
                        handler: () => {
                            setIsOpen(false);
                        }
                    }
                ]}
            />
        </ToastContext.Provider>
    );
};
