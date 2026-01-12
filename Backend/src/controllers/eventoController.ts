import { Request, Response } from 'express';
import Evento, { IEvento } from '../models/Evento';
import EventoPersona, { IEventoPersona } from '../models/EventoPersona';
import { uploadImage } from '../utils/imageUpload';

// ==================== EVENTOS ====================

// Crear un nuevo evento
export const crearEvento = async (req: Request, res: Response) => {
    try {
        const { nombre, tipo, fechaInicio, fechaFin, precioTotal, descripcion, ubicacion } = req.body;

        const evento = new Evento({
            nombre,
            tipo: tipo || 'campamento',
            fechaInicio,
            fechaFin,
            precioTotal,
            descripcion,
            ubicacion,
            activo: true
        });

        await evento.save();
        res.status(201).json(evento);
    } catch (error: any) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ message: 'Error al crear el evento', error: error.message });
    }
};

// Obtener todos los eventos (con filtro opcional por activo y tipo)
export const obtenerEventos = async (req: Request, res: Response) => {
    try {
        const { activo, tipo } = req.query;
        const filtro: any = {};

        if (activo !== undefined) {
            filtro.activo = activo === 'true';
        }
        if (tipo) {
            filtro.tipo = tipo;
        }

        const eventos = await Evento.find(filtro).sort({ fechaInicio: -1 });
        res.json(eventos);
    } catch (error: any) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos', error: error.message });
    }
};

// Obtener un evento por ID
export const obtenerEventoPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(evento);
    } catch (error: any) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ message: 'Error al obtener el evento', error: error.message });
    }
};

// Actualizar un evento
export const actualizarEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, fechaInicio, fechaFin, precioTotal, activo, descripcion, ubicacion } = req.body;

        const evento = await Evento.findByIdAndUpdate(
            id,
            { nombre, tipo, fechaInicio, fechaFin, precioTotal, activo, descripcion, ubicacion },
            { new: true, runValidators: true }
        );

        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(evento);
    } catch (error: any) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ message: 'Error al actualizar el evento', error: error.message });
    }
};

// Eliminar un evento
export const eliminarEvento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Verificar si hay personas registradas
        const personasCount = await EventoPersona.countDocuments({ evento: id });
        if (personasCount > 0) {
            return res.status(400).json({ 
                message: `No se puede eliminar el evento porque tiene ${personasCount} persona(s) registrada(s)` 
            });
        }

        const evento = await Evento.findByIdAndDelete(id);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error: any) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error al eliminar el evento', error: error.message });
    }
};

// ==================== PERSONAS EN EVENTOS ====================

// Registrar persona en un evento
export const registrarPersona = async (req: Request, res: Response) => {
    try {
        const { eventoId } = req.params;
        const { nombre, apellido, edad, telefono, abono, montoAbono, tipoPago, comprobanteYappy, equipo } = req.body;
        const userId = (req as any).userId;

        // Verificar que el evento existe y está activo
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        if (!evento.activo) {
            return res.status(400).json({ message: 'El evento no está activo para registro' });
        }

        // Subir comprobante a Cloudinary si existe (y es base64)
        let comprobanteUrl = comprobanteYappy;
        if (comprobanteYappy && comprobanteYappy.startsWith('data:image')) {
            comprobanteUrl = await uploadImage(comprobanteYappy) || undefined;
        }

        const persona = new EventoPersona({
            evento: eventoId,
            nombre,
            apellido,
            edad,
            telefono,
            abono: abono || false,
            montoAbono: abono ? (montoAbono || 0) : 0,
            tipoPago: tipoPago || 'efectivo',
            comprobanteYappy: comprobanteUrl,
            equipo,
            usuario: userId
        });

        await persona.save();
        res.status(201).json(persona);
    } catch (error: any) {
        console.error('Error al registrar persona:', error);
        res.status(500).json({ message: 'Error al registrar la persona', error: error.message });
    }
};

