import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string; // Cambia username por email
    password: string;
    nombre: string;
    rol: string;
    roles: string[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    email: { // Cambia username por email
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'usuario'
    },
    roles: {
        type: [String],
        default: ['usuario']
    }
}, {
    timestamps: true
});

// Hash password y sincronizar roles antes de guardar
userSchema.pre('save', async function(next) {
    // Sincronizar campo rol clásico con el primer elemento del array roles
    if (this.roles && this.roles.length > 0) {
        this.rol = this.roles[0];
    } else {
        this.roles = [this.rol || 'usuario'];
    }

    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);