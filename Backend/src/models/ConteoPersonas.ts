import mongoose, { Document, Schema } from 'mongoose';

export interface IConteoPersonas extends Document {
    fecha: Date;
    area: string;
    cantidad: number;
    usuario: mongoose.Types.ObjectId;
    observaciones?: string;
    tipo: 'personas' | 'materiales'; // Agrega tipo
    subArea?: string; // Agrega subArea opcional
}

const ConteoPersonasSchema: Schema = new Schema({
    fecha: {
        type: Date,
        required: true
    },
    area: {
        type: String,
        required: true,
        enum: [
            'Bloque 1 y 2',
            'Bloque 3 y 4',
            'Altar y Media',
            'JEF Teen',
            'Genesis',
            'Cafetería',
            'Seguridad'
        ]
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    observaciones: {
        type: String
    },
    tipo: { // Agrega tipo
        type: String,
        enum: ['personas', 'materiales'],
        default: 'personas'
    },
    subArea: { // Agrega subArea
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Índice para búsquedas rápidas por fecha
ConteoPersonasSchema.index({ fecha: 1, area: 1 });

export default mongoose.model<IConteoPersonas>('ConteoPersonas', ConteoPersonasSchema);