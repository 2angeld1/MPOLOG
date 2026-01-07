import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    actualizarEvento,
    eliminarEvento,
    registrarPersona,
    obtenerPersonasEvento,
    actualizarPersona,
    eliminarPersona,
    obtenerEstadisticasEvento
} from '../controllers/eventoController';

const router = Router();

// Todas las rutas requieren autenticación
router.use(auth);

// ==================== EVENTOS ====================
router.post('/', crearEvento);
router.get('/', obtenerEventos);
router.get('/:id', obtenerEventoPorId);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);

// ==================== PERSONAS EN EVENTOS ====================
router.post('/:eventoId/personas', registrarPersona);
router.get('/:eventoId/personas', obtenerPersonasEvento);
router.put('/:eventoId/personas/:personaId', actualizarPersona);
router.delete('/:eventoId/personas/:personaId', eliminarPersona);

// ==================== ESTADÍSTICAS ====================
router.get('/:eventoId/estadisticas', obtenerEstadisticasEvento);

export default router;
