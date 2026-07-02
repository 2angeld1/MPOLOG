'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditMode } from './EditModeContext';
import Image from 'next/image';

interface EditableImageProps {
  id: string;
  fallback: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

export default function EditableImage({
  id,
  fallback,
  alt,
  width,
  height,
  className = '',
  fill = false,
}: EditableImageProps) {
  const { isEditMode, contentMap, updateContent } = useEditMode();
  const [src, setSrc] = useState(contentMap[id] || fallback);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contentMap[id]) {
      setSrc(contentMap[id]);
    }
  }, [contentMap, id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'INTRA - MPO/cms');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      if (data.url) {
        setSrc(data.url);
        await updateContent(id, data.url, 'imagen');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const imageProps = fill
    ? { fill: true, style: { objectFit: 'cover' as const } }
    : { width: width || 800, height: height || 600 };

  const content = (
    <div style={{ position: 'relative', width: fill ? '100%' : 'auto', height: fill ? '100%' : 'auto' }} className={className}>
      <img
        src={src}
        alt={alt}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : { maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );

  if (!isEditMode) {
    return content;
  }

  return (
    <div className={`editable-image-wrapper ${className}`} style={{ position: 'relative', display: 'inline-block', width: fill ? '100%' : 'auto', height: fill ? '100%' : 'auto' }}>
      {content}

      <div className="editable-image-overlay">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : '📷 Cambiar Imagen'}
        </button>
      </div>
    </div>
  );
}
