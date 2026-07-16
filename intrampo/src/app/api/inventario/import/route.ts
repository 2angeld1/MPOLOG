import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const safeRoles = session.roles?.map((r: string) => r.toLowerCase()) || [];
  const canManage = safeRoles.some((r: string) => ['admin', 'superadmin', 'logisticadmin', 'pastor', 'logistica', 'logística'].includes(r));
  if (!canManage) {
    return NextResponse.json({ error: 'Acceso denegado. Solo pastores y encargados del ministerio de logística pueden importar datos.' }, { status: 403 });
  }

  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No hay datos válidos para importar' }, { status: 400 });
    }

    const insertedItems = [];
    for (const item of items) {
      const created = await prisma.itemInventario.create({
        data: {
          nombre: item.nombre || 'Sin nombre',
          descripcion: item.descripcion || 'Sin descripción',
          estado: item.estado || 'Bueno',
          ministerioNombre: item.ministerioNombre || item.ministerio || item.area || null,
          cantidad: parseInt(item.cantidad, 10) || 1,
          ubicacion: item.ubicacion || null,
          notas: item.notas || null,
          creadoPorId: session.userId,
          creadoPorNombre: session.nombre,
        },
      });
      insertedItems.push(created);
    }

    return NextResponse.json({
      mensaje: `Se importaron ${insertedItems.length} items correctamente`,
      count: insertedItems.length
    }, { status: 201 });
  } catch (error) {
    console.error('Error importando inventario:', error);
    return NextResponse.json({ error: 'Error interno importando datos' }, { status: 500 });
  }
}
