'use client';

import AppShell from '@/components/AppShell';
import { StaggerContainer, StaggerItem } from '@/animations';
import { useMinisterios } from '@/hooks/useMinisterios';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { getMinisterioIcon } from '@/lib/ministerioIcons';
import { FaChurch } from 'react-icons/fa';
import MinisterioFormModal from './MinisterioFormModal';
import MiembrosModal from './MiembrosModal';

export default function MinisteriosPage() {
  const {
    ministerios, loading,
    showForm, setShowForm, editMode, submitting, formData, setFormData,
    showMembersModal, setShowMembersModal, selectedMinisterio,
    miembrosSeleccionados, busquedaMiembros, setBusquedaMiembros,
    handleOpenCreate, handleOpenEdit, handleDelete, handleSubmit,
    handleOpenManageMembers, handleToggleMember, handleSaveMembers,
    miembrosFiltrados,
  } = useMinisterios();

  return (
    <AppShell>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Ministerios</h1>
          <p className="text-gray-400 text-[0.95rem]">Explora y administra las áreas de servicio de la iglesia.</p>
        </div>
        <button
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2"
          onClick={handleOpenCreate}
        >
          <FiPlus size={18} /> Crear Ministerio
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ministerios.map((min) => (
            <StaggerItem
              key={min.id}
              className="bg-[#1a1c25] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full group relative"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(min)} className="p-2 bg-black/50 hover:bg-amber-500 text-white hover:text-black rounded-lg backdrop-blur-sm transition-colors" title="Editar">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => handleDelete(min.id)} className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors" title="Eliminar">
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div className="p-6 border-b border-white/5 flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${min.color}20`, color: min.color }}
                >
                  {(() => { const Icon = getMinisterioIcon(min.icono || 'church'); return <Icon />; })()}
                </div>
                <div className="flex-1 pt-1 pr-12">
                  <div className="font-display text-xl font-bold text-gray-100 leading-tight mb-1">{min.nombre}</div>
                  {!min.activo && (
                    <span className="inline-block bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md text-[0.65rem] font-bold tracking-wider uppercase mt-1">Inactivo</span>
                  )}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{min.descripcion || 'Sin descripción.'}</p>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 mb-4">
                  <div className="bg-[#14161f] rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-2xl font-display font-bold text-gray-200 mb-1">{min.miembrosIds?.length || 0}</div>
                    <div className="text-[0.65rem] font-bold text-gray-500 uppercase tracking-wider">Miembros</div>
                  </div>
                  <div className="bg-[#14161f] rounded-xl p-3 border border-white/5 text-center">
                    <div className="text-2xl font-display font-bold text-amber-500 mb-1">{(min as any).lideres?.length || 0}</div>
                    <div className="text-[0.65rem] font-bold text-amber-500/70 uppercase tracking-wider">Líderes</div>
                  </div>
                </div>
                <button onClick={() => handleOpenManageMembers(min)} className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-2">
                  <FiUsers size={16} /> Gestionar Miembros
                </button>
              </div>
            </StaggerItem>
          ))}

          {ministerios.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
              <FaChurch className="text-4xl mb-4 opacity-50" />
              <div className="font-display text-xl font-semibold mb-2 text-gray-400">Sin ministerios</div>
              <div className="text-sm text-center">No hay ministerios registrados aún.</div>
            </div>
          )}
        </StaggerContainer>
      )}

      {/* Acciones / Modales */}
      <MinisterioFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        editMode={editMode}
        submitting={submitting}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <MiembrosModal
        isOpen={showMembersModal && !!selectedMinisterio}
        onClose={() => setShowMembersModal(false)}
        ministerioNombre={selectedMinisterio?.nombre}
        submitting={submitting}
        busqueda={busquedaMiembros}
        setBusqueda={setBusquedaMiembros}
        miembrosFiltrados={miembrosFiltrados}
        miembrosSeleccionados={miembrosSeleccionados}
        onToggleMember={handleToggleMember}
        onSave={handleSaveMembers}
      />
    </AppShell>
  );
}
