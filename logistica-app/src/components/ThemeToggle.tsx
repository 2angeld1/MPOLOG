import { IonToggle } from '@ionic/react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import '../styles/ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="theme-toggle-container">
            <IonToggle
                checked={isDark}
                onIonChange={toggleTheme}
                className="theme-toggle"
            >
                <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
            </IonToggle>
        </div>
    );
};

export default ThemeToggle;