import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/react';
import ThemeToggle from './ThemeToggle';
import '../styles/Toolbar.scss';

interface ToolbarProps {
    title: string;
    children?: React.ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({ title, children }) => {
    return (
        <IonHeader slot="fixed" style={{ zIndex: 1000 }}>
            <IonToolbar>
                <IonTitle>{title}</IonTitle>
                <IonButtons slot="end">
                    {children}
                    <ThemeToggle />
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default Toolbar;