import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo, Evento } from '@/lib/mongodb';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    await connectMongo();

    const eventos = await Evento.find({})
      .sort({ fechaInicio: -1 })
      .lean();

    return NextResponse.json({
      eventos: eventos.map((e: Record<string, unknown>) => ({
        _id: String(e._id),
        nombre: e.nombre,
        tipo: e.tipo,
        departamento: e.departamento,
        color: e.color || '#673AB7',
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        precioTotal: e.precioTotal,
        activo: e.activo,
        descripcion: e.descripcion,
        ubicacion: e.ubicacion,
        equipos: e.equipos,
      })),
    });
  } catch (error) {
    console.error('Eventos error:', error);
    return NextResponse.json(
      { error: 'Error al cargar eventos' },
      { status: 500 }
    );
  }
}
