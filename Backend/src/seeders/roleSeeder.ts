import Role from '../models/Role';

export const seedRoles = async () => {
    try {
        const rolesToSeed = [
            { name: 'superadmin', description: 'Acceso total al sistema', permissions: ['all'] },
            { name: 'eventsadmin', description: 'Gestión completa de eventos', permissions: ['eventos', 'reportes'] },
            { name: 'sameadmin', description: 'Administrador de servicios SAME', permissions: ['same', 'reportes'] },
            { name: 'logisticadmin', description: 'Gestión de logística y conteos', permissions: ['conteo', 'reportes'] },
            { name: 'usuario', description: 'Usuario estándar con acceso limitado', permissions: ['view'] },
            { name: 'jef teen', description: 'Acceso a registro de adolescentes y calendario', permissions: ['registro', 'calendario'] },
            { name: 'jef', description: 'Acceso a calendario', permissions: ['calendario'] },
            { name: 'mentor club', description: 'Acceso a registro de niños y calendario', permissions: ['registro', 'calendario'] },
            { name: 'servidores', description: 'Acceso a calendario', permissions: ['calendario'] }
        ];

        console.log('Verificando roles en la base de datos...');
        
        for (const roleData of rolesToSeed) {
            const exists = await Role.findOne({ name: roleData.name });
            if (!exists) {
                await Role.create(roleData);
                console.log(`✅ Rol creado: ${roleData.name}`);
            } else {
                console.log(`ℹ️ Rol ya existente: ${roleData.name}`);
            }
        }
        
        console.log('Finalizado el chequeo de roles.');
    } catch (error) {
        console.error('❌ Error seeding roles:', error);
    }
};
