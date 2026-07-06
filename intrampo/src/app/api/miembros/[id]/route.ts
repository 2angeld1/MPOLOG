import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, edad, telefono, tiempoIglesia, esServidor, dondeSirve, parentesco, fotoUrl } = body;

    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (edad !== undefined) updateData.edad = parseInt(edad, 10) || 0;
    if (telefono !== undefined) updateData.telefono = String(telefono);
    if (tiempoIglesia !== undefined) updateData.tiempoIglesia = tiempoIglesia;
    if (esServidor !== undefined) updateData.esServidor = Boolean(esServidor);
    if (dondeSirve !== undefined) updateData.dondeSirve = dondeSirve || null;
    if (parentesco !== undefined) updateData.parentesco = parentesco || null;
    if (fotoUrl !== undefined) updateData.fotoUrl = fotoUrl || null;

    const miembroActualizado = await prisma.miembroDirectorio.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ mensaje: 'Miembro actualizado', miembro: miembroActualizado });
  } catch (error) {
    console.error('Error actualizando miembro:', error);
    return NextResponse.json({ error: 'Error al actualizar miembro' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    // Al eliminar un miembro, también deberíamos sacarlo de los ministerios donde esté.
    // Aunque en MongoDB relacionalmente se pueden quedar IDs huérfanos, es buena práctica limpiarlos.
    const ministerios = await prisma.ministerio.findMany({
      where: { miembrosIds: { has: id } }
    });

    for (const min of ministerios) {
      await prisma.ministerio.update({
        where: { id: min.id },
        data: {
          miembrosIds: min.miembrosIds.filter(mId => mId !== id)
        }
      });
    }

    await prisma.miembroDirectorio.delete({
      where: { id }
    });

    return NextResponse.json({ mensaje: 'Miembro eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando miembro:', error);
    return NextResponse.json({ error: 'Error al eliminar miembro' }, { status: 500 });
  }
}
