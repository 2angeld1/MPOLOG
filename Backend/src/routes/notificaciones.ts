import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from '../controllers/notificationController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Todas las rutas de notificaciones requieren autenticación
router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);
router.delete('/clear', auth, clearNotifications);

export default router;
