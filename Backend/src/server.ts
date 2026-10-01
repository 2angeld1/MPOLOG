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
import { getTeenFormHtml, getMentorClubFormHtml, getCampamentoFormHtml, getConvencionFormHtml, getRangerChefFormHtml } from './utils/htmlForm';
import { getCarnetHtml } from './utils/carnetHtml';
import { getTablaNinosHtml, getCampamentoTableHtml, getConvencionTableHtml, getRangerChefTableHtml } from './utils/tablaHtml';
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

// Ruta de registro público Mentor Club (Kids)
app.get('/registro-mentor-club', (req, res) => {
    res.send(getMentorClubFormHtml());
});

// Rutas de registro público Ranger Chef (General y por Categoría)
app.get(['/registro-ranger-chef', '/registro-ranger-chef/:categoria'], (req, res) => {
    const { categoria } = req.params;
    res.send(getRangerChefFormHtml(categoria));
});
app.get('/registro-ranger-chef-navegantes', (req, res) => res.send(getRangerChefFormHtml('navegantes')));
app.get('/registro-ranger-chef-pioneros', (req, res) => res.send(getRangerChefFormHtml('pioneros')));
app.get('/registro-ranger-chef-seguidores', (req, res) => res.send(getRangerChefFormHtml('seguidores')));
app.get('/registro-ranger-chef-exploradores', (req, res) => res.send(getRangerChefFormHtml('exploradores')));

// Ruta anterior de Campamento (Redirige a Ranger Chef)
app.get('/registro-campamento', (req, res) => {
    res.redirect('/registro-ranger-chef');
});

// Ruta de registro público Convención de Jóvenes (Juegos)
app.get('/registro-convencion', (req, res) => {
    res.send(getConvencionFormHtml());
});
app.get('/registro-juegos', (req, res) => {
    res.send(getConvencionFormHtml());
});

// Directorio HTML de Mentor Club (Kids) con QR
app.get('/directorio-mentor-club', async (req, res) => {
    try {
        const personas = await PersonaDetallada.find({ departamento: 'Kids' }).sort({ nombre: 1 });
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol;
        const activeProtocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : protocol;
        const baseUrl = `${activeProtocol}://${host}`;

        res.send(getTablaNinosHtml(personas, baseUrl));
    } catch (error: any) {
        res.status(500).send(`<h1 style="color: white; text-align: center; margin-top: 50px; font-family: sans-serif;">Error del servidor</h1><p style="color: grey; text-align: center; font-family: sans-serif;">${error.message}</p>`);
    }
});

// Directorio HTML de Ranger Chef
app.get(['/directorio-ranger-chef', '/directorio-campamento'], async (req, res) => {
    try {
        const personas = await PersonaDetallada.find({ 
            departamento: { $in: ['Ranger Chef', 'RangerChef'] } 
        }).sort({ createdAt: -1, nombre: 1 });
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol;
        const activeProtocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : protocol;
        const baseUrl = `${activeProtocol}://${host}`;

        res.send(getRangerChefTableHtml(personas, baseUrl));
    } catch (error: any) {
        res.status(500).send(`<h1 style="color: white; text-align: center; margin-top: 50px; font-family: sans-serif;">Error del servidor</h1><p style="color: grey; text-align: center; font-family: sans-serif;">${error.message}</p>`);
    }
});

// Directorio Histórico del Campamento de Servidores (Consulta anterior)
app.get('/directorio-campamento-historico', async (req, res) => {
    try {
        const personas = await PersonaDetallada.find({ departamento: 'Campamento' }).sort({ createdAt: -1, nombre: 1 });
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol;
        const activeProtocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : protocol;
        const baseUrl = `${activeProtocol}://${host}`;

        res.send(getRangerChefTableHtml(personas, baseUrl));
    } catch (error: any) {
        res.status(500).send(`<h1 style="color: white; text-align: center; margin-top: 50px; font-family: sans-serif;">Error del servidor</h1><p style="color: grey; text-align: center; font-family: sans-serif;">${error.message}</p>`);
    }
});

// Directorio HTML de Convención de Jóvenes (Juegos) con Tabs
app.get(['/directorio-convencion', '/directorio-juegos'], async (req, res) => {
    try {
        const personas = await PersonaDetallada.find({ 
            departamento: { $in: ['Convencion', 'Convención', 'Juegos'] } 
        }).sort({ createdAt: 1, nombre: 1 });
        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol;
        const activeProtocol = req.headers['x-forwarded-proto'] ? String(req.headers['x-forwarded-proto']) : protocol;
        const baseUrl = `${activeProtocol}://${host}`;

        res.send(getConvencionTableHtml(personas, baseUrl));
    } catch (error: any) {
        res.status(500).send(`<h1 style="color: white; text-align: center; margin-top: 50px; font-family: sans-serif;">Error del servidor</h1><p style="color: grey; text-align: center; font-family: sans-serif;">${error.message}</p>`);
    }
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