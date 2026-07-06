import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const data = [
  { nombre: 'Bienvenida', icono: 'handshake', color: '#4CAF50', descripcion: 'Equipo de Ujieres y Bienvenida' },
  { nombre: 'Génesis', icono: 'child', color: '#FF9800', descripcion: 'Ministerio de Niños' },
  { nombre: 'Casa de Luz', icono: 'home', color: '#FFC107', descripcion: 'Ministerio Casa de Luz' },
  { nombre: 'Cafetería', icono: 'coffee', color: '#795548', descripcion: 'Equipo de Cafetería' },
  { nombre: 'Seguridad', icono: 'shield', color: '#607D8B', descripcion: 'Equipo de Seguridad' },
  { nombre: 'Protocolo', icono: 'tie', color: '#9C27B0', descripcion: 'Equipo de Protocolo' },
  { nombre: 'Intercesión', icono: 'pray', color: '#3F51B5', descripcion: 'Ministerio de Oración e Intercesión' },
  { nombre: 'Edad Dorada', icono: 'crown', color: '#E91E63', descripcion: 'Ministerio para mayores de 50 años' },
  { nombre: 'Media', icono: 'video', color: '#2196F3', descripcion: 'Comunicaciones, redes y medios' },
];

const hierarchies = [
  {
    padre: { nombre: 'JEF', icono: 'fire', color: '#F44336', descripcion: 'Jóvenes en Fuego' },
    hijos: [
      { nombre: 'JEF Teen', icono: 'fire', color: '#FF5722', descripcion: 'Adolescentes' },
      { nombre: 'JEF+', icono: 'fire', color: '#D32F2F', descripcion: 'Jóvenes mayores de 23 años' },
    ]
  },
  {
    padre: { nombre: 'Exploradores del Rey', icono: 'compass', color: '#009688', descripcion: 'Ministerio de Exploradores' },
    hijos: [
      { nombre: 'Exploradores', icono: 'compass', color: '#00796B', descripcion: '' },
      { nombre: 'Seguidores', icono: 'mapsigns', color: '#00796B', descripcion: '' },
      { nombre: 'Navegantes', icono: 'compass', color: '#00796B', descripcion: '' },
      { nombre: 'Pioneros', icono: 'mapsigns', color: '#00796B', descripcion: '' },
    ]
  },
  {
    padre: { nombre: 'Música', icono: 'music', color: '#673AB7', descripcion: 'Ministerio de Alabanza' },
    hijos: [
      { nombre: 'Músicos', icono: 'guitar', color: '#512DA8', descripcion: 'Banda musical' },
      { nombre: 'JEF Live', icono: 'music', color: '#7E57C2', descripcion: 'Banda juvenil' },
    ]
  }
];

async function main() {
  console.log('Limpiando ministerios anteriores...');
  await prisma.ministerio.deleteMany({}); // Borra todos

  console.log('Creando ministerios principales...');
  for (const min of data) {
    await prisma.ministerio.create({
      data: {
        nombre: min.nombre,
        icono: min.icono,
        color: min.color,
        descripcion: min.descripcion,
        activo: true
      }
    });
    console.log(`Creado: ${min.nombre}`);
  }

  console.log('Creando ministerios con subdivisiones...');
  for (const h of hierarchies) {
    const padre = await prisma.ministerio.create({
      data: {
        nombre: h.padre.nombre,
        icono: h.padre.icono,
        color: h.padre.color,
        descripcion: h.padre.descripcion,
        activo: true
      }
    });
    console.log(`Creado Padre: ${h.padre.nombre}`);

    for (const hijo of h.hijos) {
      await prisma.ministerio.create({
        data: {
          nombre: hijo.nombre,
          icono: hijo.icono,
          color: hijo.color,
          descripcion: hijo.descripcion,
          parentId: padre.id,
          activo: true
        }
      });
      console.log(`  -> Creado Hijo: ${hijo.nombre}`);
    }
  }

  console.log('¡Todos los ministerios fueron insertados exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
