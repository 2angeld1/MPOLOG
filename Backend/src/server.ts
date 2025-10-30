import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import conteoRoutes from './routes/conteo';
import reportesRoutes from './routes/reportes'; // NUEVO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('[SERVER] starting, PORT=', process.env.PORT, 'MONGODB_URI=', !!process.env.MONGODB_URI);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:8100',
        'https://mpolog.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

// simple request logger (antes de las rutas)
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - from ${req.ip}`);
    next();
});

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/conteo', conteoRoutes);
app.use('/api/reportes', reportesRoutes); // NUEVO

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Logística funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});