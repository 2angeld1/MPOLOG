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
      carpeta: a.carpeta,
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
    let nombre = '';
    let url = '';
    let public_id = '';
    let formato = 'desconocido';
    let sizeInBytes = 0;
    let carpeta = '/';

    const contentType = request.headers.get('content-type') || '';
    const { prisma } = await import('@/lib/prisma');

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      carpeta = (formData.get('carpeta') as string) || '/';
      
      if (!file) {
        return NextResponse.json({ error: 'Archivo no proporcionado' }, { status: 400 });
      }

      nombre = file.name.split('.')[0];
      const buffer = Buffer.from(await file.arrayBuffer());
      const mimeType = file.type;
      const base64Data = buffer.toString('base64');
      const fileUri = `data:${mimeType};base64,${base64Data}`;
      
      let resource_type: 'image' | 'raw' | 'video' | 'auto' = 'auto';
      if (mimeType.startsWith('image/')) {
        resource_type = 'image';
      } else {
        resource_type = 'raw';
      }
      formato = mimeType.split('/')[1] || 'desconocido';
      sizeInBytes = file.size;

      // Clean folder path for Cloudinary (remove leading slash if root, otherwise keep hierarchy)
      const cloudinaryFolder = carpeta === '/' ? 'archivos_iglesia' : `archivos_iglesia${carpeta}`;

      const uploadResponse = await cloudinary.uploader.upload(fileUri, {
        folder: cloudinaryFolder,
        resource_type: resource_type,
      });

      url = uploadResponse.secure_url;
      public_id = uploadResponse.public_id;
    } else {
      // JSON body
      const body = await request.json();
      
      // Check if it's a request to create a virtual folder
      if (body.isFolder) {
        const { nombre: folderName, carpeta: parentCarpeta } = body;
        if (!folderName) {
          return NextResponse.json({ error: 'Nombre de la carpeta es requerido' }, { status: 400 });
        }

        let uniqueName = folderName;
        let counter = 1;

        while (true) {
          const existing = await prisma.archivo.findFirst({
            where: {
              nombre: uniqueName,
              formato: 'folder',
              carpeta: parentCarpeta || '/'
            }
          });

          if (!existing) {
            break;
          }

          uniqueName = `${folderName} ${counter}`;
          counter++;
        }

        const nuevaCarpeta = await prisma.archivo.create({
          data: {
            nombre: uniqueName,
            url: '',
            public_id: '',
            formato: 'folder',
            tamano: 0,
            subidoPorId: session.userId,
            subidoPorNombre: session.nombre,
            carpeta: parentCarpeta || '/'
          }
        });

        return NextResponse.json({ mensaje: 'Carpeta creada correctamente', archivo: { ...nuevaCarpeta, _id: nuevaCarpeta.id } }, { status: 201 });
      }

      const base64Content = body.base64Content;
      nombre = body.nombre;
      carpeta = body.carpeta || '/';

      if (!nombre || !base64Content) {
        return NextResponse.json({ error: 'Nombre y contenido del archivo son requeridos' }, { status: 400 });
      }

      let resource_type: 'image' | 'raw' | 'video' | 'auto' = 'auto';
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

      const stringLength = base64Content.length - (base64Content.indexOf(',') + 1);
      sizeInBytes = Math.ceil((stringLength * 3) / 4);

      const cloudinaryFolder = carpeta === '/' ? 'archivos_iglesia' : `archivos_iglesia${carpeta}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Content, {
        folder: cloudinaryFolder,
        resource_type: resource_type,
      });

      url = uploadResponse.secure_url;
      public_id = uploadResponse.public_id;
    }

    const nuevoArchivo = await prisma.archivo.create({
      data: {
        nombre,
        url,
        public_id,
        formato,
        tamano: sizeInBytes,
        subidoPorId: session.userId,
        subidoPorNombre: session.nombre,
        carpeta
      }
    });

    return NextResponse.json({ mensaje: 'Archivo subido correctamente', archivo: { ...nuevoArchivo, _id: nuevoArchivo.id } }, { status: 201 });
  } catch (error: any) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: error.message || 'Error al subir archivo' }, { status: 500 });
  }
}
