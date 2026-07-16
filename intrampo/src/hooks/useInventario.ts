import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface ItemInventario {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: string;
  imagenUrl: string | null;
  imagenPublicId: string | null;
  archivoId: string | null;
  ministerioId: string | null;
  ministerioNombre: string | null;
  cantidad: number;
  ubicacion: string | null;
  notas: string | null;
  creadoPorId: string;
  creadoPorNombre: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ESTADOS_MATERIAL = [
  'Nuevo',
  'Bueno',
  'Regular',
  'Deteriorado',
  'Fuera de servicio',
];

export function useInventario() {
  const [items, setItems] = useState<ItemInventario[]>([]);
  const [ministerios, setMinisterios] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroMinisterio, setFiltroMinisterio] = useState('');
  const [loading, setLoading] = useState(true);

  // Form & modal states
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemInventario | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    estado: 'Bueno',
    ministerioId: '',
    ministerioNombre: '',
    cantidad: '1',
    ubicacion: '',
    notas: '',
    imagenUrl: '',
    imagenPublicId: '',
    archivoId: '',
  });
  const [imagen, setImagen] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.set('buscar', busqueda);
      if (filtroEstado) params.set('estado', filtroEstado);
      if (filtroMinisterio) params.set('ministerio', filtroMinisterio);

      const [resItems, resMinisterios] = await Promise.all([
        fetch(`/api/inventario?${params}`),
        fetch('/api/ministerios'),
      ]);

      if (resItems.ok) {
        const data = await resItems.json();
        setItems(data.items || []);
      }
      if (resMinisterios.ok) {
        const minData = await resMinisterios.json();
        setMinisterios(minData.ministerios || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [busqueda, filtroEstado, filtroMinisterio]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditMode(false);
    setFormData({
      id: '', nombre: '', descripcion: '', estado: 'Bueno',
      ministerioId: '', ministerioNombre: '', cantidad: '1',
      ubicacion: '', notas: '', imagenUrl: '', imagenPublicId: '', archivoId: '',
    });
    setImagen(null);
    setShowForm(true);
  };

  const handleOpenEdit = (item: ItemInventario) => {
    setEditMode(true);
    setFormData({
      id: item._id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      estado: item.estado,
      ministerioId: item.ministerioId || '',
      ministerioNombre: item.ministerioNombre || '',
      cantidad: item.cantidad.toString(),
      ubicacion: item.ubicacion || '',
      notas: item.notas || '',
      imagenUrl: item.imagenUrl || '',
      imagenPublicId: item.imagenPublicId || '',
      archivoId: item.archivoId || '',
    });
    setImagen(null);
    setShowForm(true);
    setSelectedItem(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este item del inventario?')) return;
    try {
      const res = await fetch(`/api/inventario/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Item eliminado correctamente');
        setSelectedItem(null);
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
      let imagenUrl = formData.imagenUrl;
      let imagenPublicId = formData.imagenPublicId;

      // If user uploaded a new image file
      if (imagen) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imagen);
        });
        const base64Content = await base64Promise;

        const payloadArchivo = {
          nombre: imagen.name,
          base64Content,
          carpeta: '/inventario'
        };

        const res = await fetch('/api/archivos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadArchivo)
        });

        if (res.ok) {
          const data = await res.json();
          imagenUrl = data.archivo.url;
          imagenPublicId = data.archivo.public_id || '';
        } else {
          toast.error('Error al subir la imagen');
        }
      }

      const payload = {
        ...formData,
        imagenUrl,
        imagenPublicId,
      };

      const url = editMode ? `/api/inventario/${formData.id}` : '/api/inventario';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editMode ? 'Item actualizado' : 'Item agregado al inventario');
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

  const handleSelectExistingImage = (url: string, archivoId?: string) => {
    setFormData(prev => ({ ...prev, imagenUrl: url, archivoId: archivoId || '' }));
    setShowImageSelector(false);
  };

  // Multi-format file import handler
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.csv')) {
        // Parse CSV client-side
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim() !== '');

          const parsedItems = lines.slice(1).map(line => {
            const parts = line.split(',').map(p => p.trim());
            return {
              nombre: parts[0] || '',
              descripcion: parts[1] || '',
              estado: parts[2] || 'Bueno',
              ministerioNombre: parts[3] || '',
              cantidad: parts[4] || '1',
              ubicacion: parts[5] || '',
              notas: parts[6] || '',
            };
          }).filter(item => item.nombre);

          if (parsedItems.length === 0) return toast.error('El archivo está vacío o no tiene datos válidos');

          const res = await fetch('/api/inventario/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: parsedItems })
          });

          if (res.ok) {
            const data = await res.json();
            toast.success(data.mensaje || 'Items importados correctamente');
            fetchData();
          } else {
            toast.error('Error importando datos');
          }
        };
        reader.readAsText(file);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // Parse Excel client-side using xlsx
        const arrayBuffer = await file.arrayBuffer();
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(arrayBuffer);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet);

        const parsedItems = jsonData.map((row: any) => {
          // Try to map common column names (flexible)
          const keys = Object.keys(row);
          const findKey = (patterns: string[]) => {
            return keys.find(k => patterns.some(p => k.toLowerCase().includes(p)));
          };

          const nombreKey = findKey(['nombre', 'material', 'item', 'articulo', 'artículo', 'producto']);
          const descKey = findKey(['descripcion', 'descripción', 'detalle']);
          const estadoKey = findKey(['estado', 'condicion', 'condición']);
          const minKey = findKey(['ministerio', 'area', 'área', 'departamento']);
          const cantKey = findKey(['cantidad', 'qty', 'unidades']);
          const ubKey = findKey(['ubicacion', 'ubicación', 'lugar']);
          const notaKey = findKey(['nota', 'observ', 'comentario']);

          return {
            nombre: nombreKey ? String(row[nombreKey]) : String(row[keys[0]] || ''),
            descripcion: descKey ? String(row[descKey]) : (keys[1] ? String(row[keys[1]] || '') : ''),
            estado: estadoKey ? String(row[estadoKey]) : 'Bueno',
            ministerioNombre: minKey ? String(row[minKey]) : '',
            cantidad: cantKey ? String(row[cantKey]) : '1',
            ubicacion: ubKey ? String(row[ubKey]) : '',
            notas: notaKey ? String(row[notaKey]) : '',
          };
        }).filter((item: any) => item.nombre);

        if (parsedItems.length === 0) return toast.error('El archivo Excel está vacío o no tiene datos válidos');

        const res = await fetch('/api/inventario/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: parsedItems })
        });

        if (res.ok) {
          const data = await res.json();
          toast.success(data.mensaje || 'Items importados correctamente');
          fetchData();
        } else {
          toast.error('Error importando datos');
        }
      } else if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
        // Send to server for parsing
        const formData = new FormData();
        formData.append('file', file);

        const parseRes = await fetch('/api/inventario/parse', {
          method: 'POST',
          body: formData,
        });

        if (!parseRes.ok) {
          toast.error('Error al procesar el archivo');
          return;
        }

        const { items: parsedItems } = await parseRes.json();

        if (!parsedItems || parsedItems.length === 0) {
          toast.error('No se encontraron datos en el archivo');
          return;
        }

        const importRes = await fetch('/api/inventario/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: parsedItems })
        });

        if (importRes.ok) {
          const data = await importRes.json();
          toast.success(data.mensaje || 'Items importados correctamente');
          fetchData();
        } else {
          toast.error('Error importando datos');
        }
      } else {
        toast.error('Formato no soportado. Use CSV, Excel, PDF o Word.');
      }
    } catch (err) {
      console.error('Error en importación:', err);
      toast.error('Error procesando el archivo');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    items,
    ministerios,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroMinisterio,
    setFiltroMinisterio,
    loading,
    showForm,
    setShowForm,
    editMode,
    selectedItem,
    setSelectedItem,
    submitting,
    showImageSelector,
    setShowImageSelector,
    fileInputRef,
    formData,
    setFormData,
    imagen,
    setImagen,
    handleOpenCreate,
    handleOpenEdit,
    handleDelete,
    handleSubmit,
    handleSelectExistingImage,
    handleFileImport,
  };
}
