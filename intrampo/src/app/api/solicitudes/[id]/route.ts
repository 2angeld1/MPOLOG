import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin, hasRole } from '@/lib/auth';
import { connectMongo } from '@/lib/mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const { action, observacionesRetorno } = data; // action: 'aprobar', 'retirar', 'devolver'

    const { prisma } = await import('@/lib/prisma');
    const solicitud = await prisma.solicitudRecurso.findUnique({ where: { id } });

    if (!solicitud) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    let nuevoEstado = solicitud.estado;
    let nuevasObservaciones = solicitud.observacionesRetorno;

    if (action === 'retirar') {
      if (!isAdmin(session) && solicitud.liderId !== session.userId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
      nuevoEstado = 'Retirado';
    } 
    else if (action === 'devolver') {
      if (!isAdmin(session) && solicitud.liderId !== session.userId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
      nuevoEstado = 'Disponible';
      if (observacionesRetorno) {
        nuevasObservaciones = observacionesRetorno;
      }
    } else {
      return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
    }

    const updatedSolicitud = await prisma.solicitudRecurso.update({
      where: { id },
      data: { estado: nuevoEstado, observacionesRetorno: nuevasObservaciones }
    });

    return NextResponse.json({ mensaje: `Solicitud actualizada: ${action}`, solicitud: updatedSolicitud });
  } catch (error) {
    console.error('Error actualizando solicitud:', error);
    return NextResponse.json({ error: 'Error al actualizar solicitud' }, { status: 500 });
  }
}
