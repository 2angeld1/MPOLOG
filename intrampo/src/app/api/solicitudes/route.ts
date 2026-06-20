import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin, hasRole } from '@/lib/auth';
import { connectMongo } from '@/lib/mongodb';

// Obtener las solicitudes (Líderes ven las suyas, Admin ven todas)
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { prisma } = await import('@/lib/prisma');
    let solicitudes;

    if (isAdmin(session)) {
      solicitudes = await prisma.solicitudRecurso.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } else {
      solicitudes = await prisma.solicitudRecurso.findMany({
        where: { liderId: session.userId },
        orderBy: { createdAt: 'desc' }
      });
    }

    // Mapear para compatibilidad con la vista
    const solicitudesMapped = solicitudes.map(s => ({
      ...s,
      _id: s.id,
      lider: { nombre: s.liderNombre || 'Desconocido', email: '' }
    }));

    return NextResponse.json(solicitudesMapped);
  } catch (error) {
    console.error('Error fetching solicitudes:', error);
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
  }
}

// Crear una solicitud (Líderes y Admin pueden crear)
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  // Un "pastor", "admin", o "lideres" puede solicitar. "servidores" y "general" no.
  if (!session || (!isAdmin(session) && !hasRole(session, ['lideres']))) {
    return NextResponse.json({ error: 'No autorizado. Solo líderes pueden solicitar recursos.' }, { status: 403 });
  }

  try {
    const data = await request.json();

    if (!data.descripcionEquipo || !data.fechaSalida || !data.fechaEstimadaRegreso) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { prisma } = await import('@/lib/prisma');

    const nuevaSolicitud = await prisma.solicitudRecurso.create({
      data: {
        liderId: session.userId,
        liderNombre: session.nombre,
        descripcionEquipo: data.descripcionEquipo,
        fotoEstadoActual: data.fotoEstadoActual || null,
        fechaSalida: new Date(data.fechaSalida),
        fechaEstimadaRegreso: new Date(data.fechaEstimadaRegreso),
        estado: 'Solicitado'
      }
    });

    return NextResponse.json({ mensaje: 'Solicitud creada con éxito', solicitud: { ...nuevaSolicitud, _id: nuevaSolicitud.id } }, { status: 201 });
  } catch (error) {
    console.error('Error creando solicitud:', error);
    return NextResponse.json({ error: 'Error al crear solicitud' }, { status: 500 });
  }
}
