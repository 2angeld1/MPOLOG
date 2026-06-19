'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditMode } from './EditModeContext';

interface EditableTextProps {
  id: string;
  fallback: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
}

export default function EditableText({
  id,
  fallback,
  as: Component = 'span',
  className = '',
  multiline = false,
}: EditableTextProps) {
  const { isEditMode, contentMap, updateContent } = useEditMode();
  const [value, setValue] = useState(contentMap[id] || fallback);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (contentMap[id] !== undefined) {
      setValue(contentMap[id]);
    }
  }, [contentMap, id]);

  const handleSave = () => {
    setIsEditing(false);
    if (value !== contentMap[id] && value.trim() !== '') {
      updateContent(id, value, 'texto');
    } else if (value.trim() === '') {
      // Revert if empty
      setValue(contentMap[id] || fallback);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setValue(contentMap[id] || fallback);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <div className="editable-wrapper editing">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={`editable-input ${className}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={`editable-input ${className}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        )}
      </div>
    );
  }

  return (
    <div className="editable-wrapper" onClick={() => setIsEditing(true)} title="Haz clic para editar">
      <Component className={`${className} editable-hover`}>{value}</Component>
      <div className="editable-icon">✏️</div>
    </div>
  );
}
