import mongoose, { Document, Schema } from 'mongoose';

export interface IUbicacion {
    lat: number;
    lng: number;
    nombreLugar: string;
}

export interface IEvento extends Document {
    nombre: string;
    tipo: 'campamento' | 'retiro' | 'conferencia' | 'otro';
    fechaInicio: Date;
    fechaFin: Date;
    precioTotal: number;
    activo: boolean;
    descripcion?: string;
    ubicacion?: IUbicacion;
    createdAt?: Date;
    updatedAt?: Date;
}

const UbicacionSchema: Schema = new Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    nombreLugar: { type: String, required: true }
}, { _id: false });

const EventoSchema: Schema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['campamento', 'retiro', 'conferencia', 'otro'],
        default: 'campamento'
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
        required: true,
        min: 0
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
    }
}, {
    timestamps: true
});

// Índice para búsquedas por tipo y estado activo
EventoSchema.index({ tipo: 1, activo: 1 });
EventoSchema.index({ fechaInicio: 1 });

export default mongoose.model<IEvento>('Evento', EventoSchema);
