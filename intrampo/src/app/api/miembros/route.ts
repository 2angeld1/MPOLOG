import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo, User } from '@/lib/mongodb';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const buscar = searchParams.get('buscar');

    // 1. Obtener miembros del Directorio (MongoDB via Prisma)
    let whereClause = {};
    if (buscar) {
      whereClause = {
        nombre: {
          contains: buscar,
        }
      };
    }

    const personas = await prisma.miembroDirectorio.findMany({
      where: whereClause,
      orderBy: { nombre: 'asc' },
    });

    // 2. Obtener usuarios del sistema desde MongoDB (Lectura legacy)
    await connectMongo();
    const users = await User.find({}, { password: 0 })
      .sort({ nombre: 1 })
      .lean();

    return NextResponse.json({
      personas: personas.map((p: any) => ({
        _id: p.id,
        nombre: p.nombre,
        edad: p.edad,
        telefono: p.telefono,
        tiempoIglesia: p.tiempoIglesia,
        esServidor: p.esServidor,
        dondeSirve: p.dondeSirve,
        parentesco: p.parentesco,
        fotoUrl: p.fotoUrl,
        createdAt: p.createdAt
      })),
      users: users.map((u: Record<string, unknown>) => ({
        _id: String(u._id),
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        roles: u.roles,
      })),
      departamentos: [], // Ya no usamos departamentos de mongo aquí
    });
  } catch (error) {
    console.error('Miembros error:', error);
    return NextResponse.json(
      { error: 'Error al cargar miembros' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nombre, edad, telefono, tiempoIglesia, esServidor, dondeSirve, parentesco, fotoUrl } = body;

    if (!nombre || !edad || !telefono || !tiempoIglesia) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const nuevoMiembro = await prisma.miembroDirectorio.create({
      data: {
        nombre,
        edad: parseInt(edad, 10),
        telefono,
        tiempoIglesia,
        esServidor: Boolean(esServidor),
        dondeSirve: dondeSirve || null,
        parentesco: parentesco || null,
        fotoUrl: fotoUrl || null
      }
    });

    // Sincronizar con Ministerios
    if (nuevoMiembro.esServidor && nuevoMiembro.dondeSirve) {
      const ministeriosNombres = nuevoMiembro.dondeSirve.split(',').map((s: string) => s.trim()).filter(Boolean);
      const ministerios = await prisma.ministerio.findMany();
      
      for (const min of ministerios) {
        if (ministeriosNombres.includes(min.nombre) && !min.miembrosIds.includes(nuevoMiembro.id)) {
          await prisma.ministerio.update({
            where: { id: min.id },
            data: { miembrosIds: { push: nuevoMiembro.id } }
          });
        }
      }
    }

    return NextResponse.json({ miembro: nuevoMiembro }, { status: 201 });
  } catch (error) {
    console.error('Error al crear miembro:', error);
    return NextResponse.json({ error: 'Error al crear miembro' }, { status: 500 });
  }
}
