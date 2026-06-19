'use client';

import { useEditMode } from './cms/EditModeContext';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { isEditMode, toggleEditMode, canEdit } = useEditMode();

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-right">
        {canEdit && (
          <button 
            className={`btn btn-sm ${isEditMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={toggleEditMode}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            title="Activar/Desactivar Modo Edición"
          >
            ✏️ {isEditMode ? 'Editando' : 'Modo Edición'}
          </button>
        )}
        <div className="header-search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Buscar..."
            id="global-search"
          />
        </div>
      </div>
    </header>
  );
}
