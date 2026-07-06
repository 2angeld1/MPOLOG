'use client';

import { useEditMode } from './cms/EditModeContext';
import { FiMenu, FiSearch, FiEdit2 } from 'react-icons/fi';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { isEditMode, toggleEditMode, canEdit } = useEditMode();

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-[70px] bg-[#14161f]/80 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-4 lg:px-8 z-[90] transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors" 
          onClick={onMenuClick}
        >
          <FiMenu size={20} />
        </button>
        <h2 className="font-display text-lg font-semibold text-gray-100">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {canEdit && (
          <button 
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${isEditMode ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/20' : 'bg-white/5 text-amber-500 border border-amber-500/30 hover:bg-amber-500/10'}`}
            onClick={toggleEditMode}
            title="Activar/Desactivar Modo Edición"
          >
            <FiEdit2 size={14} /> {isEditMode ? 'Editando' : 'Modo Edición'}
          </button>
        )}
        <div className="relative hidden md:block group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            id="global-search"
            className="bg-[#1a1c25] border border-white/10 rounded-full py-2 pr-4 pl-10 w-[200px] text-gray-200 text-sm outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:w-[260px] placeholder:text-gray-500"
          />
        </div>
      </div>
    </header>
  );
}
