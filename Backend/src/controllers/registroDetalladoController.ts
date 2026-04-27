import { Request, Response } from 'express';
import PersonaDetallada from '../models/PersonaDetallada';

export const crearPersonaDetallada = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, telefono, departamento } = req.body;
        const userId = (req as any).userId;

        const persona = new PersonaDetallada({
            nombre,
            apellido,
            telefono,
            departamento: departamento || 'Teen',
            usuario: userId
        });

        await persona.save();
        res.status(201).json(persona);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al crear el registro', error: error.message });
    }
};

export const obtenerPersonasDetalladas = async (req: Request, res: Response) => {
    try {
        const { departamento } = req.query;
        const filtro: any = {};
        if (departamento) filtro.departamento = departamento;

        const personas = await PersonaDetallada.find(filtro).sort({ nombre: 1 });
        res.json(personas);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener registros', error: error.message });
    }
};

export const actualizarPersonaDetallada = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, departamento } = req.body;

        const persona = await PersonaDetallada.findByIdAndUpdate(
            id,
            { nombre, apellido, telefono, departamento },
            { new: true }
        );

        if (!persona) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json(persona);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

export const eliminarPersonaDetallada = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await PersonaDetallada.findByIdAndDelete(id);
        res.json({ message: 'Registro eliminado' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al eliminar', error: error.message });
    }
};

export const marcarAsistencia = async (req: Request, res: Response) => {
    try {
        const { ids, fecha } = req.body; // ids es un array de IDs de personas, fecha es opcional
        const fechaAsistencia = fecha ? new Date(fecha) : new Date();
        // Normalizar fecha a solo día para evitar múltiples registros el mismo día
        fechaAsistencia.setHours(0, 0, 0, 0);

        await PersonaDetallada.updateMany(
            { _id: { $in: ids } },
            { $addToSet: { asistencias: fechaAsistencia } }
        );

        res.json({ message: 'Asistencias marcadas correctamente' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al marcar asistencias', error: error.message });
    }
};
