'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import StatsCard from '@/components/StatsCard';
import AttendanceChart from '@/components/AttendanceChart';
import EditableText from '@/components/cms/EditableText';
import type { IEvento } from '@/types';
import { FadeIn, StaggerContainer, StaggerItem } from '@/animations';

interface DashboardData {
  stats: {
    totalMiembros: number;
    eventosActivos: number;
    asistenciaPromedio: number;
    totalMinisterios: number;
  };
  proximosEventos: IEvento[];
  weeklyAttendance: Record<string, number>;
}

// Demo data for when MongoDB is not connected
const demoData: DashboardData = {
  stats: {
    totalMiembros: 247,
    eventosActivos: 5,
    asistenciaPromedio: 183,
    totalMinisterios: 6,
  },
  proximosEventos: [
    { _id: '1', nombre: 'Culto Dominical', tipo: 'culto', color: '#673AB7', fechaInicio: getNextSunday(), fechaFin: getNextSunday(), departamento: 'General', activo: true, precioTotal: 0 },
    { _id: '2', nombre: 'Ensayo de Alabanza', tipo: 'reunion', color: '#D4A843', fechaInicio: getNextWeekday(3), fechaFin: getNextWeekday(3), departamento: 'Alabanza', activo: true, precioTotal: 0 },
    { _id: '3', nombre: 'JEF Teen Viernes', tipo: 'reunion', color: '#E91E63', fechaInicio: getNextWeekday(5), fechaFin: getNextWeekday(5), departamento: 'JEF Teen', activo: true, precioTotal: 0 },
    { _id: '4', nombre: 'Retiro de Jóvenes', tipo: 'retiro', color: '#00BCD4', fechaInicio: getDateDaysFromNow(12), fechaFin: getDateDaysFromNow(14), departamento: 'Jóvenes', activo: true, precioTotal: 35 },
    { _id: '5', nombre: 'Vigilia de Oración', tipo: 'vigilia', color: '#3F51B5', fechaInicio: getDateDaysFromNow(18), fechaFin: getDateDaysFromNow(18), departamento: 'General', activo: true, precioTotal: 0 },
  ],
  weeklyAttendance: generateDemoWeeklyData(),
};

function getNextSunday(): string {
  const d = new Date();
  d.setDate(d.getDate() + (7 - d.getDay()) % 7 || 7);
  return d.toISOString();
}

function getNextWeekday(day: number): string {
  const d = new Date();
  d.setDate(d.getDate() + ((day - d.getDay() + 7) % 7 || 7));
  return d.toISOString();
}

function getDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function generateDemoWeeklyData(): Record<string, number> {
  const data: Record<string, number> = {};
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - (i * 7));
    d.setDate(d.getDate() - d.getDay());
    const key = d.toISOString().split('T')[0];
    data[key] = 140 + Math.floor(Math.random() * 80);
  }
  return data;
}

const eventTypeColors: Record<string, string> = {
  culto: 'var(--event-culto)',
  retiro: 'var(--event-retiro)',
  campamento: 'var(--event-campamento)',
  conferencia: 'var(--event-conferencia)',
  reunion: 'var(--event-reunion)',
  ayuno: 'var(--event-ayuno)',
  vigilia: 'var(--event-vigilia)',
  evangelismo: 'var(--event-evangelismo)',
  convencion: 'var(--event-convencion)',
  otro: 'var(--event-otro)',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return { day, month: months[d.getMonth()] };
}

