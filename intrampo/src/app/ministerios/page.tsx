'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import type { IMinisterio } from '@/types';

export default function MinisteriosPage() {
  const [ministerios, setMinisterios] = useState<IMinisterio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMinisterios = async () => {
      try {
        const res = await fetch('/api/ministerios');
        if (res.ok) {
          const data = await res.json();
          setMinisterios(data.ministerios || []);
        }
      } catch {
        // Fallback handled by API
      } finally {
        setLoading(false);
      }
    };
    fetchMinisterios();
  }, []);

  return (
    <AppShell>
      <div className="animate-fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="page-title">Ministerios</h1>
            <p className="page-subtitle">Explora los diferentes ministerios y áreas de servicio de la iglesia.</p>
          </div>
          <button className="btn btn-primary" id="new-ministry-btn">
            ➕ Crear Ministerio
          </button>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <div className="ministry-grid stagger-children">
            {ministerios.map((min) => (
              <div key={min.id} className="ministry-card">
                <div className="ministry-card-header">
                  <div
                    className="ministry-icon"
                    style={{
                      backgroundColor: `${min.color}20`,
                      color: min.color,
                    }}
                  >
                    {min.icono}
                  </div>
                  <div>
                    <div className="ministry-card-name">{min.nombre}</div>
                    {!min.activo && <span className="badge badge-red" style={{ marginTop: 4 }}>Inactivo</span>}
                  </div>
                </div>
                <div className="ministry-card-body">
                  <p className="ministry-card-desc">{min.descripcion || 'Sin descripción.'}</p>
                  
                  <div className="ministry-card-stats">
                    <div className="ministry-stat">
                      <div className="ministry-stat-value">{min.miembrosIds?.length || 0}</div>
                      <div className="ministry-stat-label">Miembros</div>
                    </div>
                    <div className="ministry-stat">
                      <div className="ministry-stat-value">{(min as any).lideres?.length || 0}</div>
                      <div className="ministry-stat-label">Líderes</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {ministerios.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-state-icon">⛪</div>
                <div className="empty-state-title">Sin ministerios</div>
                <div className="empty-state-text">No hay ministerios registrados aún.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
