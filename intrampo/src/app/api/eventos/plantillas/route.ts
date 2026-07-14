import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { connectMongo, EventoPlantilla } from '@/lib/mongodb';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    await connectMongo();

    const plantillas = await EventoPlantilla.find({})
      .sort({ usageCount: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json({
      plantillas: plantillas.map((p: Record<string, unknown>) => ({
        _id: String(p._id),
        nombre: p.nombre,
        tipo: p.tipo,
        departamento: p.departamento,
        color: p.color,
        descripcion: p.descripcion,
        horaInicio: p.horaInicio,
        horaFin: p.horaFin,
        diaSemana: p.diaSemana,
        precioTotal: p.precioTotal,
        ubicacion: p.ubicacion,
        usageCount: p.usageCount || 0,
      })),
    });
  } catch (error) {
    console.error('Plantillas error:', error);
    return NextResponse.json(
      { error: 'Error al cargar plantillas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    await connectMongo();
    const body = await request.json();

    const { nombre, tipo, departamento } = body;
    if (!nombre || !tipo || !departamento) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    const plantilla = await EventoPlantilla.create({
      nombre,
      tipo,
      departamento,
      color: body.color || undefined,
      descripcion: body.descripcion || '',
      horaInicio: body.horaInicio || undefined,
      horaFin: body.horaFin || undefined,
      diaSemana: body.diaSemana ?? undefined,
      precioTotal: body.precioTotal || 0,
      ubicacion: body.ubicacion || undefined,
      usageCount: 0,
      usuario: session.userId,
    });

    return NextResponse.json({ plantilla }, { status: 201 });
  } catch (error) {
    console.error('Crear plantilla error:', error);
    return NextResponse.json({ error: 'Error al crear plantilla' }, { status: 500 });
  }
}
