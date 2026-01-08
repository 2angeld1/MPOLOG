import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import conteoRoutes from './routes/conteo';
import reportesRoutes from './routes/reportes';
import eventoRoutes from './routes/evento';
import userRoutes from './routes/users';
import roleRoutes from './routes/roles';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:8100',
        'http://localhost:5173',
        'https://mpolog.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

// simple request logger (antes de las rutas)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/conteo', conteoRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);


// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Logística funcionando correctamente' });
});

app.listen(PORT, () => {
});