import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { miembros } = await request.json();

    if (!Array.isArray(miembros) || miembros.length === 0) {
      return NextResponse.json({ error: 'No hay datos válidos para importar' }, { status: 400 });
    }

    // Insertar en bloque (usando loop ya que MongoDB Prisma no soporta createMany con skipDuplicates)
    const insertedMiembros = [];
    for (const m of miembros) {
      const created = await prisma.miembroDirectorio.create({
        data: {
          nombre: m.nombre,
          edad: parseInt(m.edad, 10) || 0,
          telefono: String(m.telefono || ''),
          tiempoIglesia: m.tiempoIglesia || 'Menos de 1 año',
          esServidor: m.esServidor === 'true' || m.esServidor === true,
          dondeSirve: m.dondeSirve || null,
          parentesco: m.parentesco || null,
          fotoUrl: m.fotoUrl || null,
        },
      });
      insertedMiembros.push(created);
    }

    return NextResponse.json({ 
      mensaje: `Se importaron ${insertedMiembros.length} miembros correctamente`,
      count: insertedMiembros.length 
    }, { status: 201 });
  } catch (error) {
    console.error('Error importando miembros:', error);
    return NextResponse.json({ error: 'Error interno importando CSV' }, { status: 500 });
  }
}
