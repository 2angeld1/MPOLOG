import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const buscar = searchParams.get('buscar');
    const estado = searchParams.get('estado');
    const ministerio = searchParams.get('ministerio');

    const whereClause: any = { activo: true };
    if (buscar) {
      whereClause.OR = [
        { nombre: { contains: buscar, mode: 'insensitive' } },
        { descripcion: { contains: buscar, mode: 'insensitive' } },
      ];
    }
    if (estado) {
      whereClause.estado = estado;
    }
    if (ministerio) {
      whereClause.ministerioNombre = ministerio;
    }

    const items = await prisma.itemInventario.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      items: items.map((item: any) => ({
        _id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        estado: item.estado,
        imagenUrl: item.imagenUrl,
        imagenPublicId: item.imagenPublicId,
        archivoId: item.archivoId,
        ministerioId: item.ministerioId,
        ministerioNombre: item.ministerioNombre,
        cantidad: item.cantidad,
        ubicacion: item.ubicacion,
        notas: item.notas,
        creadoPorId: item.creadoPorId,
        creadoPorNombre: item.creadoPorNombre,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Inventario error:', error);
    return NextResponse.json(
      { error: 'Error al cargar inventario' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const safeRoles = session.roles?.map((r: string) => r.toLowerCase()) || [];
  const canManage = safeRoles.some((r: string) => ['admin', 'superadmin', 'logisticadmin', 'pastor', 'logistica', 'logística'].includes(r));
  if (!canManage) {
    return NextResponse.json({ error: 'Acceso denegado. Solo pastores y encargados del ministerio de logística pueden cargar items.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nombre, descripcion, estado, imagenUrl, imagenPublicId, archivoId, ministerioId, ministerioNombre, cantidad, ubicacion, notas } = body;

    if (!nombre || !descripcion || !estado) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (nombre, descripcion, estado)' }, { status: 400 });
    }

    const nuevoItem = await prisma.itemInventario.create({
      data: {
        nombre,
        descripcion,
        estado,
        imagenUrl: imagenUrl || null,
        imagenPublicId: imagenPublicId || null,
        archivoId: archivoId || null,
        ministerioId: ministerioId || null,
        ministerioNombre: ministerioNombre || null,
        cantidad: parseInt(cantidad, 10) || 1,
        ubicacion: ubicacion || null,
        notas: notas || null,
        creadoPorId: session.userId,
        creadoPorNombre: session.nombre,
      }
    });

    return NextResponse.json({ item: { ...nuevoItem, _id: nuevoItem.id } }, { status: 201 });
  } catch (error) {
    console.error('Error al crear item de inventario:', error);
    return NextResponse.json({ error: 'Error al crear item' }, { status: 500 });
  }
}
