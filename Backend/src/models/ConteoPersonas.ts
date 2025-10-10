import mongoose, { Document, Schema } from 'mongoose';

export interface IConteoPersonas extends Document {
    fecha: Date;
    area: string;
    cantidad: number;
    usuario: mongoose.Types.ObjectId;
    observaciones?: string;
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
    }
}, {
    timestamps: true
});

// Índice para búsquedas rápidas por fecha
ConteoPersonasSchema.index({ fecha: 1, area: 1 });

export default mongoose.model<IConteoPersonas>('ConteoPersonas', ConteoPersonasSchema);