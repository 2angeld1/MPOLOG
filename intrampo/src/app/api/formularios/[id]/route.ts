import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formulario = await prisma.formulario.findUnique({
      where: { id }
    });

    if (!formulario) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ ...formulario, _id: formulario.id });
  } catch (error) {
    console.error('Error fetching formulario:', error);
    return NextResponse.json({ error: 'Error al obtener el formulario' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { slug, titulo, descripcion, fechaEvento, lugarEvento, precioEvento, fotoFondoUrl, campos, activo } = body;

    const existing = await prisma.formulario.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 });
    }

    const updateData: any = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descripcion !== undefined) updateData.descripcion = descripcion || null;
    if (fechaEvento !== undefined) updateData.fechaEvento = fechaEvento ? new Date(fechaEvento) : null;
    if (lugarEvento !== undefined) updateData.lugarEvento = lugarEvento || null;
    if (precioEvento !== undefined) updateData.precioEvento = precioEvento ? parseFloat(precioEvento) : null;
    if (fotoFondoUrl !== undefined) updateData.fotoFondoUrl = fotoFondoUrl || null;
    if (campos !== undefined && Array.isArray(campos)) updateData.campos = campos;
    if (activo !== undefined) updateData.activo = Boolean(activo);

    if (slug !== undefined && slug !== existing.slug) {
      const normalizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
      if (normalizedSlug.length < 3) {
        return NextResponse.json({ error: 'El slug debe tener al menos 3 caracteres' }, { status: 400 });
      }
      const duplicate = await prisma.formulario.findUnique({ where: { slug: normalizedSlug } });
      if (duplicate) {
        return NextResponse.json({ error: `La URL alias '${normalizedSlug}' ya está en uso. Elige otra.` }, { status: 400 });
      }
      updateData.slug = normalizedSlug;
    }

    const formularioActualizado = await prisma.formulario.update({
      where: { id },
      data: updateData
    });

    // Guardar sugerencias de campos
    if (campos && Array.isArray(campos)) {
      for (const campo of campos) {
        if (campo.label && campo.tipo) {
          try {
            await prisma.campoSugerido.upsert({
              where: { label: campo.label },
              update: {
                tipo: campo.tipo,
                opciones: campo.opciones || []
              },
              create: {
                label: campo.label,
                tipo: campo.tipo,
                opciones: campo.opciones || []
              }
            });
          } catch (e) {
            console.error('Error guardando campo sugerido:', e);
          }
        }
      }
    }

    return NextResponse.json({ ...formularioActualizado, _id: formularioActualizado.id });
  } catch (error) {
    console.error('Error actualizando formulario:', error);
    return NextResponse.json({ error: 'Error al actualizar el formulario' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Eliminar respuestas asociadas primero
    await prisma.respuestaFormulario.deleteMany({
      where: { formularioId: id }
    });

    await prisma.formulario.delete({
      where: { id }
    });

    return NextResponse.json({ mensaje: 'Formulario y respuestas eliminados correctamente' });
  } catch (error) {
    console.error('Error eliminando formulario:', error);
    return NextResponse.json({ error: 'Error al eliminar el formulario' }, { status: 500 });
  }
}