// Obtener personas de un evento
export const obtenerPersonasEvento = async (req: Request, res: Response) => {
    try {
        const { eventoId } = req.params;
        const { busqueda, equipo } = req.query;

        const filtro: any = { evento: eventoId };

        if (busqueda) {
            const regex = new RegExp(busqueda as string, 'i');
            filtro.$or = [
                { nombre: regex },
                { apellido: regex }
            ];
        }
        if (equipo) {
            filtro.equipo = new RegExp(equipo as string, 'i');
        }

        const personas = await EventoPersona.find(filtro)
            .sort({ createdAt: -1 })
            .populate('usuario', 'nombre');

        res.json(personas);
    } catch (error: any) {
        console.error('Error al obtener personas:', error);
        res.status(500).json({ message: 'Error al obtener personas', error: error.message });
    }
};

// Actualizar registro de persona
export const actualizarPersona = async (req: Request, res: Response) => {
    try {
        const { eventoId, personaId } = req.params;
        const { nombre, apellido, edad, telefono, abono, montoAbono, tipoPago, comprobanteYappy, equipo } = req.body;

        // Subir comprobante a Cloudinary si es nuevo (base64)
        let comprobanteUrl = comprobanteYappy;
        if (comprobanteYappy && comprobanteYappy.startsWith('data:image')) {
            comprobanteUrl = await uploadImage(comprobanteYappy) || undefined;
        }

        const persona = await EventoPersona.findOneAndUpdate(
            { _id: personaId, evento: eventoId },
            {
                nombre,
                apellido,
                edad,
                telefono,
                abono: abono || false,
                montoAbono: abono ? (montoAbono || 0) : 0,
                tipoPago: tipoPago || 'efectivo',
                comprobanteYappy: comprobanteUrl,
                equipo
            },
            { new: true, runValidators: true }
        );

        if (!persona) {
            return res.status(404).json({ message: 'Registro de persona no encontrado' });
        }

        res.json(persona);
    } catch (error: any) {
        console.error('Error al actualizar persona:', error);
        res.status(500).json({ message: 'Error al actualizar el registro', error: error.message });
    }
};

// Eliminar registro de persona
export const eliminarPersona = async (req: Request, res: Response) => {
    try {
        const { eventoId, personaId } = req.params;

        const persona = await EventoPersona.findOneAndDelete({ _id: personaId, evento: eventoId });

        if (!persona) {
            return res.status(404).json({ message: 'Registro de persona no encontrado' });
        }

        res.json({ message: 'Registro eliminado correctamente' });
    } catch (error: any) {
        console.error('Error al eliminar persona:', error);
        res.status(500).json({ message: 'Error al eliminar el registro', error: error.message });
    }
};

// Obtener estadísticas del evento
export const obtenerEstadisticasEvento = async (req: Request, res: Response) => {
    try {
        const { eventoId } = req.params;

        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        const personas = await EventoPersona.find({ evento: eventoId });

        const totalPersonas = personas.length;
        const personasConAbono = personas.filter(p => p.abono).length;
        const personasSinAbono = totalPersonas - personasConAbono;
        const montoTotalRecaudado = personas.reduce((sum, p) => sum + (p.montoAbono || 0), 0);
        const montoEsperado = totalPersonas * evento.precioTotal;
        const montoPendiente = montoEsperado - montoTotalRecaudado;

        // Agrupar por equipo
        const equipos: { [key: string]: { cantidad: number; montoAbonado: number } } = {};
        personas.forEach(p => {
            const equipoNombre = p.equipo || 'Sin equipo';
            if (!equipos[equipoNombre]) {
                equipos[equipoNombre] = { cantidad: 0, montoAbonado: 0 };
            }
            equipos[equipoNombre].cantidad++;
            equipos[equipoNombre].montoAbonado += p.montoAbono || 0;
        });

        const estadisticasPorEquipo = Object.entries(equipos).map(([nombre, data]) => ({
            equipo: nombre,
            ...data
        }));

        res.json({
            evento: {
                nombre: evento.nombre,
                tipo: evento.tipo,
                precioTotal: evento.precioTotal
            },
            totalPersonas,
            personasConAbono,
            personasSinAbono,
            montoTotalRecaudado,
            montoEsperado,
            montoPendiente,
            estadisticasPorEquipo
        });
    } catch (error: any) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
    }
};
