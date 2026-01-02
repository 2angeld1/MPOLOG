import mongoose, { Document, Schema } from 'mongoose';

export interface IConteoPersonas extends Document {
    fecha: Date;
    iglesia: string; // Nuevo campo para iglesia
    tipo: 'personas' | 'materiales';
    area: string; // Ahora representa subáreas específicas
    cantidad: number;
    usuario: mongoose.Types.ObjectId;
    observaciones?: string;
    subArea?: string; // Opcional, si se necesita más granularidad
    createdAt?: Date;
    updatedAt?: Date;
}

const ConteoPersonasSchema: Schema = new Schema({
    fecha: {
        type: Date,
        required: true
    },
    iglesia: { // Nuevo campo
        type: String,
        required: true,
        enum: [
            'Arraijan',
            'Bique',
            'Burunga',
            'Capira',
            'Central',
            'Chiriqui',
            'El potrero',
            'Este',
            'Norte',
            'Oeste',
            'Penonome',
            'Santiago',
            'Veracruz'
        ]
    },
    tipo: {
        type: String,
        enum: ['personas', 'materiales'],
        default: 'personas'
    },
    area: { // Enum actualizado para incluir áreas de materiales
        type: String,
        required: true,
        enum: [
            // Áreas para personas
            'Bloque 1 y 2',
            'Bloque 3 y 4',
            'Altar y Media',
            'JEF Teen',
            'Genesis',
            'Cafetería',
            'Seguridad',
            'En vivo',
            // Áreas para materiales (utensilios)
            'cafeteria',
            'baños',
            'media',
            'oficina',
            'jef teen',
            'jef',
            'evangelio cambia',
            'comedor',
            'proyecto dar',
            'navidad alegre'
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
    subArea: {
        type: String,
        required: false // Ya es string libre
    }
}, {
    timestamps: true
});

// Índice para búsquedas rápidas por fecha e iglesia
ConteoPersonasSchema.index({ fecha: 1, iglesia: 1 });

export default mongoose.model<IConteoPersonas>('ConteoPersonas', ConteoPersonasSchema);