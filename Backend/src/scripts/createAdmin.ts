import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        // Elimina el admin existente si existe
        await User.deleteOne({ email: 'admin@mpolog.com' });

        const admin = new User({
            email: 'admin@mpolog.com', // Cambia username por email
            password: 'admin123',
            nombre: 'Administrador',
            rol: 'admin'
        });

        await admin.save();
        console.log('✅ Usuario admin creado correctamente');
        console.log('📧 Email: admin@mpolog.com');
        console.log('🔑 Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();