import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { connectMongo, User } from '@/lib/mongodb';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const ministerios = await prisma.ministerio.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });

    // Enrich with member names from MongoDB
    await connectMongo();
    const enriched = await Promise.all(
      ministerios.map(async (m) => {
        const lideres = m.liderIds.length > 0
          ? await User.find({ _id: { $in: m.liderIds } }, { nombre: 1 }).lean()
          : [];
        return {
          ...m,
          lideres: lideres.map((l: Record<string, unknown>) => ({
            _id: String(l._id),
            nombre: l.nombre,
          })),
          totalMiembros: m.miembrosIds.length,
        };
      })
    );

    return NextResponse.json({ ministerios: enriched });
  } catch (error) {
    console.error('Ministerios error:', error);
    // Return demo data
    return NextResponse.json({
      ministerios: getDemoMinisterios(),
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { nombre, descripcion, color, icono } = await request.json();

    if (!nombre) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      );
    }

    const ministerio = await prisma.ministerio.create({
      data: {
        nombre,
        descripcion,
        color: color || '#673AB7',
        icono: icono || 'church',
      },
    });

    return NextResponse.json({ ministerio }, { status: 201 });
  } catch (error) {
    console.error('Create ministerio error:', error);
    return NextResponse.json(
      { error: 'Error al crear ministerio' },
      { status: 500 }
    );
  }
}

function getDemoMinisterios() {
  return [
    {
      id: 'demo-1',
      nombre: 'Alabanza y Adoración',
      descripcion: 'Ministerio encargado de dirigir la adoración congregacional a través de la música y el canto.',
      liderIds: [],
      color: '#673AB7',
      icono: '🎵',
      miembrosIds: [],
      activo: true,
      lideres: [{ _id: 'demo', nombre: 'Líder de Alabanza' }],
      totalMiembros: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      nombre: 'JEF Teen',
      descripcion: 'Ministerio juvenil para adolescentes de 13 a 17 años. Actividades, devocionales y discipulado.',
      liderIds: [],
      color: '#E91E63',
      icono: '🔥',
      miembrosIds: [],
      activo: true,
      lideres: [{ _id: 'demo', nombre: 'Líder JEF Teen' }],
      totalMiembros: 28,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      nombre: 'Mentor Club (Kids)',
      descripcion: 'Ministerio infantil para niños de 4 a 12 años. Enseñanza bíblica creativa y actividades.',
      liderIds: [],
      color: '#FF9800',
      icono: '🧒',
      miembrosIds: [],
      activo: true,
      lideres: [{ _id: 'demo', nombre: 'Líder Kids' }],
      totalMiembros: 35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      nombre: 'Media & Producción',
      descripcion: 'Ministerio de producción audiovisual, sonido, luces y transmisiones en vivo.',
      liderIds: [],
      color: '#2196F3',
      icono: '🎬',
      miembrosIds: [],
      activo: true,
      lideres: [{ _id: 'demo', nombre: 'Líder de Media' }],
      totalMiembros: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-5',
      nombre: 'Evangelismo',
      descripcion: 'Ministerio de alcance y evangelismo en las comunidades. Evangelismo Cambia, outreaches y más.',
      liderIds: [],
      color: '#4CAF50',
      icono: '🌍',
      miembrosIds: [],
      activo: true,
      lideres: [{ _id: 'demo', nombre: 'Líder de Evangelismo' }],
      totalMiembros: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-6',
      nombre: 'Servidores & Logística',
      descripcion: 'Equipo de servidores encargados de la logística, seguridad, cafetería y protocolo.',
      liderIds: [],
      color: '#795548',
      icono: '🤝',
      miembrosIds: [],
      activo: true,
      lideres: [{ _id: 'demo', nombre: 'Líder de Servidores' }],
      totalMiembros: 22,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
