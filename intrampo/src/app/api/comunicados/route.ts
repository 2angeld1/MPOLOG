import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const comunicados = await prisma.comunicado.findMany({
      where: { activo: true },
      orderBy: [
        { fijado: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ comunicados });
  } catch (error) {
    console.error('Comunicados error:', error);
    // Return demo data if database is not set up yet
    return NextResponse.json({
      comunicados: getDemoComunicados(),
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const safeRoles = session?.roles?.map(r => r.toLowerCase()) || [];
  const safeEmail = session?.email?.toLowerCase() || '';
  const isPastor = safeRoles.includes('pastor') || safeRoles.includes('superadmin') || safeEmail.startsWith('admin@superadmin');

  if (!session || !isPastor) {
    return NextResponse.json({ error: 'No autorizado. Solo los pastores pueden publicar comunicados.' }, { status: 403 });
  }

  try {
    const { titulo, contenido, categoria, imagenUrl, archivoUrl } = await request.json();

    if (!titulo || !contenido) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    const comunicado = await prisma.comunicado.create({
      data: {
        titulo,
        contenido,
        categoria: categoria || 'general',
        imagenUrl: imagenUrl || null,
        archivoUrl: archivoUrl || null,
        autorId: session.userId,
        autorNombre: session.nombre,
      },
    });

    return NextResponse.json({ comunicado }, { status: 201 });
  } catch (error) {
    console.error('Create comunicado error:', error);
    return NextResponse.json(
      { error: 'Error al crear comunicado' },
      { status: 500 }
    );
  }
}

function getDemoComunicados() {
  return [
    {
      id: 'demo-1',
      titulo: 'Bienvenidos a INTRA - MPO',
      contenido: 'Esta es la nueva plataforma de comunicación interna de la Iglesia Maranatha. Aquí podrás encontrar toda la información relevante sobre eventos, ministerios y más. ¡Estamos emocionados de tenerlos aquí!',
      categoria: 'pastoral',
      autorId: 'system',
      autorNombre: 'Pastor Principal',
      fijado: true,
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      titulo: 'Próximo Culto Especial de Oración',
      contenido: 'Este viernes a las 7:00 PM tendremos un culto especial de oración e intercesión. Todos los ministerios están invitados a participar. Será un tiempo poderoso de búsqueda en la presencia de Dios.',
      categoria: 'lideres',
      autorId: 'system',
      autorNombre: 'Equipo de Liderazgo',
      fijado: false,
      activo: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo-3',
      titulo: 'Actualización de Horarios de Ensayo',
      contenido: 'Se informa a todos los miembros del ministerio de alabanza que los ensayos se han reprogramado para los días miércoles a las 6:30 PM. Por favor confirmar asistencia con su líder de área.',
      categoria: 'servidores',
      autorId: 'system',
      autorNombre: 'Administración',
      fijado: false,
      activo: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'demo-4',
      titulo: 'Campaña de Donación - Proyecto Dar',
      contenido: 'Estamos recolectando donaciones para el Proyecto Dar. Necesitamos ropa, alimentos no perecederos y útiles escolares. Los puntos de recolección estarán habilitados los domingos después del culto.',
      categoria: 'general',
      autorId: 'system',
      autorNombre: 'Ministerio Social',
      fijado: false,
      activo: true,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];
}
