'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  canEdit: boolean;
  contentMap: Record<string, string>;
  updateContent: (llave: string, valor: string, tipo: 'texto' | 'imagen' | 'html') => Promise<void>;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  toggleEditMode: () => {},
  canEdit: false,
  contentMap: {},
  updateContent: async () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children, userRoles = [] }: { children: ReactNode; userRoles?: string[] }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  
  const canEdit = userRoles.includes('admin') || userRoles.includes('logisticadmin') || userRoles.includes('editor');

  useEffect(() => {
    // Load content on mount
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.contenidos) {
          setContentMap(data.contenidos);
        }
      })
      .catch(console.error);
  }, []);

  const toggleEditMode = () => {
    if (canEdit) {
      setIsEditMode(!isEditMode);
    }
  };

  const updateContent = async (llave: string, valor: string, tipo: 'texto' | 'imagen' | 'html') => {
    try {
      // Optimistic update
      setContentMap(prev => ({ ...prev, [llave]: valor }));
      
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ llave, valor, tipo }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      // Fallback update could go here
    }
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode, canEdit, contentMap, updateContent }}>
      {children}
    </EditModeContext.Provider>
  );
}
