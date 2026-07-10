'use client';

import AppShell from '@/components/AppShell';
import { FadeIn, StaggerContainer, StaggerItem } from '@/animations';
import { FiFolder, FiFolderPlus, FiArrowLeft, FiFile, FiCopy, FiTrash2, FiExternalLink, FiUploadCloud } from 'react-icons/fi';
import { useArchivos } from '@/hooks/useArchivos';
import UploadFileModal from './UploadFileModal';
import CreateFolderModal from './CreateFolderModal';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ArchivosPage() {
  const {
    loading,
    carpetaActual,
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
  } = useArchivos();

  // Breadcrumbs builder
  const renderBreadcrumbs = () => {
    const parts = carpetaActual.split('/').filter(Boolean);
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-white/[0.02] py-2 px-4 rounded-xl border border-white/5 w-fit">
        <button className="hover:text-amber-500 font-semibold transition-colors flex items-center gap-1" onClick={() => navigateToFolder('')}>
          📁 Raíz
        </button>
        {parts.map((p, idx) => {
          const path = '/' + parts.slice(0, idx + 1).join('/');
          return (
            <span key={path} className="flex items-center gap-2">
              <span className="text-gray-600">/</span>
              <button className="hover:text-amber-500 font-semibold transition-colors" onClick={() => navigateToFolder(parts.slice(0, idx + 1).join('/'))}>
                {p}
              </button>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <AppShell>
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Imágenes y Archivos</h1>
            <p className="text-gray-400 text-[0.95rem]">Galería de recursos y documentos generales.</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-[#1a1c25] hover:bg-white/5 text-gray-300 font-semibold py-2.5 px-4 rounded-lg transition-all border border-white/10 flex items-center gap-2 text-sm"
              onClick={() => setShowFolderForm(true)}
            >
              <FiFolderPlus size={16} /> Nueva Carpeta
            </button>
            <button 
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2 text-sm" 
              onClick={() => setShowUploadForm(true)}
            >
              <FiUploadCloud size={16} /> Subir Archivo
            </button>
          </div>
        </div>

        {/* Navigation Breadcrumbs & Back Button */}
        <div className="flex items-center gap-3">
          {carpetaActual !== '/' && (
            <button 
              onClick={navigateBack} 
              className="mb-6 p-2 bg-[#1a1c25] hover:bg-white/5 border border-white/10 text-gray-300 rounded-xl transition-colors flex items-center justify-center shrink-0"
              title="Volver"
            >
              <FiArrowLeft size={16} />
            </button>
          )}
          {renderBreadcrumbs()}
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Folders Grid */}
            {carpetasVisibles.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Carpetas</h3>
                <StaggerContainer className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                  {carpetasVisibles.map((c) => (
                    <StaggerItem 
                      key={c._id} 
                      className="bg-[#1a1c25] hover:bg-white/5 rounded-xl border border-white/10 p-4 transition-all duration-200 cursor-pointer flex items-center gap-3 group"
                      onClick={() => navigateToFolder(c.nombre)}
                    >
                      <FiFolder className="text-amber-500 group-hover:scale-110 transition-transform shrink-0" size={24} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-200 truncate group-hover:text-amber-400 transition-colors" title={c.nombre}>
                          {c.nombre}
                        </div>
                        <div className="text-[0.65rem] text-gray-500 font-medium uppercase mt-0.5">Carpeta</div>
                      </div>
                      <button 
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-all shrink-0"
                        onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}
                        title="Eliminar carpeta"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* Files Grid */}
            <div>
              {carpetasVisibles.length > 0 && (
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Archivos</h3>
              )}
              <StaggerContainer className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
                {archivosVisibles.map((a) => (
                  <StaggerItem key={a._id} className="bg-[#1a1c25] rounded-2xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <div className="h-[160px] bg-black/20 flex items-center justify-center overflow-hidden relative">
                      {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(a.formato.toLowerCase()) ? (
                        <img src={a.url} alt={a.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <FiFile className="text-5xl opacity-50 group-hover:opacity-80 transition-opacity text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c25] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      <div className="font-semibold text-[0.95rem] text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-amber-400 transition-colors" title={a.nombre}>
                        {a.nombre}
                      </div>
                      <div className="flex justify-between text-[0.8rem] text-gray-500 font-semibold tracking-wide">
                        <span className="uppercase">{a.formato}</span>
                        <span>{formatBytes(a.tamano)}</span>
                      </div>
                      <div className="flex gap-2 mt-auto pt-4 border-t border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="flex-1 py-2 px-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[0.8rem] font-semibold transition-colors border border-transparent hover:border-white/10 flex items-center justify-center gap-1" onClick={() => window.open(a.url, '_blank')}>
                          <FiExternalLink size={12} /> Ver
                        </button>
                        <button className="flex-1 py-2 px-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[0.8rem] font-semibold transition-colors border border-transparent hover:border-white/10 flex items-center justify-center gap-1" onClick={() => copyToClipboard(a.url)}>
                          <FiCopy size={12} /> Copiar
                        </button>
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-colors flex items-center justify-center shrink-0" onClick={() => handleDelete(a._id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
                
                {itemsEnCarpeta.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500 bg-[#1a1c25]/50 border border-white/5 rounded-2xl border-dashed">
                    <div className="text-4xl mb-4 opacity-50">📁</div>
                    <div className="font-display text-xl font-semibold mb-2 text-gray-400">Carpeta vacía</div>
                    <div className="text-sm text-center">No hay elementos en esta carpeta. Sube un archivo o crea una subcarpeta.</div>
                  </div>
                )}
              </StaggerContainer>
            </div>
          </div>
        )}
      </FadeIn>

      {/* Modals de Archivos */}
      <UploadFileModal
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        submitting={submitting}
        uploadError={uploadError}
        carpetaActual={carpetaActual}
        uploadData={uploadData}
        onFileChange={handleFileChange}
        onNameChange={(name) => setUploadData({ ...uploadData, nombre: name })}
        onSubmit={handleUploadSubmit}
      />

      <CreateFolderModal
        isOpen={showFolderForm}
        onClose={() => setShowFolderForm(false)}
        submitting={submitting}
        carpetaActual={carpetaActual}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onSubmit={handleCreateFolderSubmit}
      />
    </AppShell>
  );
}
