'use client';

import AppShell from '@/components/AppShell';
import { StaggerContainer, StaggerItem } from '@/animations';
import { useDirectorio } from '@/hooks/useDirectorio';
import { FiPlus, FiEdit2, FiSearch, FiPhone, FiUpload, FiUser, FiUsers } from 'react-icons/fi';
import { getAvatarColor, getInitials, isNuevo } from '@/lib/utils';
import MiembroFormModal from './MiembroFormModal';
import MiembroDetailModal from './MiembroDetailModal';

export default function DirectorioPage() {
  const {
    miembros, ministerios, busqueda, setBusqueda,
    loading, showForm, setShowForm, editMode, selectedMiembro, setSelectedMiembro,
    submitting, csvInputRef, formData, setFormData, setFoto,
    handleOpenCreate, handleOpenEdit, handleDelete, handleSubmit, handleCsvImport,
  } = useDirectorio();

  return (
    <AppShell>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Directorio de Miembros</h1>
          <p className="text-gray-400 text-[0.95rem]">Encuentra y administra los miembros de la congregación.</p>
        </div>
        <div className="flex gap-2">
          <input type="file" accept=".csv" ref={csvInputRef} className="hidden" onChange={handleCsvImport} />
          <button
            className="px-4 py-2 rounded-lg font-semibold bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10 flex items-center gap-2"
            onClick={() => csvInputRef.current?.click()}
          >
            <FiUpload size={16} /> Importar CSV
          </button>
          <button
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 flex items-center gap-2"
            onClick={handleOpenCreate}
          >
            <FiPlus size={18} /> Agregar Miembro
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 bg-[#1a1c25] rounded-xl border border-white/10 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            className="w-full bg-[#14161f] border border-white/10 text-white rounded-full py-2.5 pr-4 pl-10 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Summary badge */}
      <div className="mb-8">
        <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
          {miembros.length} registros
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {miembros.map((miembro) => {
            const nuevo = isNuevo(miembro.createdAt);
            return (
              <StaggerItem
                key={miembro._id}
                className={`bg-[#1a1c25] rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center group relative ${nuevo ? 'border-amber-500 shadow-amber-500/10' : 'border-white/10 hover:border-white/20'}`}
                onClick={() => setSelectedMiembro(miembro)}
              >
                {/* Edit action hidden overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(miembro); }}
                    className="p-1.5 bg-black/50 hover:bg-amber-500 text-white hover:text-black rounded-lg backdrop-blur-sm transition-colors"
                    title="Editar"
                  >
                    <FiEdit2 size={14} />
                  </button>
                </div>

                <div
                  className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold shadow-md mt-2"
                  style={{ background: miembro.fotoUrl ? `url(${miembro.fotoUrl}) center/cover` : getAvatarColor(miembro.nombre), color: '#fff' }}
                >
                  {!miembro.fotoUrl && getInitials(miembro.nombre)}
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-semibold text-gray-100">{miembro.nombre}</h3>
                    {nuevo && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wider">NUEVO</span>}
                  </div>
                  <div className="mb-3 flex flex-wrap justify-center gap-1.5">
                    {miembro.esServidor && miembro.dondeSirve ? (
                      miembro.dondeSirve.split(',').map((area, i) => (
                        <span key={i} className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold">{area.trim()}</span>
                      ))
                    ) : (
                      <span className="bg-white/5 text-gray-500 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold">Sin ministerio</span>
                    )}
                  </div>
                  <div className="mt-auto flex flex-col items-center gap-1.5 w-full">
                    <div className="text-sm text-gray-400 flex items-center gap-1.5">
                      <FiPhone size={13} /> {miembro.telefono}
                    </div>
                    {miembro.parentesco && (
                      <div className="text-[0.7rem] text-gray-500 flex items-center gap-1.5 text-center px-2">
                        <FiUsers size={12} className="shrink-0" /> {miembro.parentesco}
                      </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
          {miembros.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
              <FiUser className="text-4xl mb-4" />
              <div className="font-display text-xl font-semibold mb-2">Directorio Vacío</div>
              <div className="text-sm text-center">No hay miembros registrados aún. Puedes agregar uno o importar un archivo CSV.</div>
            </div>
          )}
        </StaggerContainer>
      )}

      {/* Modales separados */}
      <MiembroFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        editMode={editMode}
        submitting={submitting}
        formData={formData}
        setFormData={setFormData}
        setFoto={setFoto}
        onSubmit={handleSubmit}
        ministerios={ministerios}
      />

      <MiembroDetailModal
        miembro={selectedMiembro}
        onClose={() => setSelectedMiembro(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}
