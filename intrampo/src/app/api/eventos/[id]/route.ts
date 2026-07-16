import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { connectMongo, Evento } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const allowedFields = [
      'nombre', 'tipo', 'departamento', 'color', 'precioTotal',
      'activo', 'descripcion', 'ubicacion', 'horaInicio', 'horaFin',
      'visibleSoloPor',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Handle date fields separately
    if (body.fechaInicio) updateData.fechaInicio = new Date(body.fechaInicio);
    if (body.fechaFin) updateData.fechaFin = new Date(body.fechaFin);

    const evento = await Evento.findByIdAndUpdate(id, updateData, { new: true }).lean();

    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const e = evento as Record<string, unknown>;
    return NextResponse.json({
      evento: {
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
        horaInicio: e.horaInicio,
        horaFin: e.horaFin,
        visibleSoloPor: e.visibleSoloPor || null,
      },
    });
  } catch (error) {
    console.error('Actualizar evento error:', error);
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    await connectMongo();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const evento = await Evento.findByIdAndDelete(id);

    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Evento eliminado' });
  } catch (error) {
    console.error('Eliminar evento error:', error);
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
  }
}
