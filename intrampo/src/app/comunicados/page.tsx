'use client';

import AppShell from '@/components/AppShell';
import { FadeIn, StaggerContainer, StaggerItem } from '@/animations';
import { useComunicados, Categoria } from '@/hooks/useComunicados';
import ComunicadoFormModal from './ComunicadoFormModal';
import FileSelectorModal from './FileSelectorModal';

const categorias: { value: Categoria; label: string; emoji: string }[] = [
  { value: 'todos', label: 'Todos', emoji: '📋' },
  { value: 'lideres', label: 'Líderes', emoji: '👥' },
  { value: 'servidores', label: 'Servidores', emoji: '🙌' },
  { value: 'general', label: 'General', emoji: '📢' },
  { value: 'admin', label: 'Administradores', emoji: '💼' },
  { value: 'pastoral', label: 'Pastoral', emoji: '🙏' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-PA', { day: 'numeric', month: 'short' });
}

export default function ComunicadosPage() {
  const {
    filtro, setFiltro,
    showForm, setShowForm,
    loading,
    formData, setFormData,
    imagen, setImagen,
    archivo, setArchivo,
    imagenSeleccionada, setImagenSeleccionada,
    archivoSeleccionado, setArchivoSeleccionado,
    showImgSelector, setShowImgSelector,
    showDocSelector, setShowDocSelector,
    submitting,
    isPastor,
    handleSubmit,
    filtered
  } = useComunicados();

  return (
    <AppShell>
      <FadeIn>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Comunicados</h1>
            <p className="text-gray-400 text-[0.95rem]">Noticias y avisos de la iglesia para la congregación.</p>
          </div>
          {isPastor && (
            <button 
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2" 
              onClick={() => setShowForm(true)} 
              id="new-comunicado-btn"
            >
              <span>➕</span> Nuevo Comunicado
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-[#1a1c25] rounded-xl border border-white/10 shadow-sm">
          {categorias.map((cat) => (
            <button
              key={cat.value}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${filtro === cat.value ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/20' : 'bg-[#14161f] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'}`}
              onClick={() => setFiltro(cat.value)}
            >
              <span className="text-base">{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Comunicados list */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
            <div className="text-4xl mb-4 opacity-50">📢</div>
            <div className="font-display text-xl font-semibold mb-2 text-gray-400">Sin comunicados</div>
            <div className="text-sm text-center">No hay comunicados en esta categoría.</div>
          </div>
        ) : (
          <StaggerContainer className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((c: any) => (
              <StaggerItem key={c.id} className={`bg-[#1a1c25] rounded-2xl border border-white/10 p-6 break-inside-avoid transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group ${c.fijado ? 'ring-2 ring-amber-500 shadow-amber-500/10' : ''}`}>
                {c.fijado && <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden"><div className="bg-amber-500 text-[0.6rem] font-bold text-gray-900 text-center py-1 absolute top-2 right-[-14px] w-[60px] rotate-45 shadow-md">FIJADO</div></div>}
                
                {c.imagenUrl && (
                  <div className="w-[calc(100%+3rem)] -mx-6 -mt-6 mb-6 h-48 overflow-hidden relative">
                    <img src={c.imagenUrl} alt="Imagen comunicado" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c25] via-transparent to-transparent opacity-80" />
                  </div>
                )}
                
                <span className={`inline-block px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wider rounded-lg mb-4 ${
                  c.categoria === 'pastoral' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  c.categoria === 'lideres' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  c.categoria === 'servidores' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  c.categoria === 'admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  {categorias.find(cat => cat.value === c.categoria)?.emoji || '📢'} {c.categoria}
                </span>
                
                <div className="font-display text-xl font-bold text-gray-100 mb-3">{c.titulo}</div>
                <div className="text-gray-300 text-[0.95rem] leading-relaxed mb-6 whitespace-pre-wrap">{c.contenido}</div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[0.8rem] font-medium text-gray-400 flex items-center gap-1.5">
                    <span className="opacity-70">✍️</span> {c.autorNombre}
                  </span>
                  <span className="text-[0.75rem] font-semibold text-gray-500">{timeAgo(c.createdAt)}</span>
                </div>
                
                {c.archivoUrl && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <a href={c.archivoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold text-gray-300 transition-colors">
                      <span>📄</span> Descargar Adjunto
                    </a>
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </FadeIn>

      {/* Formulario y Modales de Acción */}
      <ComunicadoFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        submitting={submitting}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        imagen={imagen}
        setImagen={setImagen}
        archivo={archivo}
        setArchivo={setArchivo}
        imagenSeleccionada={imagenSeleccionada}
        setImagenSeleccionada={setImagenSeleccionada}
        archivoSeleccionado={archivoSeleccionado}
        setArchivoSeleccionado={setArchivoSeleccionado}
        onOpenImgSelector={() => setShowImgSelector(true)}
        onOpenDocSelector={() => setShowDocSelector(true)}
      />

      {/* Modal: Elegir Imagen de la Galería */}
      <FileSelectorModal
        isOpen={showImgSelector}
        onClose={() => setShowImgSelector(false)}
        onSelect={(url, name) => {
          setImagenSeleccionada({ url, nombre: name });
          setShowImgSelector(false);
        }}
        allowedFormats={['jpg', 'jpeg', 'png', 'gif', 'webp']}
        title="Elegir Imagen de la Galería"
      />

      {/* Modal: Elegir Archivo Adjunto de la Galería */}
      <FileSelectorModal
        isOpen={showDocSelector}
        onClose={() => setShowDocSelector(false)}
        onSelect={(url, name) => {
          setArchivoSeleccionado({ url, nombre: name });
          setShowDocSelector(false);
        }}
        title="Elegir Archivo Adjunto de la Galería"
      />
    </AppShell>
  );
}
