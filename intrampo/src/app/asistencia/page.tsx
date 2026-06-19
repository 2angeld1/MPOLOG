'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import AttendanceChart from '@/components/AttendanceChart';
import StatsCard from '@/components/StatsCard';

interface AsistenciaData {
  conteos: Array<{
    _id: string;
    fecha: string;
    iglesia: string;
    area: string;
    cantidad: number;
    observaciones?: string;
  }>;
  porIglesia: Record<string, number>;
  porArea: Record<string, number>;
  weeklyTrend: Record<string, number>;
  iglesias: string[];
}

// Demo data
function getDemoData(): AsistenciaData {
  const iglesias = ['Central', 'Norte', 'Oeste', 'Este', 'Arraijan', 'Bique'];
  const areas = ['Bloque 1 y 2', 'Bloque 3 y 4', 'Altar y Media', 'JEF Teen', 'Genesis', 'Cafetería'];

  const porIglesia: Record<string, number> = {};
  iglesias.forEach(ig => { porIglesia[ig] = 80 + Math.floor(Math.random() * 120); });

  const porArea: Record<string, number> = {};
  areas.forEach(a => { porArea[a] = 15 + Math.floor(Math.random() * 60); });

  const weeklyTrend: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    d.setDate(d.getDate() - d.getDay());
    weeklyTrend[d.toISOString().split('T')[0]] = 120 + Math.floor(Math.random() * 100);
  }

  const conteos = [];
  for (let i = 0; i < 20; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    conteos.push({
      _id: `demo-${i}`,
      fecha: d.toISOString(),
      iglesia: iglesias[Math.floor(Math.random() * iglesias.length)],
      area: areas[Math.floor(Math.random() * areas.length)],
      cantidad: 10 + Math.floor(Math.random() * 50),
      observaciones: '',
    });
  }

  return { conteos, porIglesia, porArea, weeklyTrend, iglesias };
}

export default function AsistenciaPage() {
  const [data, setData] = useState<AsistenciaData>(getDemoData());
  const [filtroIglesia, setFiltroIglesia] = useState('todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (filtroIglesia !== 'todas') params.set('iglesia', filtroIglesia);

        const res = await fetch(`/api/asistencia?${params}`);
        if (res.ok) {
          const json = await res.json();
          if (json.conteos?.length > 0) setData(json);
        }
      } catch {
        // Use demo data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filtroIglesia]);

  // Chart data preparation
  const weeklyLabels = Object.keys(data.weeklyTrend).map(key => {
    const d = new Date(key);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  });

  const lineChartData = {
    labels: weeklyLabels,
    datasets: [{
      label: 'Asistencia Total',
      data: Object.values(data.weeklyTrend),
      borderColor: 'hsl(42, 65%, 55%)',
      backgroundColor: 'hsla(42, 65%, 55%, 0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'hsl(42, 65%, 55%)',
      pointBorderColor: 'hsl(230, 22%, 14%)',
      pointBorderWidth: 2,
      pointRadius: 3,
    }],
  };

  const churchLabels = Object.keys(data.porIglesia);
  const churchColors = [
    'hsla(265, 55%, 55%, 0.8)',
    'hsla(42, 65%, 55%, 0.8)',
    'hsla(152, 55%, 48%, 0.8)',
    'hsla(210, 70%, 58%, 0.8)',
    'hsla(0, 70%, 58%, 0.8)',
    'hsla(25, 75%, 55%, 0.8)',
    'hsla(340, 60%, 55%, 0.8)',
    'hsla(180, 55%, 45%, 0.8)',
  ];

  const barChartData = {
    labels: churchLabels,
    datasets: [{
      label: 'Asistencia por Iglesia',
      data: Object.values(data.porIglesia),
      backgroundColor: churchLabels.map((_, i) => churchColors[i % churchColors.length]),
      borderRadius: 6,
      borderSkipped: false as const,
    }],
  };

  const areaLabels = Object.keys(data.porArea);
  const areaChartData = {
    labels: areaLabels,
    datasets: [{
      label: 'Asistencia por Área',
      data: Object.values(data.porArea),
      backgroundColor: 'hsla(42, 65%, 55%, 0.6)',
      borderColor: 'hsl(42, 65%, 55%)',
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false as const,
    }],
  };

  const totalAsistencia = Object.values(data.porIglesia).reduce((a, b) => a + b, 0);
  const promedioIglesia = churchLabels.length > 0 ? Math.round(totalAsistencia / churchLabels.length) : 0;

  return (
    <AppShell>
      <div className="animate-fade-in-up">
        <h1 className="page-title">Reportes de Asistencia</h1>
        <p className="page-subtitle">Análisis y estadísticas de asistencia por iglesia, área y periodo.</p>

        {/* Stats */}
        <div className="stats-grid">
          <StatsCard icon="📊" label="Total Contabilizado" value={totalAsistencia} color="gold" />
          <StatsCard icon="⛪" label="Promedio por Iglesia" value={promedioIglesia} color="purple" />
          <StatsCard icon="📈" label="Registros" value={data.conteos.length} color="green" />
          <StatsCard icon="🏠" label="Iglesias" value={data.iglesias.length || churchLabels.length} color="blue" />
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <button
            className={`filter-chip ${filtroIglesia === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltroIglesia('todas')}
          >
            Todas
          </button>
          {(data.iglesias.length > 0 ? data.iglesias : churchLabels).map((ig) => (
            <button
              key={ig}
              className={`filter-chip ${filtroIglesia === ig ? 'active' : ''}`}
              onClick={() => setFiltroIglesia(ig)}
            >
              {ig}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid-2 mb-8">
              <div className="chart-container">
                <h3 className="section-title mb-4">Tendencia Semanal</h3>
                <AttendanceChart type="line" data={lineChartData} height={280} />
              </div>
              <div className="chart-container">
                <h3 className="section-title mb-4">Asistencia por Iglesia</h3>
                <AttendanceChart type="bar" data={barChartData} height={280} />
              </div>
            </div>

            <div className="chart-container mb-8">
              <h3 className="section-title mb-4">Asistencia por Área</h3>
              <AttendanceChart type="bar" data={areaChartData} height={250} />
            </div>

            {/* Data Table */}
            <div className="section-header">
              <h2 className="section-title">Registros Detallados</h2>
              <span className="badge badge-gold">{data.conteos.length} registros</span>
            </div>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Iglesia</th>
                    <th>Área</th>
                    <th>Cantidad</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.conteos.slice(0, 20).map((c) => (
                    <tr key={c._id}>
                      <td>{new Date(c.fecha).toLocaleDateString('es-PA', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td><span className="badge badge-purple">{c.iglesia}</span></td>
                      <td>{c.area}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{c.cantidad}</td>
                      <td style={{ color: 'var(--text-tertiary)' }}>{c.observaciones || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
