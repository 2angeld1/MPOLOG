import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/UserController';
import { auth, AuthRequest } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas de administración
router.get('/', checkRole(['superadmin']), getUsers);
router.put('/:id/role', (req: AuthRequest, res, next) => {
    if (req.userId === req.params.id) {
        return next();
    }
    return checkRole(['superadmin'])(req, res, next);
}, updateUserRole);
router.delete('/:id', checkRole(['superadmin']), deleteUser);

export default router;
