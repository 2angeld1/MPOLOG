import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/components/AppShell';

export interface IComunicado {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
  autorId: string;
  autorNombre: string;
  fijado: boolean;
  activo: boolean;
  imagenUrl?: string | null;
  archivoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Categoria = 'todos' | 'lideres' | 'servidores' | 'general' | 'admin' | 'pastoral';

export function useComunicados() {
  const { user } = useAppContext();
  const [comunicados, setComunicados] = useState<IComunicado[]>([]);
  const [filtro, setFiltro] = useState<Categoria>('todos');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ titulo: '', contenido: '', categoria: 'general' });
  
  // Direct upload states
  const [imagen, setImagen] = useState<File | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  
  // Selected from gallery states
  const [imagenSeleccionada, setImagenSeleccionada] = useState<{ url: string; nombre: string } | null>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ url: string; nombre: string } | null>(null);
  
  // Modals for selection
  const [showImgSelector, setShowImgSelector] = useState(false);
  const [showDocSelector, setShowDocSelector] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const safeRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const safeEmail = user?.email?.toLowerCase() || '';
  const isPastor = safeRoles.includes('pastor') || safeRoles.includes('superadmin') || safeEmail.startsWith('admin@superadmin');

  const fetchComunicados = useCallback(async () => {
    try {
      const res = await fetch('/api/comunicados');
      if (res.ok) {
        const data = await res.json();
        setComunicados(data.comunicados || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imagenUrl = imagenSeleccionada?.url || null;
      let archivoUrl = archivoSeleccionado?.url || null;

      // Handle direct file uploads (if provided, they override the gallery selection)
      if (imagen) {
        const fileForm = new FormData();
        fileForm.append('file', imagen);
        fileForm.append('carpeta', '/comunicados');
        const res = await fetch('/api/archivos', { method: 'POST', body: fileForm });
        if (res.ok) {
          const data = await res.json();
          imagenUrl = data.archivo.url;
        }
      }

      if (archivo) {
        const fileForm = new FormData();
        fileForm.append('file', archivo);
        fileForm.append('carpeta', '/comunicados');
        const res = await fetch('/api/archivos', { method: 'POST', body: fileForm });
        if (res.ok) {
          const data = await res.json();
          archivoUrl = data.archivo.url;
        }
      }

      const res = await fetch('/api/comunicados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imagenUrl, archivoUrl }),
      });
      
      if (res.ok) {
        setShowForm(false);
        setFormData({ titulo: '', contenido: '', categoria: 'general' });
        setImagen(null);
        setArchivo(null);
        setImagenSeleccionada(null);
        setArchivoSeleccionado(null);
        fetchComunicados();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filtro === 'todos'
    ? comunicados
    : comunicados.filter(c => c.categoria === filtro);

  return {
    comunicados,
    filtro,
    setFiltro,
    showForm,
    setShowForm,
    loading,
    formData,
    setFormData,
    imagen,
    setImagen,
    archivo,
    setArchivo,
    imagenSeleccionada,
    setImagenSeleccionada,
    archivoSeleccionado,
    setArchivoSeleccionado,
    showImgSelector,
    setShowImgSelector,
    showDocSelector,
    setShowDocSelector,
    submitting,
    isPastor,
    handleSubmit,
    fetchComunicados,
    filtered
  };
}
