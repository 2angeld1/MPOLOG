import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error: any) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.json(notification);
    } catch (error: any) {
        console.error('Error al marcar notificación:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const markAllAsRead = async (_req: Request, res: Response) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error: any) {
        console.error('Error al marcar todas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const clearNotifications = async (_req: Request, res: Response) => {
    try {
        await Notification.deleteMany({});
        res.json({ message: 'Historial de notificaciones limpiado' });
    } catch (error: any) {
        console.error('Error al limpiar notificaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Utilidad interna para guardar notificaciones desde otros controladores
export const saveAndEmitNotification = async (io: any, title: string, body: string, type: string) => {
    try {
        const newNotification = new Notification({
            title,
            body,
            type
        });
        await newNotification.save();
        
        // Emitir por socket igual que antes
        io.emit('notificacion-nueva', newNotification);
    } catch (error) {
        console.error('Error al guardar/emitir notificación:', error);
    }
};
