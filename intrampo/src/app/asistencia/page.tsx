'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import AttendanceChart from '@/components/AttendanceChart';
import StatsCard from '@/components/StatsCard';
import { FadeIn, StaggerContainer, StaggerItem } from '@/animations';

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
      <FadeIn>
        <h1 className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight">Reportes de Asistencia</h1>
        <p className="text-gray-400 text-[0.95rem] mb-8">Análisis y estadísticas de asistencia por iglesia, área y periodo.</p>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StaggerItem><StatsCard icon="📊" label="Total Contabilizado" value={totalAsistencia} color="gold" /></StaggerItem>
          <StaggerItem><StatsCard icon="⛪" label="Promedio por Iglesia" value={promedioIglesia} color="purple" /></StaggerItem>
          <StaggerItem><StatsCard icon="📈" label="Registros" value={data.conteos.length} color="green" /></StaggerItem>
          <StaggerItem><StatsCard icon="🏠" label="Iglesias" value={data.iglesias.length || churchLabels.length} color="blue" /></StaggerItem>
        </StaggerContainer>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-[#1a1c25] rounded-xl border border-white/10 shadow-sm">
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filtroIglesia === 'todas' ? 'bg-amber-500 text-gray-900' : 'bg-[#14161f] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'}`}
            onClick={() => setFiltroIglesia('todas')}
          >
            Todas
          </button>
          {(data.iglesias.length > 0 ? data.iglesias : churchLabels).map((ig) => (
            <button
              key={ig}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filtroIglesia === ig ? 'bg-amber-500 text-gray-900' : 'bg-[#14161f] text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'}`}
              onClick={() => setFiltroIglesia(ig)}
            >
              {ig}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-lg">
                <h3 className="font-display text-lg font-semibold text-gray-100 mb-6">Tendencia Semanal</h3>
                <AttendanceChart type="line" data={lineChartData} height={280} />
              </div>
              <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-lg">
                <h3 className="font-display text-lg font-semibold text-gray-100 mb-6">Asistencia por Iglesia</h3>
                <AttendanceChart type="bar" data={barChartData} height={280} />
              </div>
            </div>

            <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-lg mb-8">
              <h3 className="font-display text-lg font-semibold text-gray-100 mb-6">Asistencia por Área</h3>
              <AttendanceChart type="bar" data={areaChartData} height={250} />
            </div>

            {/* Data Table */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-gray-100">Registros Detallados</h2>
              <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider">{data.conteos.length} registros</span>
            </div>
            <div className="overflow-x-auto bg-[#1a1c25]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="p-4 font-semibold uppercase tracking-wider">Fecha</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Iglesia</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Área</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Cantidad</th>
                    <th className="p-4 font-semibold uppercase tracking-wider">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.conteos.slice(0, 20).map((c) => (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-gray-200">{new Date(c.fecha).toLocaleDateString('es-PA', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="p-4"><span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-bold tracking-wider uppercase">{c.iglesia}</span></td>
                      <td className="p-4 text-gray-300">{c.area}</td>
                      <td className="p-4 font-bold text-amber-500">{c.cantidad}</td>
                      <td className="p-4 text-gray-500 text-sm">{c.observaciones || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </FadeIn>
    </AppShell>
  );
}
