import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { IMinisterio } from '@/types';

export function useMinisterios() {
  const [ministerios, setMinisterios] = useState<IMinisterio[]>([]);
  const [todosLosMiembros, setTodosLosMiembros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States Modal Creación/Edición
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    color: '#673AB7',
    icono: 'church',
    parentId: '',
  });

  // States Modal Miembros
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedMinisterio, setSelectedMinisterio] = useState<IMinisterio | null>(null);
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState<string[]>([]);
  const [busquedaMiembros, setBusquedaMiembros] = useState('');

  // States Modal Líderes
  const [showLeadersModal, setShowLeadersModal] = useState(false);
  const [lideresSeleccionados, setLideresSeleccionados] = useState<string[]>([]);
  const [busquedaLideres, setBusquedaLideres] = useState('');

  const fetchMinisterios = useCallback(async () => {
    try {
      const res = await fetch('/api/ministerios');
      if (res.ok) {
        const data = await res.json();
        setMinisterios(data.ministerios || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMiembros = useCallback(async () => {
    try {
      const res = await fetch('/api/miembros');
      if (res.ok) {
        const data = await res.json();
        setTodosLosMiembros(data.personas || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchMinisterios();
    fetchMiembros();
  }, [fetchMinisterios, fetchMiembros]);

  const handleOpenCreate = () => {
    setEditMode(false);
    setFormData({ id: '', nombre: '', descripcion: '', color: '#673AB7', icono: 'church', parentId: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (min: IMinisterio) => {
    setEditMode(true);
    setFormData({
      id: min.id,
      nombre: min.nombre,
      descripcion: min.descripcion || '',
      color: min.color || '#673AB7',
      icono: min.icono || 'church',
      parentId: min.parentId || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este ministerio?')) return;
    
    try {
      const res = await fetch(`/api/ministerios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Ministerio eliminado correctamente');
        fetchMinisterios();
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
      const url = editMode ? `/api/ministerios/${formData.id}` : '/api/ministerios';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(editMode ? 'Ministerio actualizado' : 'Ministerio creado con éxito');
        setShowForm(false);
        fetchMinisterios();
      } else {
        toast.error('Error al guardar el ministerio');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de red al guardar ministerio');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Miembros ──────────────────────────────────────────────

  const handleOpenManageMembers = (min: IMinisterio) => {
    setSelectedMinisterio(min);
    setMiembrosSeleccionados([...(min.miembrosIds || [])]);
    setBusquedaMiembros('');
    setShowMembersModal(true);
  };

  const handleToggleMember = (id: string) => {
    if (miembrosSeleccionados.includes(id)) {
      setMiembrosSeleccionados(prev => prev.filter(m => m !== id));
    } else {
      setMiembrosSeleccionados(prev => [...prev, id]);
    }
  };

  const handleSaveMembers = async () => {
    if (!selectedMinisterio) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/ministerios/${selectedMinisterio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ miembrosIds: miembrosSeleccionados })
      });
      if (res.ok) {
        toast.success('Miembros actualizados correctamente');
        setShowMembersModal(false);
        fetchMinisterios();
      } else {
        toast.error('Error al guardar miembros');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const miembrosFiltrados = todosLosMiembros.filter(m => 
    m.nombre.toLowerCase().includes(busquedaMiembros.toLowerCase())
  );

  // ── Líderes ───────────────────────────────────────────────

  const handleOpenManageLeaders = (min: IMinisterio) => {
    setSelectedMinisterio(min);
    setLideresSeleccionados([...(min.liderIds || [])]);
    setBusquedaLideres('');
    setShowLeadersModal(true);
  };

  const handleToggleLeader = (id: string) => {
    if (lideresSeleccionados.includes(id)) {
      setLideresSeleccionados(prev => prev.filter(l => l !== id));
    } else {
      setLideresSeleccionados(prev => [...prev, id]);
    }
  };

  const handleSaveLeaders = async () => {
    if (!selectedMinisterio) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/ministerios/${selectedMinisterio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liderIds: lideresSeleccionados })
      });
      if (res.ok) {
        toast.success('Líderes actualizados correctamente');
        setShowLeadersModal(false);
        fetchMinisterios();
      } else {
        toast.error('Error al guardar líderes');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Miembros filtrados del ministerio seleccionado (para el modal de líderes)
  const miembrosDelMinisterio = selectedMinisterio
    ? todosLosMiembros.filter(m => selectedMinisterio.miembrosIds?.includes(m._id))
    : [];

  return {
    ministerios,
    loading,
    showForm,
    setShowForm,
    editMode,
    submitting,
    formData,
    setFormData,
    // Miembros
    showMembersModal,
    setShowMembersModal,
    selectedMinisterio,
    miembrosSeleccionados,
    busquedaMiembros,
    setBusquedaMiembros,
    handleOpenCreate,
    handleOpenEdit,
    handleDelete,
    handleSubmit,
    handleOpenManageMembers,
    handleToggleMember,
    handleSaveMembers,
    miembrosFiltrados,
    // Líderes
    showLeadersModal,
    setShowLeadersModal,
    lideresSeleccionados,
    busquedaLideres,
    setBusquedaLideres,
    handleOpenManageLeaders,
    handleToggleLeader,
    handleSaveLeaders,
    miembrosDelMinisterio,
  };
}
