import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { connectMongo } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';

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
    const { prisma } = await import('@/lib/prisma');

    const archivo = await prisma.archivo.findUnique({ where: { id } });
    if (!archivo) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    // Determinar el resource_type basado en el formato para borrar de Cloudinary
    let resource_type: 'image' | 'raw' | 'video' = 'image';
    if (archivo.formato === 'pdf' || archivo.formato === 'document' || !['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(archivo.formato)) {
        resource_type = 'raw';
    }

    try {
        await cloudinary.uploader.destroy(archivo.public_id, { resource_type });
    } catch (err) {
        console.warn('Error al borrar archivo de Cloudinary (probablemente ya no existe)', err);
    }

    await prisma.archivo.delete({ where: { id } });

    return NextResponse.json({ mensaje: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 });
  }
}
