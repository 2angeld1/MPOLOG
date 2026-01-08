import { Variants } from 'framer-motion';

// Variantes comunes para contenedores
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

// Variantes comunes para elementos individuales
export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

// Variantes para logos o elementos destacados
export const logoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6
        }
    }
};

// Variantes para fade-in simple
export const fadeInVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
    },
};

// Variantes para botones con hover/tap
export const buttonHoverVariants: Variants = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
};

// Variantes para elementos que aparecen con retraso
export const staggeredItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

// Variantes para elementos que aparecen con escala
export const scaleItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4 }
    }
};