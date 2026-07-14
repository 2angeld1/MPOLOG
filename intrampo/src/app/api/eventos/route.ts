import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { connectMongo, Evento } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    await connectMongo();

    // Support filtering by month/year via query params
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes');
    const anio = searchParams.get('anio');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (mes !== null && anio !== null) {
      const month = parseInt(mes);
      const year = parseInt(anio);
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);

      // Events that overlap with the requested month
      query.$or = [
        { fechaInicio: { $gte: startDate, $lte: endDate } },
        { fechaFin: { $gte: startDate, $lte: endDate } },
        { fechaInicio: { $lte: startDate }, fechaFin: { $gte: endDate } },
      ];
    }

    const eventos = await Evento.find(query)
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
        horaInicio: e.horaInicio,
        horaFin: e.horaFin,
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

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    await connectMongo();
    const body = await request.json();

    const { nombre, tipo, departamento, fechaInicio, fechaFin } = body;
    if (!nombre || !tipo || !departamento || !fechaInicio || !fechaFin) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    const evento = await Evento.create({
      nombre,
      tipo,
      departamento,
      color: body.color || undefined,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      precioTotal: body.precioTotal || 0,
      activo: body.activo !== false,
      descripcion: body.descripcion || '',
      ubicacion: body.ubicacion || undefined,
      horaInicio: body.horaInicio || undefined,
      horaFin: body.horaFin || undefined,
      usuario: session.userId,
    });

    return NextResponse.json({
      evento: {
        _id: String(evento._id),
        nombre: evento.nombre,
        tipo: evento.tipo,
        departamento: evento.departamento,
        color: evento.color || '#673AB7',
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin,
        precioTotal: evento.precioTotal,
        activo: evento.activo,
        descripcion: evento.descripcion,
        ubicacion: evento.ubicacion,
        horaInicio: evento.horaInicio,
        horaFin: evento.horaFin,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Crear evento error:', error);
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 });
  }
}
