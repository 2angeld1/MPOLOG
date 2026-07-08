import { Router } from 'express';
import { 
    crearPersonaDetallada, 
    crearPersonaPublico,
    obtenerPersonasDetalladas, 
    actualizarPersonaDetallada, 
    eliminarPersonaDetallada, 
    marcarAsistencia,
    actualizarPersonaPublico,
    eliminarPersonaPublico
} from '../controllers/registroDetalladoController';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = Router();

// Roles con acceso al registro detallado
const ROLES_REGISTRO = ['superadmin', 'jef teen', 'mentor club'];

// Ruta pública para captación de datos (formulario QR, sin autenticación)
router.post('/publico', crearPersonaPublico);
router.put('/publico/:id', actualizarPersonaPublico);
router.delete('/publico/:id', eliminarPersonaPublico);

// Todas las rutas siguientes requieren autenticación + rol
router.use(auth);
router.use(checkRole(ROLES_REGISTRO));

router.post('/', crearPersonaDetallada);
router.get('/', obtenerPersonasDetalladas);
router.put('/:id', actualizarPersonaDetallada);
router.delete('/:id', eliminarPersonaDetallada);
router.post('/asistencia', marcarAsistencia);

export default router;
