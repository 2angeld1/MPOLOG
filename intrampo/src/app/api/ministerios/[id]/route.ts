import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, descripcion, color, icono, miembrosIds, liderIds, parentId } = body;

    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (color !== undefined) updateData.color = color;
    if (icono !== undefined) updateData.icono = icono;
    if (miembrosIds !== undefined) updateData.miembrosIds = miembrosIds;
    if (liderIds !== undefined) updateData.liderIds = liderIds;
    if (parentId !== undefined) updateData.parentId = parentId === '' ? null : parentId;

    const oldMinisterio = await prisma.ministerio.findUnique({ where: { id } });

    const ministerioActualizado = await prisma.ministerio.update({
      where: { id },
      data: updateData
    });

    // Sincronizar MiembrosDirectorio si se actualizó la lista de miembrosIds
    if (miembrosIds !== undefined && oldMinisterio) {
      const oldIds = oldMinisterio.miembrosIds;
      const newIds = miembrosIds as string[];

      const addedIds = newIds.filter(x => !oldIds.includes(x));
      const removedIds = oldIds.filter(x => !newIds.includes(x));

      // Agregar nombre del ministerio a los nuevos miembros
      if (addedIds.length > 0) {
        const addedMembers = await prisma.miembroDirectorio.findMany({ where: { id: { in: addedIds } } });
        for (const m of addedMembers) {
          const currentAreas = m.dondeSirve ? m.dondeSirve.split(',').map(s => s.trim()).filter(Boolean) : [];
          if (!currentAreas.includes(ministerioActualizado.nombre)) {
            currentAreas.push(ministerioActualizado.nombre);
            await prisma.miembroDirectorio.update({
              where: { id: m.id },
              data: { dondeSirve: currentAreas.join(', ') }
            });
          }
        }
      }

      // Remover nombre del ministerio de los miembros que salieron
      if (removedIds.length > 0) {
        const removedMembers = await prisma.miembroDirectorio.findMany({ where: { id: { in: removedIds } } });
        for (const m of removedMembers) {
          if (m.dondeSirve) {
            const currentAreas = m.dondeSirve.split(',').map(s => s.trim()).filter(Boolean);
            const newAreas = currentAreas.filter(a => a !== ministerioActualizado.nombre && a !== oldMinisterio.nombre);
            await prisma.miembroDirectorio.update({
              where: { id: m.id },
              data: { dondeSirve: newAreas.join(', ') }
            });
          }
        }
      }
    }

    return NextResponse.json({ mensaje: 'Ministerio actualizado', ministerio: ministerioActualizado });
  } catch (error) {
    console.error('Error actualizando ministerio:', error);
    return NextResponse.json({ error: 'Error al actualizar ministerio' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    await prisma.ministerio.delete({
      where: { id }
    });

    return NextResponse.json({ mensaje: 'Ministerio eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando ministerio:', error);
    return NextResponse.json({ error: 'Error al eliminar ministerio' }, { status: 500 });
  }
}
