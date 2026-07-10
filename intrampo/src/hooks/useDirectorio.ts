import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface Miembro {
  _id: string;
  nombre: string;
  edad: number;
  telefono: string;
  tiempoIglesia: string;
  esServidor: boolean;
  dondeSirve: string | null;
  parentesco: string | null;
  fotoUrl: string | null;
  createdAt: string;
}

export function useDirectorio() {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [ministerios, setMinisterios] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  // States para Formularios y Modales
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMiembro, setSelectedMiembro] = useState<Miembro | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    edad: '',
    telefono: '',
    tiempoIglesia: 'Menos de 1 año',
    esServidor: false,
    dondeSirve: '',
    parentesco: ''
  });
  const [foto, setFoto] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.set('buscar', busqueda);

      const res = await fetch(`/api/miembros?${params}`);
      const resMinisterios = await fetch('/api/ministerios');
      
      if (res.ok && resMinisterios.ok) {
        const data = await res.json();
        const minData = await resMinisterios.json();
        setMiembros(data.personas || []);
        setMinisterios(minData.ministerios || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [busqueda]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditMode(false);
    setFormData({
      id: '', nombre: '', edad: '', telefono: '', tiempoIglesia: 'Menos de 1 año',
      esServidor: false, dondeSirve: '', parentesco: ''
    });
    setFoto(null);
    setShowForm(true);
  };

  const handleOpenEdit = (miembro: Miembro) => {
    setEditMode(true);
    setFormData({
      id: miembro._id,
      nombre: miembro.nombre,
      edad: miembro.edad.toString(),
      telefono: miembro.telefono,
      tiempoIglesia: miembro.tiempoIglesia,
      esServidor: miembro.esServidor,
      dondeSirve: miembro.dondeSirve || '',
      parentesco: miembro.parentesco || ''
    });
    setFoto(null);
    setShowForm(true);
    setSelectedMiembro(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar a este miembro del directorio?')) return;
    try {
      const res = await fetch(`/api/miembros/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Miembro eliminado correctamente');
        setSelectedMiembro(null);
        fetchData();
      } else {
        toast.error('Error al eliminar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let fotoUrl = null;
      if (foto) {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(foto);
        });
        const base64Content = await base64Promise;

        const payloadArchivo = {
          nombre: foto.name,
          base64Content,
          carpeta: '/directorio'
        };

        const res = await fetch('/api/archivos', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadArchivo) 
        });

        if (res.ok) {
          const data = await res.json();
          fotoUrl = data.archivo.url;
        } else {
          toast.error('Error al subir la imagen');
        }
      }

      const payload = { ...formData };
      if (fotoUrl) (payload as any).fotoUrl = fotoUrl;

      const url = editMode ? `/api/miembros/${formData.id}` : '/api/miembros';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editMode ? 'Miembro actualizado' : 'Miembro agregado con éxito');
        setShowForm(false);
        fetchData();
      } else {
        toast.error('Error al guardar');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      const parsedMiembros = lines.slice(1).map(line => {
        const [nombre, edad, telefono, tiempoIglesia, esServidor, dondeSirve, parentesco] = line.split(',');
        return {
          nombre: nombre?.trim(),
          edad: parseInt(edad?.trim(), 10) || 0,
          telefono: telefono?.trim(),
          tiempoIglesia: tiempoIglesia?.trim() || 'Menos de 1 año',
          esServidor: esServidor?.trim().toLowerCase() === 'true' || esServidor?.trim().toLowerCase() === 'si',
          dondeSirve: dondeSirve?.trim() || '',
          parentesco: parentesco?.trim() || ''
        };
      }).filter(m => m.nombre);

      if (parsedMiembros.length === 0) return toast.error('El CSV está vacío o inválido');

      try {
        const res = await fetch('/api/miembros/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ miembros: parsedMiembros })
        });
        if (res.ok) {
          toast.success('Miembros importados correctamente');
          fetchData();
        } else {
          toast.error('Error importando CSV');
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  return {
    miembros,
    busqueda,
    setBusqueda,
    ministerios,
    loading,
    showForm,
    setShowForm,
    editMode,
    selectedMiembro,
    setSelectedMiembro,
    submitting,
    csvInputRef,
    formData,
    setFormData,
    setFoto,
    handleOpenCreate,
    handleOpenEdit,
    handleDelete,
    handleSubmit,
    handleCsvImport
  };
}
