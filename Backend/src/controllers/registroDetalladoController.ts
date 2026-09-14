import { Request, Response } from 'express';
import PersonaDetallada from '../models/PersonaDetallada';
import { uploadImage } from '../utils/imageUpload';

export const crearPersonaDetallada = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, telefono, sexo, departamento, edad, escuela, tipoSangre, nombrePadres, correo, tallaSueter, grupo, adultoResponsable, direccion, alergiasMedicamentos, foto, ministerio, asistenciaFamilia, miembrosFamilia, necesitaTransporte, metodoPago, montoPago, comprobantePago, esComandante } = req.body;
        const userId = (req as any).userId;

        // Subir foto o comprobante a Cloudinary si existe
        const fotoUrl = await uploadImage(foto, 'kids_profiles');
        const comprobanteUrl = await uploadImage(comprobantePago, 'comprobantes_pago');

        const persona = new PersonaDetallada({
            nombre,
            apellido,
            telefono,
            sexo,
            edad,
            escuela,
            tipoSangre,
            nombrePadres,
            correo,
            tallaSueter,
            grupo,
            adultoResponsable,
            direccion,
            alergiasMedicamentos,
            departamento: departamento || 'Teen',
            usuario: userId,
            foto: fotoUrl,
            ministerio,
            asistenciaFamilia,
            miembrosFamilia,
            necesitaTransporte,
            metodoPago,
            montoPago,
            comprobantePago: comprobanteUrl,
            esComandante: !!esComandante
        });

        await persona.save();
        res.status(201).json(persona);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al crear el registro', error: error.message });
    }
};

const normalizeText = (str: string = '') => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const crearPersonaPublico = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, telefono, sexo, departamento, edad, escuela, tipoSangre, nombrePadres, correo, tallaSueter, grupo, adultoResponsable, direccion, alergiasMedicamentos, foto, ministerio, asistenciaFamilia, miembrosFamilia, necesitaTransporte, metodoPago, montoPago, comprobantePago, esComandante } = req.body;

        // Validar cupos para Convención / Juegos
        const deptNorm = normalizeText(departamento || '');
        if (deptNorm.includes('conv') || deptNorm.includes('juego')) {
            const juegoNorm = normalizeText((grupo || '') + ' ' + (ministerio || ''));
            if (juegoNorm.includes('vol')) {
                const count = await PersonaDetallada.countDocuments({
                    departamento: { $in: ['Convencion', 'Convención', 'Juegos'] },
                    $or: [
                        { grupo: { $regex: /v[oó]l/i } },
                        { ministerio: { $regex: /v[oó]l/i } }
                    ]
                });
                if (count >= 24) {
                    return res.status(400).json({ message: 'Los cupos para el torneo de Vóleibol están agotados (24/24).' });
                }
            } else if (juegoNorm.includes('fut')) {
                const count = await PersonaDetallada.countDocuments({
                    departamento: { $in: ['Convencion', 'Convención', 'Juegos'] },
                    $or: [
                        { grupo: { $regex: /f[uú]t/i } },
                        { ministerio: { $regex: /f[uú]t/i } }
                    ]
                });
                if (count >= 25) {
                    return res.status(400).json({ message: 'Los cupos para el torneo de Fútbol están agotados (25/25).' });
                }
            } else if (juegoNorm.includes('ping') || juegoNorm.includes('pong')) {
                const count = await PersonaDetallada.countDocuments({
                    departamento: { $in: ['Convencion', 'Convención', 'Juegos'] },
                    $or: [
                        { grupo: { $regex: /ping|pong/i } },
                        { ministerio: { $regex: /ping|pong/i } }
                    ]
                });
                if (count >= 25) {
                    return res.status(400).json({ message: 'Los cupos para el torneo de Ping Pong están agotados (25/25).' });
                }
            }
        }

        // Subir foto o comprobante a Cloudinary si existe
        const fotoUrl = await uploadImage(foto, 'kids_profiles');
        const comprobanteUrl = await uploadImage(comprobantePago, 'comprobantes_pago');

        const persona = new PersonaDetallada({
            nombre,
            apellido,
            telefono,
            sexo,
            edad,
            escuela,
            tipoSangre,
            nombrePadres,
            correo,
            tallaSueter,
            grupo,
            adultoResponsable,
            direccion,
            alergiasMedicamentos,
            departamento: departamento || 'Teen',
            foto: fotoUrl,
            ministerio,
            asistenciaFamilia,
            miembrosFamilia,
            necesitaTransporte,
            metodoPago,
            montoPago,
            comprobantePago: comprobanteUrl,
            esComandante: !!esComandante
        });

        await persona.save();
        res.status(201).json(persona);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al crear el registro público', error: error.message });
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
        const { nombre, apellido, telefono, sexo, departamento, edad, escuela, tipoSangre, nombrePadres, correo, tallaSueter, grupo, adultoResponsable, direccion, alergiasMedicamentos, foto, ministerio, asistenciaFamilia, miembrosFamilia, necesitaTransporte, metodoPago, montoPago, comprobantePago, esComandante } = req.body;

        // Subir foto y/o comprobante a Cloudinary si existe (base64)
        const fotoUrl = await uploadImage(foto, 'kids_profiles');
        const comprobanteUrl = await uploadImage(comprobantePago, 'comprobantes_pago');

        const persona = await PersonaDetallada.findByIdAndUpdate(
            id,
            { nombre, apellido, telefono, sexo, departamento, edad, escuela, tipoSangre, nombrePadres, correo, tallaSueter, grupo, adultoResponsable, direccion, alergiasMedicamentos, foto: fotoUrl, ministerio, asistenciaFamilia, miembrosFamilia, necesitaTransporte, metodoPago, montoPago, comprobantePago: comprobanteUrl, esComandante: esComandante !== undefined ? !!esComandante : undefined },
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

export const actualizarPersonaPublico = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, sexo, departamento, edad, escuela, tipoSangre, nombrePadres, correo, tallaSueter, grupo, adultoResponsable, direccion, alergiasMedicamentos, foto, ministerio, asistenciaFamilia, miembrosFamilia, necesitaTransporte, metodoPago, montoPago, comprobantePago, esComandante } = req.body;

        // Subir foto y/o comprobante a Cloudinary si existe (base64)
        const fotoUrl = await uploadImage(foto, 'kids_profiles');
        const comprobanteUrl = await uploadImage(comprobantePago, 'comprobantes_pago');

        const persona = await PersonaDetallada.findByIdAndUpdate(
            id,
            { nombre, apellido, telefono, sexo, departamento, edad, escuela, tipoSangre, nombrePadres, correo, tallaSueter, grupo, adultoResponsable, direccion, alergiasMedicamentos, foto: fotoUrl, ministerio, asistenciaFamilia, miembrosFamilia, necesitaTransporte, metodoPago, montoPago, comprobantePago: comprobanteUrl, esComandante: esComandante !== undefined ? !!esComandante : undefined },
            { new: true }
        );

        if (!persona) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json(persona);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

