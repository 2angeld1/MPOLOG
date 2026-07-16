'use client';

import AppShell, { useAppContext } from '@/components/AppShell';
import { StaggerContainer, StaggerItem } from '@/animations';
import { useInventario, ESTADOS_MATERIAL } from '@/hooks/useInventario';
import { FiPlus, FiEdit2, FiSearch, FiUpload, FiPackage, FiFilter, FiHash, FiMapPin } from 'react-icons/fi';
import ItemFormModal from './ItemFormModal';
import ItemDetailModal from './ItemDetailModal';
import ImageSelectorModal from './ImageSelectorModal';

const estadoColors: Record<string, { bg: string; text: string; border: string }> = {
  'Nuevo': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500' },
  'Bueno': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
  'Regular': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500' },
  'Deteriorado': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500' },
  'Fuera de servicio': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500' },
};

export default function InventarioPage() {
  const { user } = useAppContext();
  const safeRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const canManage = safeRoles.some(r => ['admin', 'superadmin', 'logisticadmin', 'pastor', 'logistica', 'logísima', 'logística'].includes(r));

  const {
    items, ministerios, busqueda, setBusqueda,
    filtroEstado, setFiltroEstado, filtroMinisterio, setFiltroMinisterio,
    loading, showForm, setShowForm, editMode, selectedItem, setSelectedItem,
    submitting, showImageSelector, setShowImageSelector, fileInputRef,
    formData, setFormData, setImagen,
    handleOpenCreate, handleOpenEdit, handleDelete, handleSubmit,
    handleSelectExistingImage, handleFileImport,
  } = useInventario();

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Inventario de Materiales</h1>
          <p className="text-gray-400 text-[0.95rem]">Gestiona los materiales y equipos de la iglesia.</p>
        </div>
        {canManage && (
          <div className="flex gap-2 flex-wrap">
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,.docx"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileImport}
            />
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10 flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload size={16} /> Importar
            </button>
            <button
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 flex items-center gap-2"
              onClick={handleOpenCreate}
            >
              <FiPlus size={18} /> Agregar Item
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 bg-[#1a1c25] rounded-xl border border-white/10 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-full py-2.5 pr-4 pl-10 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            className="bg-[#14161f] border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 appearance-none cursor-pointer"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS_MATERIAL.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <select
            className="bg-[#14161f] border border-white/10 text-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 appearance-none cursor-pointer"
            value={filtroMinisterio}
            onChange={(e) => setFiltroMinisterio(e.target.value)}
          >
            <option value="">Todos los ministerios</option>
            {ministerios.map((m: any) => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary badge */}
      <div className="mb-8 flex items-center gap-3">
        <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
        {filtroEstado && (
          <button onClick={() => setFiltroEstado('')} className="bg-white/5 text-gray-400 hover:text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors">
            Estado: {filtroEstado} ✕
          </button>
        )}
        {filtroMinisterio && (
          <button onClick={() => setFiltroMinisterio('')} className="bg-white/5 text-gray-400 hover:text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors">
            Ministerio: {filtroMinisterio} ✕
          </button>
        )}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const colors = estadoColors[item.estado] || { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-white/10' };
            return (
              <StaggerItem
                key={item._id}
                className="bg-[#1a1c25] rounded-2xl border border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col group relative overflow-hidden"
                onClick={() => setSelectedItem(item)}
              >
                {/* Edit overlay */}
                {canManage && (
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
                      className="p-1.5 bg-black/50 hover:bg-amber-500 text-white hover:text-black rounded-lg backdrop-blur-sm transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 size={14} />
                    </button>
                  </div>
                )}

                {/* Image */}
                {item.imagenUrl ? (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={item.imagenUrl}
                      alt={item.nombre}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                    <FiPackage className="text-4xl text-gray-600" />
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-semibold text-gray-100 mb-2 line-clamp-1">{item.nombre}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">{item.descripcion}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`${colors.bg} ${colors.text} px-2 py-0.5 rounded-full text-[0.65rem] font-bold tracking-wider`}>
                      {item.estado}
                    </span>
                    {item.ministerioNombre && (
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold">
                        {item.ministerioNombre}
                      </span>
                    )}
                  </div>

                  {/* Footer info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <FiHash size={12} /> {item.cantidad}
                    </span>
                    {item.ubicacion && (
                      <span className="flex items-center gap-1 truncate">
                        <FiMapPin size={12} /> {item.ubicacion}
                      </span>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
              <FiPackage className="text-4xl mb-4" />
              <div className="font-display text-xl font-semibold mb-2">Inventario Vacío</div>
              <div className="text-sm text-center">No hay items registrados aún. Puedes agregar uno o importar desde un archivo.</div>
            </div>
          )}
        </StaggerContainer>
      )}

      {/* Modals */}
      <ItemFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        editMode={editMode}
        submitting={submitting}
        formData={formData}
        setFormData={setFormData}
        setImagen={setImagen}
        onSubmit={handleSubmit}
        ministerios={ministerios}
        onOpenImageSelector={() => setShowImageSelector(true)}
      />

      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        canManage={canManage}
      />

      <ImageSelectorModal
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleSelectExistingImage}
      />
    </AppShell>
  );
}
