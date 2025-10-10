import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        const admin = new User({
            username: 'admin',
            password: 'admin123',
            nombre: 'Administrador',
            rol: 'admin'
        });

        await admin.save();
        console.log('✅ Usuario admin creado correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();