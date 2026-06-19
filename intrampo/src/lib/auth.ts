import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectMongo, User } from './mongodb';
import type { SessionData } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_key_aqui';
const COOKIE_NAME = 'intrampo_session';

export async function authenticateUser(email: string, password: string): Promise<SessionData | null> {
  await connectMongo();

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const roles = user.roles && user.roles.length > 0 ? user.roles : [user.rol || 'usuario'];

  return {
    userId: user._id.toString(),
    email: user.email,
    nombre: user.nombre,
    roles,
  };
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
  // Admin and logisticadmin have access to everything
  if (session.roles.includes('admin') || session.roles.includes('logisticadmin')) return true;
  return session.roles.some(r => requiredRoles.includes(r));
}

export function isAdmin(session: SessionData): boolean {
  return hasRole(session, ['admin', 'logisticadmin']);
}
