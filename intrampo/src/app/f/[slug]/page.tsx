'use client';

import { useState, useEffect, use } from 'react';
import { FiCalendar, FiMapPin, FiDollarSign, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

interface Campo {
  id: string;
  label: string;
  tipo: string;
  requerido: boolean;
  opciones?: string[];
}

interface FormularioPublico {
  _id: string;
  slug: string;
  titulo: string;
  descripcion?: string;
  fechaEvento?: string;
  lugarEvento?: string;
  precioEvento?: number;
  fotoFondoUrl?: string;
  campos: Campo[];
}

export default function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params in Next.js 16
  const { slug } = use(params);

  const [formulario, setFormulario] = useState<FormularioPublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [enviado, setEnviado] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/f/${slug}`)
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Formulario no disponible');
        }
        return res.json();
      })
      .then(data => {
        setFormulario(data);
        if (data.titulo) {
          document.title = `${data.titulo} | MPO`;
        }
      })
      .catch(err => {
        setErrorMsg(err.message || 'Error al cargar el formulario');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleChange = (label: string, value: any) => {
    setRespuestas(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/f/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuestas })
      });

      if (res.ok) {
        setEnviado(true);
        toast.success('¡Formulario enviado con éxito!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al enviar el formulario');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1118]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-medium">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !formulario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1118] px-4">
        <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-gray-100 mb-2">Formulario no disponible</h2>
          <p className="text-gray-400 text-sm mb-6">{errorMsg || 'El formulario que buscas no existe o ha sido desactivado.'}</p>
          <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Iglesia Maranatha MPO</div>
        </div>
      </div>
    );
  }

  const bgStyle = formulario.fotoFondoUrl 
    ? { backgroundImage: `linear-gradient(to bottom, rgba(15, 17, 24, 0.7), rgba(15, 17, 24, 0.95)), url(${formulario.fotoFondoUrl})` }
    : { backgroundImage: 'radial-gradient(circle at top, #1e1b4b 0%, #0f1118 70%)' };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 md:p-8 relative"
      style={bgStyle}
    >
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Decorative Blur Orbs */}
      {!formulario.fotoFondoUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-amber-500/10 blur-[100px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-purple-500/10 blur-[80px]" />
        </div>
      )}

      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Banner accent */}
        <div className="h-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        {/* Content body */}
        <div className="p-6 md:p-10">
          
          {enviado ? (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
                <FiCheckCircle size={44} />
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-100 mb-3">¡Registro Completado!</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                Tus respuestas para <strong className="text-white">{formulario.titulo}</strong> han sido recibidas y guardadas con éxito. ¡Muchas gracias!
              </p>
              <button 
                onClick={() => { setRespuestas({}); setEnviado(false); }}
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                Enviar otra respuesta
              </button>
            </div>
          ) : (
            <div>
              {/* Header Info */}
              <div className="mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                  {formulario.titulo}
                </h1>
                {formulario.descripcion && (
                  <p className="text-gray-300 text-sm md:text-[0.95rem] leading-relaxed mb-6 whitespace-pre-line">
                    {formulario.descripcion}
                  </p>
                )}

                {/* Event meta card */}
                {(formulario.fechaEvento || formulario.lugarEvento || formulario.precioEvento !== null) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    {formulario.fechaEvento && (
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="p-2 bg-white/5 rounded-lg text-amber-500"><FiCalendar size={18} /></span>
                        <div>
                          <div className="text-[0.65rem] uppercase font-bold text-gray-500 tracking-wider">Fecha</div>
                          <div className="font-semibold">{new Date(formulario.fechaEvento).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                      </div>
                    )}
                    {formulario.lugarEvento && (
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="p-2 bg-white/5 rounded-lg text-amber-500"><FiMapPin size={18} /></span>
                        <div>
                          <div className="text-[0.65rem] uppercase font-bold text-gray-500 tracking-wider">Lugar</div>
                          <div className="font-semibold truncate max-w-[140px]" title={formulario.lugarEvento}>{formulario.lugarEvento}</div>
                        </div>
                      </div>
                    )}
                    {formulario.precioEvento !== null && formulario.precioEvento !== undefined && (
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="p-2 bg-white/5 rounded-lg text-amber-500"><FiDollarSign size={18} /></span>
                        <div>
                          <div className="text-[0.65rem] uppercase font-bold text-gray-500 tracking-wider">Precio</div>
                          <div className="font-semibold text-amber-400">${formulario.precioEvento} MXN</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 border-t border-white/10 pt-6">
                {formulario.campos.map((campo) => {
                  const inputId = `campo-${campo.id}`;
                  
                  return (
                    <div key={campo.id} className="flex flex-col">
                      <label 
                        htmlFor={inputId}
                        className="text-xs md:text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-1.5"
                      >
                        {campo.label}
                        {campo.requerido && <span className="text-red-500" title="Requerido">*</span>}
                      </label>

                      {/* TEXT FIELD */}
                      {campo.tipo === 'texto' && (
                        <input
                          id={inputId}
                          type="text"
                          required={campo.requerido}
                          value={respuestas[campo.label] || ''}
                          onChange={e => handleChange(campo.label, e.target.value)}
                          className="w-full bg-[#14161f]/80 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-sm transition-all"
                          placeholder="Tu respuesta..."
                        />
                      )}

                      {/* TEXTAREA FIELD */}
                      {campo.tipo === 'textarea' && (
                        <textarea
                          id={inputId}
                          required={campo.requerido}
                          value={respuestas[campo.label] || ''}
                          onChange={e => handleChange(campo.label, e.target.value)}
                          className="w-full bg-[#14161f]/80 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-sm min-h-[90px] resize-y transition-all"
                          placeholder="Tu respuesta..."
                        />
                      )}

                      {/* NUMBER FIELD */}
                      {campo.tipo === 'numero' && (
                        <input
                          id={inputId}
                          type="number"
                          required={campo.requerido}
                          value={respuestas[campo.label] || ''}
                          onChange={e => handleChange(campo.label, e.target.value)}
                          className="w-full bg-[#14161f]/80 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-sm transition-all"
                          placeholder="0"
                        />
                      )}

                      {/* DATE FIELD */}
                      {campo.tipo === 'fecha' && (
                        <input
                          id={inputId}
                          type="date"
                          required={campo.requerido}
                          value={respuestas[campo.label] || ''}
                          onChange={e => handleChange(campo.label, e.target.value)}
                          className="w-full bg-[#14161f]/80 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-sm transition-all"
                        />
                      )}

                      {/* SELECT FIELD */}
                      {campo.tipo === 'select' && (
                        <select
                          id={inputId}
                          required={campo.requerido}
                          value={respuestas[campo.label] || ''}
                          onChange={e => handleChange(campo.label, e.target.value)}
                          className="w-full bg-[#14161f]/80 border border-white/10 text-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-sm appearance-none transition-all cursor-pointer"
                        >
                          <option value="">Selecciona una opción</option>
                          {campo.opciones?.map(opt => (
                            <option key={opt} value={opt} className="bg-[#14161f] text-white">{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-gray-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-gray-950/20 border-t-gray-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend size={15} /> Enviar Registro
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Footer branding */}
          <div className="text-center border-t border-white/5 pt-6 mt-8 flex flex-col gap-1 items-center pointer-events-none">
            <span className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest">
              Iglesia Maranatha MPO
            </span>
            <span className="text-[0.6rem] text-gray-600">
              Formularios autogenerados de la intranet
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