function formatEventType(tipo: string) {
  const labels: Record<string, string> = {
    culto: 'Culto',
    retiro: 'Retiro',
    campamento: 'Campamento',
    conferencia: 'Conferencia',
    reunion: 'Reunión',
    ayuno: 'Ayuno',
    vigilia: 'Vigilia',
    evangelismo: 'Evangelismo',
    convencion: 'Convención',
    otro: 'Otro',
    asignacion: 'Asignación',
  };
  return labels[tipo] || tipo;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(demoData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          if (json.stats) setData(json);
        }
      } catch {
        // Use demo data silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const weeklyLabels = Object.keys(data.weeklyAttendance).map(key => {
    const d = new Date(key);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  });

  const weeklyValues = Object.values(data.weeklyAttendance);

  const chartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Asistencia Semanal',
        data: weeklyValues,
        borderColor: 'hsl(42, 65%, 55%)',
        backgroundColor: 'hsla(42, 65%, 55%, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(42, 65%, 55%)',
        pointBorderColor: 'hsl(230, 22%, 14%)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Demo comunicados for the dashboard
  const comunicadosRecientes = [
    { id: '1', titulo: 'Bienvenidos a INTRA - MPO', categoria: 'pastoral', autorNombre: 'Pastor Principal', createdAt: new Date().toISOString() },
    { id: '2', titulo: 'Próximo Culto Especial de Oración', categoria: 'evento', autorNombre: 'Liderazgo', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', titulo: 'Actualización de Horarios', categoria: 'administrativo', autorNombre: 'Administración', createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];

  return (
    <AppShell>
      <FadeIn>
        <EditableText id="dashboard.title" fallback="Dashboard" as="h1" className="font-display text-3xl font-bold text-gray-100 mb-2 tracking-tight" />
        <EditableText
          id="dashboard.subtitle"
          fallback="Bienvenido de vuelta. Aquí tienes un resumen de la iglesia."
          as="p"
          className="text-gray-400 text-[0.95rem] mb-8"
          multiline
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon="👥"
            label="Total Miembros"
            value={loading ? '...' : data.stats.totalMiembros}
            trend={{ value: '+12 este mes', direction: 'up' }}
            color="gold"
          />
          <StatsCard
            icon="📅"
            label="Eventos Activos"
            value={loading ? '...' : data.stats.eventosActivos}
            color="purple"
          />
          <StatsCard
            icon="📈"
            label="Asistencia Promedio"
            value={loading ? '...' : data.stats.asistenciaPromedio}
            trend={{ value: '+5% vs semana anterior', direction: 'up' }}
            color="green"
          />
          <StatsCard
            icon="⛪"
            label="Ministerios"
            value={loading ? '...' : data.stats.totalMinisterios}
            color="blue"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left: Attendance Chart */}
          <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <EditableText id="dashboard.chart.title" fallback="Asistencia Semanal" as="h2" className="font-display text-lg font-semibold text-gray-100" />
              <a href="/asistencia" className="text-[0.82rem] text-amber-500 font-medium hover:text-amber-400 transition-colors">Ver todo →</a>
            </div>
            <AttendanceChart
              type="line"
              data={chartData}
              height={260}
            />
          </div>

          {/* Right: Upcoming Events */}
          <div className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <EditableText id="dashboard.events.title" fallback="Próximos Eventos" as="h2" className="font-display text-lg font-semibold text-gray-100" />
              <a href="/calendario" className="text-[0.82rem] text-amber-500 font-medium hover:text-amber-400 transition-colors">Ver calendario →</a>
            </div>
            <StaggerContainer className="flex flex-col gap-3">
              {data.proximosEventos.map((evento) => {
                const { day, month } = formatDate(evento.fechaInicio);
                return (
                  <StaggerItem key={evento._id} className="flex items-center gap-4 p-4 bg-[#14161f] border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer">
                    <div
                      className="w-1 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: evento.color || eventTypeColors[evento.tipo] || '#673AB7' }}
                    />
                    <div className="text-center min-w-[48px] shrink-0">
                      <div className="font-display text-xl font-bold text-gray-100 leading-none">{day}</div>
                      <div className="text-[0.7rem] text-gray-400 uppercase tracking-wider">{month}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-100 truncate">{evento.nombre}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 truncate">
                        <span>{evento.departamento}</span>
                        {evento.ubicacion?.nombreLugar && (
                          <>
                            <span>•</span>
                            <span>{evento.ubicacion.nombreLugar}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 text-[0.7rem] font-bold rounded-md whitespace-nowrap"
                      style={{
                        backgroundColor: `${evento.color || eventTypeColors[evento.tipo] || '#673AB7'}20`,
                        color: evento.color || eventTypeColors[evento.tipo] || '#673AB7',
                      }}
                    >
                      {formatEventType(evento.tipo)}
                    </span>
                  </StaggerItem>
                );
              })}
              {data.proximosEventos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <div className="text-3xl mb-2">📅</div>
                  <div className="text-sm">Sin eventos próximos</div>
                </div>
              )}
            </StaggerContainer>
          </div>
        </div>

        {/* Announcements row */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <EditableText id="dashboard.comunicados.title" fallback="Comunicados Recientes" as="h2" className="font-display text-lg font-semibold text-gray-100" />
            <a href="/comunicados" className="text-[0.82rem] text-amber-500 font-medium hover:text-amber-400 transition-colors">Ver todos →</a>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comunicadosRecientes.map((c) => (
              <StaggerItem key={c.id} className="bg-[#1a1c25] border border-white/10 rounded-2xl p-6 transition-all hover:border-white/20 hover:shadow-lg hover:-translate-y-1">
                <span className={`inline-block px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wider rounded-md mb-3 ${c.categoria === 'pastoral' ? 'bg-amber-500/10 text-amber-500' :
                    c.categoria === 'evento' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-blue-500/10 text-blue-500'
                  }`}>
                  {c.categoria}
                </span>
                <div className="font-display text-lg font-bold text-gray-100 mb-4 line-clamp-2">{c.titulo}</div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400 font-medium">{c.autorNombre}</span>
                  <span className="text-[0.7rem] text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString('es-PA', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>
    </AppShell>
  );
}
