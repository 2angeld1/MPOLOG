'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Premium chart theme defaults
ChartJS.defaults.color = 'hsl(230, 15%, 65%)';
ChartJS.defaults.borderColor = 'hsla(230, 20%, 40%, 0.12)';
ChartJS.defaults.font.family = "'Inter', sans-serif";

interface AttendanceChartProps {
  type: 'line' | 'bar';
  data: ChartData<'line' | 'bar'>;
  title?: string;
  height?: number;
}

export default function AttendanceChart({ type, data, title, height = 300 }: AttendanceChartProps) {
  const chartRef = useRef(null);

  const baseOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 11, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: 'hsl(230, 22%, 14%)',
        titleColor: 'hsl(40, 20%, 95%)',
        bodyColor: 'hsl(230, 15%, 75%)',
        borderColor: 'hsla(230, 20%, 40%, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 13, weight: 600 },
        bodyFont: { size: 12 },
      },
      title: title ? {
        display: true,
        text: title,
        font: { size: 14, weight: 600, family: "'Outfit', sans-serif" },
        color: 'hsl(40, 20%, 95%)',
        padding: { bottom: 16 },
      } : { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        grid: {
          color: 'hsla(230, 20%, 40%, 0.08)',
        },
        ticks: { font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        // cleanup on unmount
      }
    };
  }, []);

  return (
    <div className="chart-wrapper" style={{ height }}>
      {type === 'line' ? (
        <Line ref={chartRef} data={data as ChartData<'line'>} options={baseOptions as ChartOptions<'line'>} />
      ) : (
        <Bar ref={chartRef} data={data as ChartData<'bar'>} options={baseOptions as ChartOptions<'bar'>} />
      )}
    </div>
  );
}
