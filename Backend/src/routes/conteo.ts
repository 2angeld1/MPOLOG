import { Router } from 'express';
import { crearConteo, obtenerConteos, eliminarConteo, obtenerEstadisticas, obtenerAreas } from '../controllers/conteoController';
import { auth } from '../middleware/auth';

const router = Router();

// IMPORTANTE: Las rutas más específicas PRIMERO
router.get('/estadisticas', auth, obtenerEstadisticas);
router.get('/areas', auth, obtenerAreas);
router.post('/', auth, crearConteo);
router.get('/', auth, obtenerConteos);
router.delete('/:id', auth, eliminarConteo);

export default router;