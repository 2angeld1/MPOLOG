import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { connectMongo } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { prisma } = await import('@/lib/prisma');
    const archivos = await prisma.archivo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Devolver formato compatible con la vista actual
    const archivosMapped = archivos.map(a => ({
      _id: a.id,
      nombre: a.nombre,
      url: a.url,
      public_id: a.public_id,
      formato: a.formato,
      tamano: a.tamano,
      subidoPor: { nombre: a.subidoPorNombre, email: '' },
      createdAt: a.createdAt
    }));
    
    return NextResponse.json(archivosMapped);
  } catch (error) {
    console.error('Error fetching archivos:', error);
    return NextResponse.json({ error: 'Error al obtener archivos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado. Solo los administradores pueden subir archivos.' }, { status: 403 });
  }

  try {
    const { nombre, base64Content } = await request.json();

    if (!nombre || !base64Content) {
      return NextResponse.json({ error: 'Nombre y contenido del archivo son requeridos' }, { status: 400 });
    }

    await connectMongo();

    // Identificar el tipo de recurso ('image' o 'raw' para pdf/doc)
    let resource_type: 'image' | 'raw' | 'video' | 'auto' = 'auto';
    let formato = 'desconocido';

    const match = base64Content.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (match) {
        const mimeType = match[1];
        if (mimeType.startsWith('image/')) {
            resource_type = 'image';
        } else {
            resource_type = 'raw';
        }
        formato = mimeType.split('/')[1];
    }

    // Calcular el tamaño aproximado en base64
    const stringLength = base64Content.length - (base64Content.indexOf(',') + 1);
    const sizeInBytes = Math.ceil((stringLength * 3) / 4);

    const uploadResponse = await cloudinary.uploader.upload(base64Content, {
      folder: 'archivos_iglesia',
      resource_type: resource_type,
    });

    const { prisma } = await import('@/lib/prisma');

    const nuevoArchivo = await prisma.archivo.create({
      data: {
        nombre,
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
        formato,
        tamano: sizeInBytes,
        subidoPorId: session.userId,
        subidoPorNombre: session.nombre
      }
    });

    return NextResponse.json({ mensaje: 'Archivo subido correctamente', archivo: { ...nuevoArchivo, _id: nuevoArchivo.id } }, { status: 201 });
  } catch (error: any) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: error.message || 'Error al subir archivo' }, { status: 500 });
  }
}
