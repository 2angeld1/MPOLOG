import React from 'react';
import { IonToggle, IonIcon } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.div
            className="theme-toggle-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <IonToggle
                checked={isDark}
                onIonChange={toggleTheme}
                className="theme-toggle"
                aria-label="Cambiar tema"
            >
                <motion.div
                    className="toggle-icon"
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <IonIcon
                        icon={isDark ? moon : sunny}
                        className={isDark ? 'moon-icon' : 'sun-icon'}
                    />
                </motion.div>
            </IonToggle>
        </motion.div>
    );
};

export default ThemeToggle;
