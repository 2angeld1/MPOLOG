import { Request, Response } from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { rol, roles } = req.body;

        // Si se envía 'roles' como array, lo usamos. Si no, construimos uno a partir de 'rol'.
        if (roles && Array.isArray(roles)) {
            if (roles.length === 0) {
                roles = ['usuario'];
            }
            rol = roles[0];
        } else if (rol) {
            roles = [rol];
        } else {
            return res.status(400).json({ message: 'Se requiere rol o roles en la petición' });
        }

        const validRoles = [
            'superadmin',
            'logisticadmin',
            'eventsadmin',
            'sameadmin',
            'admin',
            'usuario',
            'jef teen',
            'jef',
            'mentor club',
            'servidores'
        ];

        // Validar que todos los roles sean válidos
        for (const r of roles) {
            if (!validRoles.includes(r)) {
                return res.status(400).json({ message: `Rol inválido: ${r}` });
            }
        }

        // Obtener el usuario antes de actualizar
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const currentRoles = existingUser.roles || [existingUser.rol];
        const isCurrentlySuperAdmin = currentRoles.includes('superadmin') || existingUser.rol === 'superadmin';

        // 1. "El super admin es superadmin y ya" -> Prohibido quitarle o alterarle el rol
        if (isCurrentlySuperAdmin) {
            return res.status(400).json({ message: 'El rol de Superadmin es permanente y no puede ser modificado' });
        }

        // 2. "Nadie puede ser superadmin" -> Prohibido asignarse superadmin
        if (roles.includes('superadmin') || rol === 'superadmin') {
            return res.status(400).json({ message: 'No tienes permitido asignar el rol de Superadmin' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { rol, roles },
            { new: true, select: '-password' }
        );

        res.json(user);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error al actualizar rol de usuario' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};
