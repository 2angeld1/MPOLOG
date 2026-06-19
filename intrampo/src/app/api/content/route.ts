import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, isAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const contenidos = await prisma.contenidoDinamico.findMany();
    const map = contenidos.reduce((acc: Record<string, string>, item: { llave: string; valor: string }) => {
      acc[item.llave] = item.valor;
      return acc;
    }, {});
    
    return NextResponse.json({ contenidos: map });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ contenidos: {} });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  const isEditorOrAdmin = session && (isAdmin(session) || session.roles.includes('editor'));
  
  if (!session || !isEditorOrAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { llave, tipo, valor } = await request.json();

    if (!llave || !valor) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    const contenido = await prisma.contenidoDinamico.upsert({
      where: { llave },
      update: { valor },
      create: { llave, tipo: tipo || 'texto', valor },
    });

    return NextResponse.json({ success: true, contenido });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}
