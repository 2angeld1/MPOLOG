import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const sugerencias = await prisma.campoSugerido.findMany({
      orderBy: { label: 'asc' }
    });

    return NextResponse.json(sugerencias.map(s => ({
      ...s,
      _id: s.id
    })));
  } catch (error) {
    console.error('Error fetching sugerencias:', error);
    return NextResponse.json({ error: 'Error al obtener sugerencias de campos' }, { status: 500 });
  }
}
