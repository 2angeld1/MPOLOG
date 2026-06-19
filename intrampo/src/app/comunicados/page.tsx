'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { useAppContext } from '@/components/AppShell';
import type { IComunicado } from '@/types';

type Categoria = 'todos' | 'pastoral' | 'administrativo' | 'evento' | 'urgente' | 'general';

const categorias: { value: Categoria; label: string; emoji: string }[] = [
  { value: 'todos', label: 'Todos', emoji: '📋' },
  { value: 'pastoral', label: 'Pastoral', emoji: '🙏' },
  { value: 'evento', label: 'Eventos', emoji: '📅' },
  { value: 'administrativo', label: 'Admin', emoji: '📎' },
  { value: 'urgente', label: 'Urgente', emoji: '🚨' },
  { value: 'general', label: 'General', emoji: '📢' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-PA', { day: 'numeric', month: 'short' });
}

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<IComunicado[]>([]);
  const [filtro, setFiltro] = useState<Categoria>('todos');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ titulo: '', contenido: '', categoria: 'general' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComunicados();
  }, []);

  const fetchComunicados = async () => {
    try {
      const res = await fetch('/api/comunicados');
      if (res.ok) {
        const data = await res.json();
        setComunicados(data.comunicados || []);
      }
    } catch {
      // Will get demo data from API
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/comunicados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ titulo: '', contenido: '', categoria: 'general' });
        fetchComunicados();
      }
    } catch {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filtro === 'todos'
    ? comunicados
    : comunicados.filter(c => c.categoria === filtro);

  return (
    <AppShell>
      <div className="animate-fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
          <div>
            <h1 className="page-title">Comunicados</h1>
            <p className="page-subtitle">Noticias y avisos de la iglesia para la congregación.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)} id="new-comunicado-btn">
            ➕ Nuevo Comunicado
          </button>
        </div>

        {/* Category filters */}
        <div className="filters-bar">
          {categorias.map((cat) => (
            <button
              key={cat.value}
              className={`filter-chip ${filtro === cat.value ? 'active' : ''}`}
              onClick={() => setFiltro(cat.value)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Comunicados list */}
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <div className="announcement-list stagger-children">
            {filtered.map((c) => (
              <div key={c.id} className={`announcement-card ${c.fijado ? 'pinned' : ''}`}>
                <span className={`announcement-category cat-${c.categoria}`}>
                  {categorias.find(cat => cat.value === c.categoria)?.emoji || '📢'} {c.categoria}
                </span>
                <div className="announcement-title">{c.titulo}</div>
                <div className="announcement-body">{c.contenido}</div>
                <div className="announcement-footer">
                  <span className="announcement-author">
                    ✍️ {c.autorNombre}
                  </span>
                  <span className="announcement-date">{timeAgo(c.createdAt)}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📢</div>
                <div className="empty-state-title">Sin comunicados</div>
                <div className="empty-state-text">No hay comunicados en esta categoría.</div>
              </div>
            )}
          </div>
        )}

        {/* New Comunicado Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Nuevo Comunicado</h3>
                <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label" htmlFor="com-titulo">Título</label>
                    <input
                      id="com-titulo"
                      className="form-input"
                      placeholder="Título del comunicado"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="com-categoria">Categoría</label>
                    <select
                      id="com-categoria"
                      className="form-input form-select"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    >
                      <option value="general">General</option>
                      <option value="pastoral">Pastoral</option>
                      <option value="evento">Evento</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="com-contenido">Contenido</label>
                    <textarea
                      id="com-contenido"
                      className="form-input form-textarea"
                      placeholder="Escribe el contenido del comunicado..."
                      value={formData.contenido}
                      onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                      required
                      rows={5}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
