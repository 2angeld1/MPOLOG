import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo, ConteoPersonas } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    await connectMongo();

    const searchParams = request.nextUrl.searchParams;
    const iglesia = searchParams.get('iglesia');
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');

    const filter: Record<string, unknown> = { tipo: 'personas' };

    if (iglesia && iglesia !== 'todas') {
      filter.iglesia = iglesia;
    }

    if (desde || hasta) {
      filter.fecha = {};
      if (desde) (filter.fecha as Record<string, unknown>).$gte = new Date(desde);
      if (hasta) (filter.fecha as Record<string, unknown>).$lte = new Date(hasta);
    }

    const conteos = await ConteoPersonas.find(filter)
      .sort({ fecha: -1 })
      .limit(200)
      .lean();

    // Group by church for comparison
    const porIglesia: Record<string, number> = {};
    const porArea: Record<string, number> = {};

    conteos.forEach((c: Record<string, unknown>) => {
      const church = String(c.iglesia || 'Sin iglesia');
      const area = String(c.area || 'Sin área');
      const qty = Number(c.cantidad) || 0;
      porIglesia[church] = (porIglesia[church] || 0) + qty;
      porArea[area] = (porArea[area] || 0) + qty;
    });

    // Weekly trend
    const weeklyTrend: Record<string, number> = {};
    conteos.forEach((c: Record<string, unknown>) => {
      const date = new Date(c.fecha as string);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split('T')[0];
      weeklyTrend[key] = (weeklyTrend[key] || 0) + (Number(c.cantidad) || 0);
    });

    // Get available churches
    const iglesias = await ConteoPersonas.distinct('iglesia');

    return NextResponse.json({
      conteos: conteos.map((c: Record<string, unknown>) => ({
        _id: String(c._id),
        fecha: c.fecha,
        iglesia: c.iglesia,
        area: c.area,
        cantidad: c.cantidad,
        observaciones: c.observaciones,
      })),
      porIglesia,
      porArea,
      weeklyTrend,
      iglesias,
    });
  } catch (error) {
    console.error('Asistencia error:', error);
    return NextResponse.json(
      { error: 'Error al cargar asistencia' },
      { status: 500 }
    );
  }
}
