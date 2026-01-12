import mongoose, { Document, Schema } from 'mongoose';

export interface IEventoPersona extends Document {
    evento: mongoose.Types.ObjectId;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    abono: boolean;
    montoAbono: number;
    tipoPago: 'efectivo' | 'yappy';
    comprobanteYappy?: string;
    equipo?: string;
    usuario: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const EventoPersonaSchema: Schema = new Schema({
    evento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    edad: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    abono: {
        type: Boolean,
        default: false
    },
    montoAbono: {
        type: Number,
        default: 0,
        min: 0
    },
    tipoPago: {
        type: String,
        enum: ['efectivo', 'yappy'],
        default: 'efectivo'
    },
    comprobanteYappy: {
        type: String,
        trim: true
    },
    equipo: {
        type: String,
        trim: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Índices para búsquedas eficientes
EventoPersonaSchema.index({ evento: 1 });
EventoPersonaSchema.index({ evento: 1, nombre: 1, apellido: 1 });

export default mongoose.model<IEventoPersona>('EventoPersona', EventoPersonaSchema);
