import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const respuestas = await prisma.respuestaFormulario.findMany({
      where: { formularioId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(respuestas.map(r => ({
      ...r,
      _id: r.id
    })));
  } catch (error) {
    console.error('Error fetching respuestas:', error);
    return NextResponse.json({ error: 'Error al obtener respuestas' }, { status: 500 });
  }
}
