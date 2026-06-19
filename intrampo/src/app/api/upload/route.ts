import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getSession, isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  // Opcional: Permitir rol "editor" también
  const isEditorOrAdmin = session && (isAdmin(session) || session.roles.includes('editor'));
  
  if (!session || !isEditorOrAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'intrampo';

    if (!file) {
      return NextResponse.json({ error: 'Archivo no proporcionado' }, { status: 400 });
    }

    // Convert File to Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const encoding = 'base64';
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${mimeType};${encoding},${base64Data}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto',
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ error: 'Error interno al subir el archivo' }, { status: 500 });
  }
}
