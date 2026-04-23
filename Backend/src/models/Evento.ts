import mongoose, { Document, Schema } from 'mongoose';

export interface IUbicacion {
    lat?: number;
    lng?: number;
    nombreLugar: string;
}

export interface IEvento extends Document {
    nombre: string;
    tipo: 'campamento' | 'retiro' | 'conferencia' | 'asignacion' | 'reunion' | 'ayuno' | 'vigilia' | 'culto' | 'evangelismo' | 'convencion' | 'otro';
    departamento: string;
    color?: string; // Hex code para el calendario
    fechaInicio: Date;
    fechaFin: Date;
    precioTotal: number;
    activo: boolean;
    descripcion?: string;
    ubicacion?: IUbicacion;
    usuario?: mongoose.Types.ObjectId;
    duracionDias?: number;
    requiereAlojamiento?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const UbicacionSchema: Schema = new Schema({
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    nombreLugar: { type: String, required: false }
}, { _id: false });

const EventoSchema: Schema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['campamento', 'retiro', 'conferencia', 'asignacion', 'reunion', 'ayuno', 'vigilia', 'culto', 'evangelismo', 'convencion', 'otro'],
        default: 'asignacion'
    },
    departamento: {
        type: String,
        required: true,
        default: 'General'
    },
    color: {
        type: String,
        default: '#673AB7'
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    precioTotal: {
        type: Number,
        required: false,
        default: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    descripcion: {
        type: String
    },
    ubicacion: {
        type: UbicacionSchema,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    duracionDias: {
        type: Number,
        required: false
    },
    requiereAlojamiento: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Índice para búsquedas rápidas
EventoSchema.index({ departamento: 1, activo: 1 });
EventoSchema.index({ fechaInicio: 1, fechaFin: 1 });

export default mongoose.model<IEvento>('Evento', EventoSchema);
