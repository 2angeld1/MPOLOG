'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { FadeIn, StaggerContainer, StaggerItem } from '@/animations';
import { FiPlus, FiLink, FiCheckCircle, FiXCircle, FiTrash, FiEdit2, FiBarChart, FiCopy } from 'react-icons/fi';
import FormBuilderModal from './FormBuilderModal';
import ResponsesModal from './ResponsesModal';
import toast from 'react-hot-toast';

export default function FormulariosAdminPage() {
  const [formularios, setFormularios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modales states
  const [showBuilder, setShowBuilder] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    titulo: '',
    descripcion: '',
    fechaEvento: '',
    lugarEvento: '',
    precioEvento: '',
    fotoFondoUrl: '',
    campos: [] as any[]
  });

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/formularios');
      if (res.ok) {
        const data = await res.json();
        setFormularios(data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar formularios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditMode(false);
    setFormData({
      id: '',
      slug: '',
      titulo: '',
      descripcion: '',
      fechaEvento: '',
      lugarEvento: '',
      precioEvento: '',
      fotoFondoUrl: '',
      campos: []
    });
    setShowBuilder(true);
  };

  const handleOpenEdit = (form: any) => {
    setEditMode(true);
    setFormData({
      id: form._id,
      slug: form.slug,
      titulo: form.titulo,
      descripcion: form.descripcion || '',
      fechaEvento: form.fechaEvento ? form.fechaEvento.split('T')[0] : '',
      lugarEvento: form.lugarEvento || '',
      precioEvento: form.precioEvento ? form.precioEvento.toString() : '',
      fotoFondoUrl: form.fotoFondoUrl || '',
      campos: form.campos || []
    });
    setShowBuilder(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este formulario y todas sus respuestas de forma permanente?')) return;
    try {
      const res = await fetch(`/api/formularios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Formulario eliminado correctamente');
        fetchFormularios();
      } else {
        toast.error('Error al eliminar formulario');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActivo = async (form: any) => {
    try {
      const res = await fetch(`/api/formularios/${form._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !form.activo })
      });
      if (res.ok) {
        toast.success(form.activo ? 'Formulario desactivado' : 'Formulario activado');
        fetchFormularios();
      } else {
        toast.error('Error al cambiar estado');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editMode ? `/api/formularios/${formData.id}` : '/api/formularios';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editMode ? 'Formulario actualizado con éxito' : 'Formulario creado con éxito');
        setShowBuilder(false);
        fetchFormularios();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al guardar');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de red');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullLink = `${origin}/f/${slug}`;
    navigator.clipboard.writeText(fullLink);
    toast.success('Enlace público copiado al portapapeles');
  };

  const handleOpenResponses = (form: any) => {
    setSelectedForm(form);
    setShowResponses(true);
  };

  return (
    <AppShell>
      <FadeIn>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Generador de Formularios</h1>
            <p className="text-gray-400 text-[0.95rem]">Crea y gestiona formularios personalizados para la iglesia de forma dinámica.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-4 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <FiPlus size={18} /> Crear Formulario
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formularios.map((form) => {
              const fullUrl = `/f/${form.slug}`;
              return (
                <StaggerItem
                  key={form._id}
                  className="bg-[#1a1c25] rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:shadow-xl flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Background Image blur effect if it exists */}
                  {form.fotoFondoUrl && (
                    <div 
                      className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none" 
                      style={{ background: `url(${form.fotoFondoUrl}) center/cover` }}
                    />
                  )}

                  <div>
                    {/* Header: Title and Active toggle */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3 className="font-display text-lg font-bold text-gray-100 line-clamp-1 leading-snug group-hover:text-amber-400 transition-colors">
                        {form.titulo}
                      </h3>
                      <button 
                        onClick={() => handleToggleActivo(form)} 
                        title={form.activo ? 'Desactivar formulario' : 'Activar formulario'}
                        className={`text-lg transition-colors p-0.5 rounded ${form.activo ? 'text-emerald-400 hover:text-red-400' : 'text-gray-500 hover:text-emerald-400'}`}
                      >
                        {form.activo ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
                      </button>
                    </div>

                    {/* Slug */}
                    <div className="text-xs text-gray-400 flex items-center gap-1.5 mb-4 font-mono select-all">
                      <FiLink size={12} className="shrink-0" />
                      <span>/f/{form.slug}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
                      {form.descripcion || 'Sin descripción redactada.'}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {/* Event indicators if defined */}
                    {(form.fechaEvento || form.lugarEvento || form.precioEvento) && (
                      <div className="flex flex-wrap gap-2 mb-4 p-2.5 bg-[#14161f]/80 rounded-lg border border-white/5 text-[0.7rem] text-gray-400">
                        {form.fechaEvento && <span>📅 {new Date(form.fechaEvento).toLocaleDateString()}</span>}
                        {form.lugarEvento && <span className="max-w-[120px] truncate">📍 {form.lugarEvento}</span>}
                        {form.precioEvento !== null && <span>💵 ${form.precioEvento}</span>}
                      </div>
                    )}

                    {/* Actions and Answers counter */}
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      {/* Counter */}
                      <button 
                        onClick={() => handleOpenResponses(form)}
                        className="bg-white/5 hover:bg-amber-500/10 hover:text-amber-400 border border-white/5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 transition-colors flex items-center gap-1.5"
                      >
                        <FiBarChart size={14} /> {form.respuestasCount} respuestas
                      </button>

                      {/* Tooling */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyLink(form.slug)}
                          className="p-2 text-gray-400 hover:text-white bg-[#14161f] border border-white/5 rounded-lg transition-colors"
                          title="Copiar enlace"
                        >
                          <FiCopy size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(form)}
                          className="p-2 text-gray-400 hover:text-white bg-[#14161f] border border-white/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(form._id)}
                          className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 bg-[#14161f] border border-white/5 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <FiTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}

            {formularios.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
                <FiXCircle className="text-4xl mb-4" />
                <div className="font-display text-xl font-semibold mb-2">Sin formularios</div>
                <div className="text-sm text-center">No hay formularios creados. Presiona "Crear Formulario" para diseñar el primero.</div>
              </div>
            )}
          </StaggerContainer>
        )}
      </FadeIn>

      {/* Builder Modal */}
      <FormBuilderModal
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        editMode={editMode}
        submitting={submitting}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      {/* Responses Modal */}
      <ResponsesModal
        isOpen={showResponses}
        onClose={() => setShowResponses(false)}
        formulario={selectedForm}
      />
    </AppShell>
  );
}
