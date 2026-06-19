import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: session.userId,
      nombre: session.nombre,
      email: session.email,
      roles: session.roles,
    },
  });
}
