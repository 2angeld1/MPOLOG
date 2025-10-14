import { Response } from 'express';
import ConteoPersonas from '../models/ConteoPersonas';
import { AuthRequest } from '../middleware/auth';

export const crearConteo = async (req: AuthRequest, res: Response) => {
    try {
        const { fecha, area, cantidad, observaciones, tipo, subArea } = req.body; // Agrega tipo y subArea

        // Validar datos
        if (!fecha || !area || cantidad === undefined) {
            return res.status(400).json({ message: 'Por favor completa todos los campos requeridos' });
        }

        if (tipo === 'materiales' && !subArea) {
            return res.status(400).json({ message: 'Para materiales, selecciona una sub-área' });
        }

        const conteo = new ConteoPersonas({
            fecha: new Date(fecha),
            area,
            cantidad,
            observaciones,
            usuario: req.userId,
            tipo: tipo || 'personas', // Default a personas
            subArea
        });

        await conteo.save();

        res.status(201).json({
            success: true,
            data: conteo
        });
    } catch (error) {
        console.error('Error al crear conteo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const obtenerConteos = async (req: AuthRequest, res: Response) => {
    try {
        const { fecha, area, tipo } = req.query; // Agrega tipo
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

        if (area) {
            query.area = area;
        }

        if (tipo) {
            query.tipo = tipo; // Filtra por tipo
        }

        const conteos = await ConteoPersonas.find(query)
            .populate('usuario', 'nombre username')
            .sort({ fecha: -1 });

        res.json({
            success: true,
            data: conteos
        });
    } catch (error) {
        console.error('Error al obtener conteos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const obtenerEstadisticas = async (req: AuthRequest, res: Response) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        console.log('📅 Parámetros recibidos:', { fechaInicio, fechaFin });

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

        console.log('🔍 Query MongoDB:', JSON.stringify(query, null, 2));

        const conteos = await ConteoPersonas.find(query);

        console.log('📊 Conteos encontrados:', conteos.length);

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
        console.error('❌ Error en obtenerEstadisticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

export const obtenerAreas = async (req: AuthRequest, res: Response) => {
    try {
        // Obtener el schema del modelo
        const schema = ConteoPersonas.schema.path('area');

        // Obtener los valores del enum
        const areas = (schema as any).enumValues || [];

        console.log('📍 Áreas disponibles:', areas);

        res.json({
            success: true,
            data: areas
        });
    } catch (error: any) {
        console.error('❌ Error al obtener áreas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener áreas',
            error: error.message
        });
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
    } catch (error) {
        console.error('Error al eliminar conteo:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};