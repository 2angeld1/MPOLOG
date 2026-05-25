import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Forzar carga desde archivo .env local

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import conteoRoutes from './routes/conteo';
import reportesRoutes from './routes/reportes';
import eventoRoutes from './routes/evento';
import userRoutes from './routes/users';
import roleRoutes from './routes/roles';
import notificationRoutes from './routes/notificaciones';
import registroDetalladoRoutes from './routes/registroDetallado';
import { createServer } from 'http';
import { initSocket } from './utils/socket';
import { seedRoles } from './seeders/roleSeeder';
import { seedUsers } from './seeders/userSeeder';
import { getTeenFormHtml } from './utils/htmlForm';
import { getCarnetHtml } from './utils/carnetHtml';
import PersonaDetallada from './models/PersonaDetallada';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Permitir localhost en cualquier puerto y dominios de producción
        const allowedOrigins = [
            'https://mpolog.vercel.app',
            'https://maranatha.up.railway.app',
            'https://mpolog.up.railway.app'
        ];
        
        if (!origin || origin.startsWith('http://localhost') || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
// Aumentar el límite de tamaño para permitir imágenes en base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// simple request logger (antes de las rutas)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Conectar a MongoDB
connectDB().then(() => {
    seedRoles();
    seedUsers();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/conteo', conteoRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/notificaciones', notificationRoutes);
app.use('/api/registro-detallado', registroDetalladoRoutes);


// Ruta de registro público JEF Teen
app.get('/registro-teen', (req, res) => {
    res.send(getTeenFormHtml());
});

// Ruta pública de Carnet Digital para niños de Mentor Club (Kids)
app.get('/carnet/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const persona = await PersonaDetallada.findById(id);
        if (!persona) {
            return res.status(404).send('<h1 style="color: white; text-align: center; margin-top: 50px; font-family: sans-serif;">Carnet no encontrado</h1>');
        }
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol;
        
        // Manejar protocolo seguro detrás de proxies inversos (como Railway o Vercel)
        const activeProtocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : protocol;
        const carnetUrl = `${activeProtocol}://${host}/carnet/${id}`;
        
        res.send(getCarnetHtml(persona, carnetUrl));
    } catch (error: any) {
        res.status(500).send(`<h1 style="color: white; text-align: center; margin-top: 50px; font-family: sans-serif;">Error del servidor</h1><p style="color: grey; text-align: center; font-family: sans-serif;">${error.message}</p>`);
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Logística funcionando correctamente' });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});