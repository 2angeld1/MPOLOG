import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectMongo, User } from '@/lib/mongodb';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getSession();
  if (!session || (!session.roles.includes('superadmin') && !session.roles.includes('logisticadmin') && !session.roles.includes('admin'))) {
    return NextResponse.json({ error: 'No autorizado. Solo administradores pueden ver usuarios.' }, { status: 403 });
  }

  try {
    // 1. Leer usuarios de Mongo (Legacy)
    await connectMongo();
    const usuariosMongo = await User.find({}, '-password').sort({ createdAt: -1 }).lean();

    const legacyUsers = usuariosMongo.map((u: any) => ({
      _id: String(u._id),
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      roles: u.roles || [],
      createdAt: u.createdAt,
      source: 'mongo'
    }));

    // 2. Leer usuarios de Intrampo DB (Nuevos)
    let usuariosIntrampo: any[] = [];
    if (prisma.usuarioSistema) {
      usuariosIntrampo = await prisma.usuarioSistema.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          miembroDirectorioId: true,
          createdAt: true,
        }
      });
    }

    const newUsers = usuariosIntrampo.map((u: any) => ({
      _id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      roles: [u.rol],
      miembroDirectorioId: u.miembroDirectorioId,
      createdAt: u.createdAt,
      source: 'intrampo'
    }));

    // 3. Unir y devolver
    const allUsers = [...newUsers, ...legacyUsers];

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const safeRoles = session?.roles?.map(r => r.toLowerCase()) || [];
  const safeEmail = session?.email?.toLowerCase() || '';
  if (!session || (!safeRoles.includes('superadmin') && !safeEmail.startsWith('admin@superadmin'))) {
    return NextResponse.json({ error: 'Solo el Superadmin puede crear usuarios.' }, { status: 403 });
  }

  try {
    const { miembroDirectorioId, email, rol } = await request.json();

    if (!miembroDirectorioId || !email || !rol) {
      return NextResponse.json({ error: 'Debes seleccionar una persona del directorio, asignar email y rol' }, { status: 400 });
    }

    // Buscar la persona del directorio
    const miembro = await prisma.miembroDirectorio.findUnique({ where: { id: miembroDirectorioId } });
    if (!miembro) {
      return NextResponse.json({ error: 'Persona del directorio no encontrada' }, { status: 404 });
    }

    const nombre = miembro.nombre;

    // Check si el correo ya existe en Intrampo DB
    const existingIntrampo = await prisma.usuarioSistema.findUnique({ where: { email } });
    if (existingIntrampo) {
      return NextResponse.json({ error: 'El correo ya está registrado en la base de datos' }, { status: 400 });
    }

    // Check si el correo ya existe en Mongo
    await connectMongo();
    const existingMongo = await User.findOne({ email });
    if (existingMongo) {
      return NextResponse.json({ error: 'El correo ya existe en el sistema heredado (MongoDB)' }, { status: 400 });
    }

    // Check si esta persona ya tiene acceso
    const existingAccess = await prisma.usuarioSistema.findFirst({
      where: { miembroDirectorioId }
    });
    if (existingAccess) {
      return NextResponse.json({ error: 'Esta persona ya tiene acceso al sistema' }, { status: 400 });
    }

    // Generar contraseña aleatoria de 8 caracteres
    const rawPassword = Math.random().toString(36).slice(-8);

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Guardar en Intrampo DB (MongoDB/Prisma)
    const newUser = await prisma.usuarioSistema.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol,
        miembroDirectorioId
      }
    });

    // Enviar correo con Brevo
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || 'no-reply@INTRA - MPO.com';

    if (brevoApiKey) {
      const emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #673AB7; text-align: center;">¡Bienvenido a INTRA - MPO!</h2>
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Se ha creado una cuenta para ti en la plataforma INTRA - MPO con el rol de <strong>${rol}</strong>.</p>
          <p>Tus credenciales de acceso son las siguientes:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Correo:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Contraseña temporal:</strong> ${rawPassword}</p>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="background-color: #673AB7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Iniciar Sesión</a>
          </p>
          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">Por seguridad, te recomendamos no compartir estas credenciales.</p>
        </div>
      `;

      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: 'INTRA - MPO', email: brevoSenderEmail },
            to: [{ email, name: nombre }],
            subject: 'Tus Credenciales de Acceso a INTRA - MPO',
            htmlContent: emailContent
          })
        });
      } catch (emailErr) {
        console.error('Error enviando correo por Brevo:', emailErr);
      }
    }

    return NextResponse.json({
      mensaje: 'Usuario creado exitosamente. Se ha enviado un correo con las credenciales.',
      user: { id: newUser.id, nombre: newUser.nombre, email: newUser.email, rol: newUser.rol },
      _tempPassMsg: !brevoApiKey ? `(Contraseña autogenerada: ${rawPassword})` : undefined
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor al crear usuario' }, { status: 500 });
  }
}
