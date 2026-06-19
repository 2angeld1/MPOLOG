import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo, User, PersonaDetallada } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    await connectMongo();

    const searchParams = request.nextUrl.searchParams;
    const departamento = searchParams.get('departamento');
    const buscar = searchParams.get('buscar');

    // Get personas detalladas (main member registry)
    const personaFilter: Record<string, unknown> = {};
    if (departamento && departamento !== 'todos') {
      personaFilter.departamento = departamento;
    }
    if (buscar) {
      personaFilter.$or = [
        { nombre: { $regex: buscar, $options: 'i' } },
        { apellido: { $regex: buscar, $options: 'i' } },
      ];
    }

    const personas = await PersonaDetallada.find(personaFilter)
      .sort({ nombre: 1 })
      .lean();

    // Get system users
    const users = await User.find({}, { password: 0 })
      .sort({ nombre: 1 })
      .lean();

    // Get unique departments
    const departamentos = await PersonaDetallada.distinct('departamento');

    return NextResponse.json({
      personas: personas.map((p: Record<string, unknown>) => ({
        _id: String(p._id),
        nombre: p.nombre,
        apellido: p.apellido,
        telefono: p.telefono,
        edad: p.edad,
        correo: p.correo,
        grupo: p.grupo,
        departamento: p.departamento,
        foto: p.foto,
        asistencias: Array.isArray(p.asistencias) ? p.asistencias.length : 0,
      })),
      users: users.map((u: Record<string, unknown>) => ({
        _id: String(u._id),
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        roles: u.roles,
      })),
      departamentos,
    });
  } catch (error) {
    console.error('Miembros error:', error);
    return NextResponse.json(
      { error: 'Error al cargar miembros' },
      { status: 500 }
    );
  }
}
