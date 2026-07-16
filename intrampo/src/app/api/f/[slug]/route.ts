import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formulario = await prisma.formulario.findUnique({
      where: { slug }
    });

    if (!formulario || !formulario.activo) {
      return NextResponse.json({ error: 'Formulario no encontrado o inactivo' }, { status: 404 });
    }

    return NextResponse.json({
      _id: formulario.id,
      slug: formulario.slug,
      titulo: formulario.titulo,
      descripcion: formulario.descripcion,
      fechaEvento: formulario.fechaEvento,
      lugarEvento: formulario.lugarEvento,
      precioEvento: formulario.precioEvento,
      fotoFondoUrl: formulario.fotoFondoUrl,
      campos: formulario.campos,
      createdAt: formulario.createdAt
    });
  } catch (error) {
    console.error('Error fetching public form:', error);
    return NextResponse.json({ error: 'Error al obtener el formulario' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const formulario = await prisma.formulario.findUnique({
      where: { slug }
    });

    if (!formulario || !formulario.activo) {
      return NextResponse.json({ error: 'Formulario no encontrado o inactivo' }, { status: 404 });
    }

    const { respuestas } = await request.json();

    if (!respuestas || typeof respuestas !== 'object') {
      return NextResponse.json({ error: 'Respuestas inválidas' }, { status: 400 });
    }

    // Guardar la respuesta
    const nuevaRespuesta = await prisma.respuestaFormulario.create({
      data: {
        formularioId: formulario.id,
        respuestas
      }
    });

    return NextResponse.json({ mensaje: 'Respuestas guardadas con éxito', id: nuevaRespuesta.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving form response:', error);
    return NextResponse.json({ error: 'Error al enviar tus respuestas' }, { status: 500 });
  }
}
