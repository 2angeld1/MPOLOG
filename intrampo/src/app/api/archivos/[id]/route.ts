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

    if (archivo.formato === 'folder') {
      // Determine folder path: e.g. '/directorio'
      const folderPath = archivo.carpeta === '/' ? `/${archivo.nombre}` : `${archivo.carpeta}/${archivo.nombre}`;

      // Find all files and subfolders inside it
      const childFiles = await prisma.archivo.findMany({
        where: {
          OR: [
            { carpeta: folderPath },
            { carpeta: { startsWith: `${folderPath}/` } }
          ]
        }
      });

      // Delete files from Cloudinary
      for (const child of childFiles) {
        if (child.formato !== 'folder' && child.public_id) {
          let resource_type: 'image' | 'raw' | 'video' = 'image';
          if (child.formato === 'pdf' || child.formato === 'document' || !['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(child.formato)) {
              resource_type = 'raw';
          }
          try {
            await cloudinary.uploader.destroy(child.public_id, { resource_type });
          } catch (err) {
            console.warn('Error deleting from Cloudinary', err);
          }
        }
      }

      // Delete child records from DB
      await prisma.archivo.deleteMany({
        where: {
          OR: [
            { carpeta: folderPath },
            { carpeta: { startsWith: `${folderPath}/` } }
          ]
        }
      });
    } else {
      // Standard file deletion from Cloudinary
      let resource_type: 'image' | 'raw' | 'video' = 'image';
      if (archivo.formato === 'pdf' || archivo.formato === 'document' || !['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(archivo.formato)) {
          resource_type = 'raw';
      }

      try {
          await cloudinary.uploader.destroy(archivo.public_id, { resource_type });
      } catch (err) {
          console.warn('Error al borrar archivo de Cloudinary (probablemente ya no existe)', err);
      }
    }

    await prisma.archivo.delete({ where: { id } });

    return NextResponse.json({ mensaje: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 });
  }
}
