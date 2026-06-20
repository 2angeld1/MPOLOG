import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { connectMongo, User } from '@/lib/mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (!session.roles.includes('superadmin') && !session.roles.includes('logisticadmin'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { roles } = await request.json();

    if (!Array.isArray(roles)) {
        return NextResponse.json({ error: 'Formato de roles inválido' }, { status: 400 });
    }

    const { prisma } = await import('@/lib/prisma');
    
    // Almacenamos el primer rol en 'rol'
    const primerRol = roles.length > 0 ? roles[0] : 'general';

    const usuarioActualizado = await prisma.rolUsuario.upsert({
      where: { userId: id },
      update: { rol: primerRol },
      create: { userId: id, rol: primerRol }
    });

    return NextResponse.json({ mensaje: 'Roles actualizados', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error actualizando roles:', error);
    return NextResponse.json({ error: 'Error al actualizar roles' }, { status: 500 });
  }
}
