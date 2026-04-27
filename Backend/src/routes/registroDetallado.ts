import { Router } from 'express';
import { 
    crearPersonaDetallada, 
    obtenerPersonasDetalladas, 
    actualizarPersonaDetallada, 
    eliminarPersonaDetallada, 
    marcarAsistencia 
} from '../controllers/registroDetalladoController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.post('/', crearPersonaDetallada);
router.get('/', obtenerPersonasDetalladas);
router.put('/:id', actualizarPersonaDetallada);
router.delete('/:id', eliminarPersonaDetallada);
router.post('/asistencia', marcarAsistencia);

export default router;
