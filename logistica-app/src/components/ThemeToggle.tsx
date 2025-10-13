import React, { useEffect, useState } from 'react';
import { IonToggle, IonIcon } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons'; // Cambia 'sun' por 'sunny'
import { motion } from 'framer-motion';
import '../styles/ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Verificar el tema inicial
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme');
        const initialDark = storedTheme ? storedTheme === 'dark' : prefersDark;

        setIsDark(initialDark);
        document.documentElement.classList.toggle('ion-palette-dark', initialDark);
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        document.documentElement.classList.toggle('ion-palette-dark', newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
    };

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
                        icon={isDark ? moon : sunny} // Cambia 'sun' por 'sunny'
                        className={isDark ? 'moon-icon' : 'sun-icon'}
                    />
                </motion.div>
            </IonToggle>
        </motion.div>
    );
};

export default ThemeToggle;