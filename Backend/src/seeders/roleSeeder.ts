import Role from '../models/Role';
import mongoose from 'mongoose';

export const seedRoles = async () => {
    try {
        const count = await Role.countDocuments();
        if (count === 0) {
            console.log('Seeding roles...');
            await Role.create([
                { name: 'superadmin', description: 'Acceso total al sistema', permissions: ['all'] },
                { name: 'logisticadmin', description: 'Gestión de conteos y logística', permissions: ['conteo', 'reportes'] },
                { name: 'user', description: 'Usuario estándar', permissions: ['view'] }
            ]);
            console.log('Roles seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};
