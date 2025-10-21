import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContextType } from '../../types/types';

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return saved ? saved === 'dark' : prefersDark;
    });

    useEffect(() => {
        // Ionic usa la clase 'dark' en el elemento HTML
        const htmlElement = document.documentElement;

        if (isDark) {
            htmlElement.classList.add('ion-palette-dark');
        } else {
            htmlElement.classList.remove('ion-palette-dark');
        }

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};