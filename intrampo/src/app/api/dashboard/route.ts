import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo, User, Evento, ConteoPersonas, PersonaDetallada } from '@/lib/mongodb';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    await connectMongo();

    // Parallel queries for dashboard stats
    const [totalUsers, totalPersonas, activeEvents, recentConteos] = await Promise.all([
      User.countDocuments(),
      PersonaDetallada.countDocuments(),
      Evento.countDocuments({ activo: true }),
      ConteoPersonas.find({ tipo: 'personas' })
        .sort({ fecha: -1 })
        .limit(50)
        .lean(),
    ]);

    // Calculate average attendance from recent counts
    const totalAsistencia = recentConteos.reduce(
      (sum: number, c: Record<string, unknown>) => sum + (Number(c.cantidad) || 0),
      0
    );
    const promedioAsistencia = recentConteos.length > 0
      ? Math.round(totalAsistencia / recentConteos.length)
      : 0;

    // Get upcoming events
    const now = new Date();
    const proximosEventos = await Evento.find({
      activo: true,
      fechaFin: { $gte: now },
    })
      .sort({ fechaInicio: 1 })
      .limit(5)
      .lean();

    // Weekly attendance for chart (last 8 weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const weeklyConteos = await ConteoPersonas.find({
      tipo: 'personas',
      fecha: { $gte: eightWeeksAgo },
    })
      .sort({ fecha: 1 })
      .lean();

    // Group by week
    const weeklyData: Record<string, number> = {};
    weeklyConteos.forEach((c: Record<string, unknown>) => {
      const date = new Date(c.fecha as string);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split('T')[0];
      weeklyData[key] = (weeklyData[key] || 0) + (Number(c.cantidad) || 0);
    });

    return NextResponse.json({
      stats: {
        totalMiembros: totalUsers + totalPersonas,
        eventosActivos: activeEvents,
        asistenciaPromedio: promedioAsistencia,
        totalMinisterios: 6, // Default ministerios count
      },
      proximosEventos: proximosEventos.map((e: Record<string, unknown>) => ({
        _id: String(e._id),
        nombre: e.nombre,
        tipo: e.tipo,
        color: e.color || '#673AB7',
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        departamento: e.departamento,
        descripcion: e.descripcion,
        ubicacion: e.ubicacion,
      })),
      weeklyAttendance: weeklyData,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Error al cargar datos del dashboard' },
      { status: 500 }
    );
  }
}
