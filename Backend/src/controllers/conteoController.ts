import { Response } from 'express';
import ConteoPersonas from '../models/ConteoPersonas';
import { AuthRequest } from '../middleware/auth';
import { getIO } from '../utils/socket';

export const crearConteo = async (req: AuthRequest, res: Response) => {
    try {
        const { fecha, iglesia, tipo, area, cantidad, observaciones, subArea } = req.body;

        // Validar datos
        if (!fecha || !iglesia || !tipo || !area || cantidad === undefined) {
            return res.status(400).json({ message: 'Por favor completa todos los campos requeridos: fecha, iglesia, tipo, area y cantidad' });
        }

        if (tipo === 'materiales' && !subArea) {
            return res.status(400).json({ message: 'Para materiales, ingresa una sub-área (ej. juguetes)' });
        }

        // Lógica de upsert para materiales
        if (tipo === 'materiales') {
            const existingConteo = await ConteoPersonas.findOneAndUpdate(
                {
                    fecha: new Date(fecha),
                    iglesia,
                    tipo,
                    area,
                    subArea
                },
                {
                    $inc: { cantidad: cantidad }, // Suma la cantidad
                    observaciones,
                    usuario: req.userId
                },
                {
                    new: true, // Devuelve el documento actualizado
                    upsert: true, // Crea si no existe
                    setDefaultsOnInsert: true // Aplica defaults en inserción
                }
            );

            return res.status(201).json({
                success: true,
                data: existingConteo,
                message: 'Registro actualizado o creado correctamente'
            });
            // Emitir evento (después de respuesta o antes, aquí lo pongo antes del return, pero dentro del bloque if material)
            try {
                getIO().emit('cambio_datos', { accion: 'crear', tipo: 'materiales', data: existingConteo });
            } catch (e) {
                console.error('Error emitiendo socket', e);
            }
        } else {
            // Para personas, crear siempre nuevo (lógica original)
            const conteo = new ConteoPersonas({
                fecha: new Date(fecha),
                iglesia,
                tipo,
                area,
                cantidad,
                observaciones,
                usuario: req.userId,
                subArea
            });

            await conteo.save();

            // Emitir evento
            try {
                getIO().emit('cambio_datos', { accion: 'crear', tipo: 'personas', data: conteo });
            } catch (e) {
                console.error('Error emitiendo socket', e);
            }

            return res.status(201).json({
                success: true,
                data: conteo
            });
        }
    } catch (error) {
        console.error('Error al crear conteo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const obtenerConteos = async (req: AuthRequest, res: Response) => {
    try {
        const { fecha, iglesia, tipo, area, groupByArea = 'false' } = req.query;
        console.log('🔍 obtenerConteos - Parámetros:', { fecha, iglesia, tipo, area, groupByArea });
        const query: any = {};

        if (fecha) {
            const fechaInicio = new Date(fecha as string);
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaFin.getDate() + 1);

            query.fecha = {
                $gte: fechaInicio,
                $lt: fechaFin
            };
        }

        if (iglesia) {
            query.iglesia = iglesia;
        }

        if (tipo) {
            query.tipo = tipo;
        }

        if (area) {
            query.area = area;
        }

        const conteos = await ConteoPersonas.find(query)
            .populate('usuario', 'nombre email')
            .sort({ fecha: -1 });

        // Si se solicita agrupar por área, crear estructura agrupada
        if (groupByArea === 'true') {
            const groupedData: { [key: string]: any } = {};

            conteos.forEach(conteo => {
                const key = `${conteo.fecha.toISOString().split('T')[0]}_${conteo.iglesia}_${conteo.tipo}_${conteo.area}`;

                if (!groupedData[key]) {
                    groupedData[key] = {
                        fecha: conteo.fecha,
                        iglesia: conteo.iglesia,
                        tipo: conteo.tipo,
                        area: conteo.area,
                        totalCantidad: 0,
                        registros: []
                    };
                }

                groupedData[key].totalCantidad += conteo.cantidad;
                groupedData[key].registros.push({
                    id: conteo._id,
                    cantidad: conteo.cantidad,
                    subArea: conteo.subArea,
                    observaciones: conteo.observaciones,
                    usuario: conteo.usuario,
                    createdAt: conteo.createdAt
                });
            });

            const groupedArray = Object.values(groupedData);

            res.json({
                success: true,
                data: groupedArray,
                grouped: true
            });
        } else {
            res.json({
                success: true,
                data: conteos,
                grouped: false
            });
        }
    } catch (error) {
        console.error('Error al obtener conteos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const obtenerEstadisticas = async (req: any, res: any) => {
    try {
        const { fechaInicio, fechaFin, tipo } = req.query; // Agrega tipo

        let query: any = {};

        if (fechaInicio && fechaFin) {
            const inicio = new Date(fechaInicio as string);
            const fin = new Date(fechaFin as string);
            fin.setDate(fin.getDate() + 1); // Incluir todo el día final

            query.fecha = {
                $gte: inicio,
                $lt: fin
            };
        }

        if (tipo) {
            query.tipo = tipo; // Filtra por tipo si se proporciona
        }

        const conteos = await ConteoPersonas.find(query);

        const totalRegistros = conteos.length;
        const totalPersonas = conteos.reduce((sum, conteo) => sum + conteo.cantidad, 0);
        const promedioPersonas = totalRegistros > 0 ? totalPersonas / totalRegistros : 0;

        const registrosPorAreaMap: { [key: string]: { cantidad: number; totalPersonas: number } } = {};

        conteos.forEach(conteo => {
            if (!registrosPorAreaMap[conteo.area]) {
                registrosPorAreaMap[conteo.area] = {
                    cantidad: 0,
                    totalPersonas: 0
                };
            }
            registrosPorAreaMap[conteo.area].cantidad++;
            registrosPorAreaMap[conteo.area].totalPersonas += conteo.cantidad;
        });

        const registrosPorArea = Object.entries(registrosPorAreaMap).map(([area, data]) => ({
            area,
            cantidad: data.cantidad,
            totalPersonas: data.totalPersonas
        }));

        const estadisticas = {
            totalRegistros,
            totalPersonas,
            promedioPersonas,
            registrosPorArea
        };

        console.log('✅ Estadísticas calculadas:', estadisticas);

        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error: any) {
        console.error('[CONTROLLER] obtenerEstadisticas error:', error.message);
        return res.status(500).json({ message: 'Error interno' });
    }
};

export const obtenerAreas = async (req: AuthRequest, res: Response) => {
    try {
        const { tipo } = req.query; // Nuevo parámetro opcional: 'personas' o 'materiales'

        // Lista completa de áreas del enum
        const todasLasAreas = [
            // Personas
            'Bloque 1 y 2', 'Bloque 3 y 4', 'Altar y Media', 'JEF Teen', 'Genesis', 'Cafetería', 'Seguridad', 'En vivo',
            // Materiales
            'cafeteria', 'baños', 'media', 'oficina', 'jef teen', 'jef', 'evangelio cambia', 'comedor', 'proyecto dar', 'navidad alegre'
        ];

        // Áreas de personas
        const areasPersonas = [
            'Bloque 1 y 2', 'Bloque 3 y 4', 'Altar y Media', 'JEF Teen', 'Genesis', 'Cafetería', 'Seguridad', 'En vivo'
        ];

        // Áreas de materiales
        const areasMateriales = [
            'cafeteria', 'baños', 'media', 'oficina', 'jef teen', 'jef', 'evangelio cambia', 'comedor', 'proyecto dar', 'navidad alegre'
        ];

        let areasFiltradas;
        if (tipo === 'personas') {
            areasFiltradas = areasPersonas;
        } else if (tipo === 'materiales') {
            areasFiltradas = areasMateriales;
        } else {
            areasFiltradas = todasLasAreas; // Si no se especifica tipo, devolver todas
        }

        res.json({ success: true, data: areasFiltradas });
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const actualizarConteo = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { fecha, iglesia, tipo, area, cantidad, observaciones, subArea } = req.body;

        // Validar datos
        if (!fecha || !iglesia || !tipo || !area || cantidad === undefined) {
            return res.status(400).json({ message: 'Por favor completa todos los campos requeridos: fecha, iglesia, tipo, area y cantidad' });
        }

        if (tipo === 'materiales' && !subArea) {
            return res.status(400).json({ message: 'Para materiales, ingresa una sub-área (ej. juguetes)' });
        }

        const conteo = await ConteoPersonas.findByIdAndUpdate(
            id,
            {
                fecha: new Date(fecha),
                iglesia,
                tipo,
                area,
                cantidad,
                observaciones,
                subArea,
                usuario: req.userId
            },
            { new: true }
        ).populate('usuario', 'nombre email');

        if (!conteo) {
            return res.status(404).json({ message: 'Conteo no encontrado' });
        }

        res.json({
            success: true,
            data: conteo,
            message: 'Conteo actualizado correctamente'
        });

        try {
            getIO().emit('cambio_datos', { accion: 'actualizar', data: conteo });
        } catch (e) {
            console.error('Error emitiendo socket', e);
        }
    } catch (error) {
        console.error('Error al actualizar conteo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const eliminarConteo = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const conteo = await ConteoPersonas.findByIdAndDelete(id);

        if (!conteo) {
            return res.status(404).json({ message: 'Conteo no encontrado' });
        }

        res.json({
            success: true,
            message: 'Conteo eliminado correctamente'
        });

        try {
            getIO().emit('cambio_datos', { accion: 'eliminar', id });
        } catch (e) {
            console.error('Error emitiendo socket', e);
        }
    } catch (error) {
        console.error('Error al eliminar conteo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const obtenerIglesias = async (req: AuthRequest, res: Response) => {
    try {
        // Lista de iglesias del enum (puedes extraerla del modelo si es necesario)
        const iglesias = [
            'Arraijan', 'Bique', 'Burunga', 'Capira', 'Central', 'Chiriqui', 'El potrero', 'Este', 'Norte', 'Oeste', 'Penonome', 'Santiago', 'Veracruz'
        ];
        res.json({ success: true, data: iglesias });
    } catch (error) {
        console.error('Error al obtener iglesias:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};