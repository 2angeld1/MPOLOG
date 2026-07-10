import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface IArchivo {
  _id: string;
  nombre: string;
  url: string;
  public_id: string;
  formato: string;
  tamano: number;
  carpeta: string;
  subidoPor?: { name: string; email: string };
  createdAt: string;
}

export function useArchivos() {
  const [archivos, setArchivos] = useState<IArchivo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation states
  const [carpetaActual, setCarpetaActual] = useState('/');
  
  // Modals state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [uploadData, setUploadData] = useState({ nombre: '', base64Content: '', carpeta: '/' });
  const [uploadError, setUploadError] = useState('');

  // Auto-create folder helper
  const createFolder = async (nombre: string, parentCarpeta: string, refresh = true) => {
    try {
      const res = await fetch('/api/archivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFolder: true, nombre, carpeta: parentCarpeta })
      });
      if (res.ok && refresh) {
        fetchArchivos();
      }
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  const fetchArchivos = useCallback(async () => {
    try {
      const res = await fetch('/api/archivos');
      if (res.ok) {
        const data = await res.json();
        setArchivos(data);
        
        // Auto-create default folders if not present at root
        const hasDirectorio = data.some((a: any) => a.nombre === 'directorio' && a.formato === 'folder' && a.carpeta === '/');
        const hasComunicados = data.some((a: any) => a.nombre === 'comunicados' && a.formato === 'folder' && a.carpeta === '/');
        
        let needsRefetch = false;
        if (!hasDirectorio) {
          await createFolder('directorio', '/', false);
          needsRefetch = true;
        }
        if (!hasComunicados) {
          await createFolder('comunicados', '/', false);
          needsRefetch = true;
        }
        
        if (needsRefetch) {
          const secondRes = await fetch('/api/archivos');
          if (secondRes.ok) {
            setArchivos(await secondRes.json());
          }
        }
      }
    } catch (err) {
      console.error('Error fetching archivos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivos();
  }, [fetchArchivos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadData({
          nombre: file.name.split('.')[0],
          base64Content: event.target?.result as string,
          carpeta: carpetaActual
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.base64Content) {
      setUploadError('Por favor selecciona un archivo.');
      return;
    }
    
    setSubmitting(true);
    setUploadError('');
    try {
      const res = await fetch('/api/archivos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData),
      });

      if (res.ok) {
        setShowUploadForm(false);
        setUploadData({ nombre: '', base64Content: '', carpeta: carpetaActual });
        fetchArchivos();
      } else {
        const errData = await res.json();
        setUploadError(errData.error || 'Error al subir (Probablemente no eres admin)');
      }
    } catch (err) {
      setUploadError('Error de red al subir el archivo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setSubmitting(true);
    try {
      await createFolder(newFolderName.trim(), carpetaActual);
      setShowFolderForm(false);
      setNewFolderName('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;
    
    try {
      const res = await fetch(`/api/archivos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Elemento eliminado correctamente');
        fetchArchivos();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || 'Error al eliminar el elemento');
      }
    } catch (err) {
      toast.error('Error de red al eliminar');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada al portapapeles');
  };

  const navigateToFolder = (folderName: string) => {
    const targetPath = carpetaActual === '/' ? `/${folderName}` : `${carpetaActual}/${folderName}`;
    setCarpetaActual(targetPath);
  };

  const navigateBack = () => {
    if (carpetaActual === '/') return;
    const parts = carpetaActual.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    setCarpetaActual(parentPath);
  };

  // Filter items in the current folder path
  const itemsEnCarpeta = archivos.filter(a => a.carpeta === carpetaActual);

  // Divide folders and files
  const carpetasVisibles = itemsEnCarpeta.filter(a => a.formato === 'folder');
  const archivosVisibles = itemsEnCarpeta.filter(a => a.formato !== 'folder');

  return {
    archivos,
    loading,
    carpetaActual,
    setCarpetaActual,
    showUploadForm,
    setShowUploadForm,
    showFolderForm,
    setShowFolderForm,
    newFolderName,
    setNewFolderName,
    submitting,
    uploadData,
    setUploadData,
    uploadError,
    setUploadError,
    handleFileChange,
    handleUploadSubmit,
    handleCreateFolderSubmit,
    handleDelete,
    copyToClipboard,
    navigateToFolder,
    navigateBack,
    carpetasVisibles,
    archivosVisibles,
    itemsEnCarpeta
  };
}
