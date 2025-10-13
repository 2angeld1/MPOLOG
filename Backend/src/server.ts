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

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:8100',
        'https://tu-app.vercel.app', // Reemplaza con tu URL de Vercel
        'https://mpolog.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

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