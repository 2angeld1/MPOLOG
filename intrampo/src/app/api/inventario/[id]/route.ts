import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const safeRoles = session.roles?.map((r: string) => r.toLowerCase()) || [];
  const canManage = safeRoles.some((r: string) => ['admin', 'superadmin', 'logisticadmin', 'pastor', 'logistica', 'logística'].includes(r));
  if (!canManage) {
    return NextResponse.json({ error: 'Acceso denegado. Solo pastores y encargados del ministerio de logística pueden modificar items.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, descripcion, estado, imagenUrl, imagenPublicId, archivoId, ministerioId, ministerioNombre, cantidad, ubicacion, notas } = body;

    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (estado !== undefined) updateData.estado = estado;
    if (imagenUrl !== undefined) updateData.imagenUrl = imagenUrl || null;
    if (imagenPublicId !== undefined) updateData.imagenPublicId = imagenPublicId || null;
    if (archivoId !== undefined) updateData.archivoId = archivoId || null;
    if (ministerioId !== undefined) updateData.ministerioId = ministerioId || null;
    if (ministerioNombre !== undefined) updateData.ministerioNombre = ministerioNombre || null;
    if (cantidad !== undefined) updateData.cantidad = parseInt(cantidad, 10) || 1;
    if (ubicacion !== undefined) updateData.ubicacion = ubicacion || null;
    if (notas !== undefined) updateData.notas = notas || null;

    const itemActualizado = await prisma.itemInventario.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ mensaje: 'Item actualizado', item: { ...itemActualizado, _id: itemActualizado.id } });
  } catch (error) {
    console.error('Error actualizando item:', error);
    return NextResponse.json({ error: 'Error al actualizar item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const safeRoles = session.roles?.map((r: string) => r.toLowerCase()) || [];
  const canManage = safeRoles.some((r: string) => ['admin', 'superadmin', 'logisticadmin', 'pastor', 'logistica', 'logística'].includes(r));
  if (!canManage) {
    return NextResponse.json({ error: 'Acceso denegado. Solo pastores y encargados del ministerio de logística pueden eliminar items.' }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Obtener el item para limpiar imagen de Cloudinary si existe
    const item = await prisma.itemInventario.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    }

    // Eliminar imagen de Cloudinary si tiene public_id propio
    if (item.imagenPublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagenPublicId);
      } catch (err) {
        console.error('Error eliminando imagen de Cloudinary:', err);
      }
    }

    await prisma.itemInventario.delete({ where: { id } });

    return NextResponse.json({ mensaje: 'Item eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando item:', error);
    return NextResponse.json({ error: 'Error al eliminar item' }, { status: 500 });
  }
}
