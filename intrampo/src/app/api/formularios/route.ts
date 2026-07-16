import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const formularios = await prisma.formulario.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { respuestas: true }
        }
      }
    });

    return NextResponse.json(formularios.map(f => ({
      ...f,
      _id: f.id,
      respuestasCount: f._count.respuestas
    })));
  } catch (error) {
    console.error('Error fetching formularios:', error);
    return NextResponse.json({ error: 'Error al obtener formularios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, titulo, descripcion, fechaEvento, lugarEvento, precioEvento, fotoFondoUrl, campos } = body;

    if (!slug || !titulo || !campos || !Array.isArray(campos)) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (slug, titulo, campos)' }, { status: 400 });
    }

    // Normalizar slug (letras, números y guiones)
    const normalizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');

    if (normalizedSlug.length < 3) {
      return NextResponse.json({ error: 'El slug debe tener al menos 3 caracteres' }, { status: 400 });
    }

    // Verificar si ya existe un formulario con el mismo slug
    const existing = await prisma.formulario.findUnique({
      where: { slug: normalizedSlug }
    });

    if (existing) {
      return NextResponse.json({ error: `La URL alias '${normalizedSlug}' ya está en uso. Elige otra.` }, { status: 400 });
    }

    const nuevoFormulario = await prisma.formulario.create({
      data: {
        slug: normalizedSlug,
        titulo,
        descripcion: descripcion || null,
        fechaEvento: fechaEvento ? new Date(fechaEvento) : null,
        lugarEvento: lugarEvento || null,
        precioEvento: precioEvento ? parseFloat(precioEvento) : null,
        fotoFondoUrl: fotoFondoUrl || null,
        campos,
        creadoPorId: session.userId,
        creadoPorNombre: session.nombre
      }
    });

    // Guardar sugerencias de campos
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

    return NextResponse.json({ ...nuevoFormulario, _id: nuevoFormulario.id }, { status: 201 });
  } catch (error) {
    console.error('Error creando formulario:', error);
    return NextResponse.json({ error: 'Error al crear formulario' }, { status: 500 });
  }
}
