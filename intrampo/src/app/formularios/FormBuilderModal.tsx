'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { FiPlus, FiTrash, FiChevronUp, FiChevronDown, FiImage, FiUpload } from 'react-icons/fi';
import ImageSelectorModal from '../inventario/ImageSelectorModal';
import toast from 'react-hot-toast';

interface Campo {
  id: string;
  label: string;
  tipo: string; // 'texto' | 'numero' | 'fecha' | 'select' | 'textarea'
  requerido: boolean;
  opciones: string[];
}

interface FormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  submitting: boolean;
  formData: {
    id: string;
    slug: string;
    titulo: string;
    descripcion: string;
    fechaEvento: string;
    lugarEvento: string;
    precioEvento: string;
    fotoFondoUrl: string;
    campos: Campo[];
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormBuilderModal({
  isOpen, onClose, editMode, submitting, formData, setFormData, onSubmit
}: FormBuilderModalProps) {
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/formularios/sugerencias')
        .then(res => res.json())
        .then(data => setSugerencias(data))
        .catch(console.error);
    }
  }, [isOpen]);

  const addCampo = (sugerido?: any) => {
    const nuevoCampo: Campo = {
      id: Math.random().toString(36).substr(2, 9),
      label: sugerido ? sugerido.label : '',
      tipo: sugerido ? sugerido.tipo : 'texto',
      requerido: true,
      opciones: sugerido?.opciones || []
    };
    setFormData({
      ...formData,
      campos: [...formData.campos, nuevoCampo]
    });
  };

  const removeCampo = (index: number) => {
    const nuevosCampos = [...formData.campos];
    nuevosCampos.splice(index, 1);
    setFormData({ ...formData, campos: nuevosCampos });
  };

  const updateCampo = (index: number, key: keyof Campo, value: any) => {
    const nuevosCampos = [...formData.campos];
    nuevosCampos[index] = { ...nuevosCampos[index], [key]: value };
    setFormData({ ...formData, campos: nuevosCampos });
  };

  const moveCampo = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.campos.length - 1) return;

    const nuevosCampos = [...formData.campos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = nuevosCampos[index];
    nuevosCampos[index] = nuevosCampos[targetIndex];
    nuevosCampos[targetIndex] = temp;

    setFormData({ ...formData, campos: nuevosCampos });
  };

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoFoto(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64Content = await base64Promise;

      const res = await fetch('/api/archivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: file.name,
          base64Content,
          carpeta: '/formularios'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, fotoFondoUrl: data.archivo.url });
        toast.success('Imagen subida correctamente');
      } else {
        toast.error('Error al subir la imagen');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al subir');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleSelectExistingImage = (url: string) => {
    setFormData({ ...formData, fotoFondoUrl: url });
    setShowImageSelector(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? 'Editar Formulario' : 'Crear Nuevo Formulario'}
      subtitle="Diseña y personaliza el formulario para la congregación"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={onClose}>Cancelar</button>
          <button type="submit" form="formbuilder-form" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar Formulario'}</button>
        </div>
      }
    >
      <form id="formbuilder-form" onSubmit={onSubmit} className="p-6 flex flex-col gap-6">
        {/* Sección 1: Configuración General */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
          <h4 className="text-amber-400 font-semibold text-sm uppercase tracking-wider">1. Configuración General</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Título del Formulario</label>
              <input 
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" 
                required 
                value={formData.titulo} 
                onChange={e => {
                  const tit = e.target.value;
                  // Auto-generar slug si no está en modo edición
                  const generatedSlug = !editMode ? tit.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-') : formData.slug;
                  setFormData({ ...formData, titulo: tit, slug: generatedSlug });
                }} 
                placeholder="Ej. Inscripción Retiro de Jóvenes..." 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Alias de URL (Slug)</label>
              <div className="flex items-center bg-[#14161f] border border-white/10 rounded-lg px-3 focus-within:border-amber-500">
                <span className="text-gray-500 text-sm select-none">/f/</span>
                <input 
                  className="w-full bg-transparent border-0 text-white py-2.5 pl-0.5 outline-none focus:ring-0" 
                  required 
                  value={formData.slug} 
                  onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
                  placeholder="ej. retiro-jovenes" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Descripción o Introducción (Opcional)</label>
            <textarea 
              className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 min-h-[70px] resize-y" 
              value={formData.descripcion} 
              onChange={e => setFormData({ ...formData, descripcion: e.target.value })} 
              placeholder="Detalles sobre de qué trata el formulario, instrucciones, etc." 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Fecha del Evento (Opcional)</label>
              <input 
                type="date" 
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" 
                value={formData.fechaEvento} 
                onChange={e => setFormData({ ...formData, fechaEvento: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Lugar del Evento (Opcional)</label>
              <input 
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" 
                value={formData.lugarEvento} 
                onChange={e => setFormData({ ...formData, lugarEvento: e.target.value })} 
                placeholder="Ej. Templo Central MPO, Quinta Campestre" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Precio de Inscripción (Opcional)</label>
              <input 
                type="number" 
                min="0" 
                className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" 
                value={formData.precioEvento} 
                onChange={e => setFormData({ ...formData, precioEvento: e.target.value })} 
                placeholder="Ej. 150.00" 
              />
            </div>
          </div>

          {/* Foto de fondo */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Imagen de Fondo de la Página</label>
            {formData.fotoFondoUrl && (
              <div className="mb-3 relative group">
                <img src={formData.fotoFondoUrl} alt="Fondo preview" className="w-full h-32 object-cover rounded-xl border border-white/10" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, fotoFondoUrl: '' })}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ✕ Eliminar
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#14161f] border border-white/10 rounded-lg cursor-pointer hover:border-amber-500/50 transition-colors text-gray-400 hover:text-amber-400">
                <FiUpload size={16} />
                <span className="text-sm font-medium">{subiendoFoto ? 'Subiendo...' : 'Subir imagen'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} disabled={subiendoFoto} />
              </label>
              <button
                type="button"
                onClick={() => setShowImageSelector(true)}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#14161f] border border-white/10 rounded-lg hover:border-purple-500/50 transition-colors text-gray-400 hover:text-purple-400"
              >
                <FiImage size={16} />
                <span className="text-sm font-medium">Seleccionar existente</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sección 2: Campos del Formulario */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="text-amber-400 font-semibold text-sm uppercase tracking-wider">2. Campos del Formulario</h4>
            <button
              type="button"
              onClick={() => addCampo()}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <FiPlus size={14} /> Añadir Campo
            </button>
          </div>

          {/* Sugerencias de campos */}
          {sugerencias.length > 0 && (
            <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[0.7rem] uppercase tracking-wider font-bold text-gray-500">Sugerencias (Campos ya creados anteriormente)</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {sugerencias.map(sug => (
                  <button
                    key={sug._id}
                    type="button"
                    onClick={() => addCampo(sug)}
                    className="bg-[#14161f] hover:bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1"
                  >
                    <span>➕</span> {sug.label} <span className="opacity-40">({sug.tipo})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Constructor de campos */}
          <div className="flex flex-col gap-3">
            {formData.campos.map((campo, index) => (
              <div 
                key={campo.id} 
                className="bg-[#14161f] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center relative group"
              >
                {/* Reordenamiento */}
                <div className="flex flex-row sm:flex-col gap-1 shrink-0">
                  <button type="button" onClick={() => moveCampo(index, 'up')} className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/5" disabled={index === 0}>
                    <FiChevronUp size={16} />
                  </button>
                  <button type="button" onClick={() => moveCampo(index, 'down')} className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/5" disabled={index === formData.campos.length - 1}>
                    <FiChevronDown size={16} />
                  </button>
                </div>

                {/* Nombre de campo */}
                <div className="flex-1 w-full">
                  <input
                    className="w-full bg-[#1a1c25] border border-white/10 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm font-semibold"
                    required
                    value={campo.label}
                    onChange={e => updateCampo(index, 'label', e.target.value)}
                    placeholder="Etiqueta / Pregunta (ej. Correo Electrónico)"
                  />
                </div>

                {/* Tipo de campo */}
                <div className="shrink-0 w-full sm:w-36">
                  <select
                    className="w-full bg-[#1a1c25] border border-white/10 text-gray-300 rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm"
                    value={campo.tipo}
                    onChange={e => updateCampo(index, 'tipo', e.target.value)}
                  >
                    <option value="texto">Texto corto</option>
                    <option value="textarea">Párrafo (texto largo)</option>
                    <option value="numero">Número</option>
                    <option value="fecha">Fecha</option>
                    <option value="select">Selección múltiple</option>
                  </select>
                </div>

                {/* Requerido */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="checkbox"
                    id={`req-${campo.id}`}
                    checked={campo.requerido}
                    onChange={e => updateCampo(index, 'requerido', e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded bg-[#14161f] border-white/20"
                  />
                  <label htmlFor={`req-${campo.id}`} className="text-xs font-semibold text-gray-400 cursor-pointer uppercase">Requerido</label>
                </div>

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => removeCampo(index)}
                  className="text-red-400 hover:text-white hover:bg-red-500/10 p-2 rounded-lg transition-colors ml-auto sm:ml-0"
                  title="Eliminar campo"
                >
                  <FiTrash size={16} />
                </button>

                {/* Opciones del select (si aplica) */}
                {campo.tipo === 'select' && (
                  <div className="w-full sm:absolute sm:left-12 sm:right-16 sm:top-[90%] z-10 bg-[#1d1f2a] border border-white/10 rounded-lg p-3 mt-2 flex flex-col gap-2 shadow-xl">
                    <span className="text-[0.65rem] uppercase font-bold text-gray-400">Opciones de Selección (Separadas por comas)</span>
                    <input
                      className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-3 py-1.5 outline-none focus:border-amber-500 text-xs"
                      required
                      value={campo.opciones.join(', ')}
                      onChange={e => updateCampo(index, 'opciones', e.target.value.split(',').map(o => o.trim()).filter(Boolean))}
                      placeholder="Ej. Talla S, Talla M, Talla L..."
                    />
                  </div>
                )}
              </div>
            ))}

            {formData.campos.length === 0 && (
              <div className="text-center py-8 text-gray-500 border border-white/5 border-dashed rounded-xl bg-white/[0.01]">
                No hay campos definidos. Haz clic en "Añadir Campo" para empezar a diseñar tu formulario.
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Selector de imágenes existentes */}
      <ImageSelectorModal
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleSelectExistingImage}
      />
    </Modal>
  );
}
