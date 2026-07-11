import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mpolog';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectMongo(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { family: 4 }).then((m) => {
      console.log('✅ INTRA - MPO: MongoDB conectado (MPOLOG)');
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ─── Re-export MPOLOG Models ────────────────────────────────────
// We re-define schemas here to avoid importing from the Backend directory
// This keeps INTRA - MPO self-contained while reading the same MongoDB collections

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  nombre: String,
  rol: String,
  roles: [String],
}, { timestamps: true });

const eventoSchema = new mongoose.Schema({
  nombre: String,
  tipo: { type: String, enum: ['campamento', 'retiro', 'conferencia', 'asignacion', 'reunion', 'ayuno', 'vigilia', 'culto', 'evangelismo', 'convencion', 'otro'] },
  departamento: String,
  color: String,
  fechaInicio: Date,
  fechaFin: Date,
  precioTotal: Number,
  activo: Boolean,
  descripcion: String,
  ubicacion: {
    lat: Number,
    lng: Number,
    nombreLugar: String,
  },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  duracionDias: Number,
  requiereAlojamiento: Boolean,
  equipos: [String],
}, { timestamps: true });

const personaDetalladaSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: String,
  edad: Number,
  escuela: String,
  tipoSangre: String,
  nombrePadres: String,
  correo: String,
  tallaSueter: String,
  grupo: String,
  adultoResponsable: String,
  direccion: String,
  alergiasMedicamentos: String,
  asistencias: [Date],
  departamento: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  foto: String,
  esComandante: Boolean,
}, { timestamps: true });

const conteoPersonasSchema = new mongoose.Schema({
  fecha: Date,
  iglesia: String,
  tipo: { type: String, enum: ['personas', 'materiales'] },
  area: String,
  cantidad: Number,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  observaciones: String,
  subArea: String,
}, { timestamps: true });

const eventoPersonaSchema = new mongoose.Schema({
  evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
  nombre: String,
  apellido: String,
  edad: Number,
  telefono: String,
  abono: Boolean,
  montoAbono: Number,
  tipoPago: { type: String, enum: ['efectivo', 'yappy'] },
  comprobanteYappy: String,
  comprobantes: [String],
  equipo: String,
  diasAlojamiento: mongoose.Schema.Types.Mixed,
  soloCulto: Boolean,
  color: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });



// Use existing models if already registered (hot reload safety)
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Evento = mongoose.models.Evento || mongoose.model('Evento', eventoSchema);
export const PersonaDetallada = mongoose.models.PersonaDetallada || mongoose.model('PersonaDetallada', personaDetalladaSchema);
export const ConteoPersonas = mongoose.models.ConteoPersonas || mongoose.model('ConteoPersonas', conteoPersonasSchema);
export const EventoPersona = mongoose.models.EventoPersona || mongoose.model('EventoPersona', eventoPersonaSchema);