export const eliminarPersonaPublico = async (req: Request, res: Response) => {
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

export const obtenerCuposConvencion = async (req: Request, res: Response) => {
    try {
        const personas = await PersonaDetallada.find({
            departamento: { $in: ['Convencion', 'Convención', 'Juegos'] }
        }).select('grupo ministerio').lean();

        let voleibol = 0;
        let futbol = 0;
        let pingpong = 0;
        let videojuegos = 0;
        let tiroarco = 0;
        let belleza = 0;
        let arte = 0;
        let square = 0;
        let karaoke = 0;

        personas.forEach(p => {
            const text = normalizeText((p.grupo || '') + ' ' + (p.ministerio || ''));
            if (text.includes('vol')) voleibol++;
            if (text.includes('fut')) futbol++;
            if (text.includes('ping') || text.includes('pong')) pingpong++;
            if (text.includes('video') || text.includes('mario') || text.includes('fifa')) videojuegos++;
            if (text.includes('tiro') || text.includes('arco') || text.includes('flecha')) tiroarco++;
            if (text.includes('belleza') || text.includes('trenza') || text.includes('neon')) belleza++;
            if (text.includes('arte')) arte++;
            if (text.includes('square')) square++;
            if (text.includes('karaoke')) karaoke++;
        });

        res.json({
            voleibol: { count: voleibol, max: 24, disponible: Math.max(0, 24 - voleibol), lleno: voleibol >= 24 },
            futbol: { count: futbol, max: 25, disponible: Math.max(0, 25 - futbol), lleno: futbol >= 25 },
            pingpong: { count: pingpong, max: 25, disponible: Math.max(0, 25 - pingpong), lleno: pingpong >= 25 },
            videojuegos: { count: videojuegos },
            tiroarco: { count: tiroarco },
            belleza: { count: belleza },
            arte: { count: arte },
            square: { count: square },
            karaoke: { count: karaoke },
            total: personas.length
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener cupos de convención', error: error.message });
    }
};
