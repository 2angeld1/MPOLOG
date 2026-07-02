import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectMongo, User } from './mongodb';
import type { SessionData } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_key_aqui';
const COOKIE_NAME = 'INTRA - MPO_session';

export async function authenticateUser(email: string, password: string): Promise<SessionData | null> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Intentar con PostgreSQL (Nuevos usuarios)
  const { prisma } = await import('./prisma');
  let userPg = null;
  if (prisma.usuarioSistema) {
    userPg = await prisma.usuarioSistema.findUnique({
      where: { email: normalizedEmail }
    });
  }

  if (userPg) {
    const isMatch = await bcrypt.compare(password, userPg.password);
    if (!isMatch) return null;
    return {
      userId: userPg.id,
      email: userPg.email,
      nombre: userPg.nombre,
      roles: [userPg.rol],
    };
  }

  // 2. Fallback a MongoDB (Usuarios Legacy)
  await connectMongo();
  const userMongo = await User.findOne({ email: normalizedEmail });
  if (userMongo) {
    const isMatch = await bcrypt.compare(password, userMongo.password);
    if (!isMatch) return null;

    const rolesFromMongo = (userMongo.roles && userMongo.roles.length > 0)
      ? userMongo.roles
      : [userMongo.rol || 'usuario'];

    return {
      userId: userMongo._id.toString(),
      email: normalizedEmail,
      nombre: userMongo.nombre || 'Usuario',
      roles: rolesFromMongo,
    };
  }

  return null;
}

export function createToken(session: SessionData): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
}

export async function setSessionCookie(session: SessionData): Promise<void> {
  const token = createToken(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
    return decoded;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function hasRole(session: SessionData, requiredRoles: string[]): boolean {
  if (!session || !session.roles) return false;

  // Roles de máximo privilegio que siempre pueden acceder
  const adminRoles = ['admin', 'superadmin', 'logisticadmin', 'pastor'];

  if (session.roles.some(r => adminRoles.includes(r.toLowerCase()))) {
    return true;
  }

  // Verifica si el usuario tiene alguno de los roles requeridos
  return session.roles.some(r => requiredRoles.includes(r.toLowerCase()));
}

export function isAdmin(session: SessionData): boolean {
  return hasRole(session, ['admin', 'superadmin', 'logisticadmin', 'pastor']);
}

