import User from '../models/User';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
    try {
        const adminEmail = 'admin@mpolog.com';
        const userExists = await User.findOne({ email: adminEmail });

        if (!userExists) {
            console.log('Seeding superadmin user...');
            await User.create({
                email: adminEmail,
                password: 'admin123456', // Se hashea en el pre-save del modelo
                nombre: 'Super Administrador',
                rol: 'superadmin'
            });
            console.log('✅ Usuario superadmin creado: admin@mpolog.com / admin123456');
        } else {
            console.log('ℹ️ El usuario superadmin ya existe');
        }
    } catch (error) {
        console.error('❌ Error seeding user:', error);
    }
};
