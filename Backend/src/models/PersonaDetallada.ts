import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonaDetallada extends Document {
    nombre: string;
    apellido: string;
    telefono: string;
    asistencias: Date[];
    departamento: string;
    usuario: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const PersonaDetalladaSchema: Schema = new Schema({
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
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    asistencias: {
        type: [Date],
        default: []
    },
    departamento: {
        type: String,
        default: 'Teen'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Índices para búsquedas
PersonaDetalladaSchema.index({ nombre: 1, apellido: 1 });
PersonaDetalladaSchema.index({ departamento: 1 });

export default mongoose.model<IPersonaDetallada>('PersonaDetallada', PersonaDetalladaSchema);
