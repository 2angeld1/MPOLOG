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

    const ministerioActualizado = await prisma.ministerio.update({
      where: { id },
      data: updateData
    });

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
