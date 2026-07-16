'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { FiDownload, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  formulario: any | null;
}

export default function ResponsesModal({ isOpen, onClose, formulario }: ResponsesModalProps) {
  const [respuestas, setRespuestas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !formulario?._id) return;
    setLoading(true);
    fetch(`/api/formularios/${formulario._id}/respuestas`)
      .then(res => res.json())
      .then(data => setRespuestas(data || []))
      .catch(err => {
        console.error(err);
        toast.error('Error al cargar respuestas');
      })
      .finally(() => setLoading(false));
  }, [isOpen, formulario]);

  if (!formulario) return null;

  const campos = Array.isArray(formulario.campos) ? formulario.campos : [];

  const handleExportCSV = () => {
    if (respuestas.length === 0) {
      toast.error('No hay respuestas para exportar');
      return;
    }

    // Encabezados
    const headers = ['Fecha de Envío', ...campos.map(c => c.label)];
    
    // Contenido
    const rows = respuestas.map(r => {
      const fecha = new Date(r.createdAt).toLocaleString();
      const valores = campos.map(c => {
        const val = r.respuestas[c.label] || '';
        // Escapar comillas en campos de texto
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return [fecha, ...valores].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // \uFEFF for Excel UTF-8 compliance
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `respuestas_${formulario.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Respuestas: ${formulario.titulo}`}
      subtitle={`${respuestas.length} envíos registrados`}
      maxWidth="max-w-6xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-gray-500 font-medium">Puedes exportar los datos a formato de tabla.</span>
          <div className="flex gap-2">
            <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={onClose}>Cerrar</button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              disabled={respuestas.length === 0}
            >
              <FiDownload size={16} /> Exportar CSV
            </button>
          </div>
        </div>
      }
    >
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : respuestas.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <FiFileText className="text-4xl mb-4" />
            <div className="font-display text-lg font-semibold mb-1">Sin respuestas</div>
            <div className="text-sm text-center">Nadie ha enviado respuestas a este formulario todavía.</div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-xl max-h-[400px]">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#14161f] text-gray-300 font-semibold border-b border-white/10 sticky top-0 z-10">
                <tr>
                  <th className="p-4 whitespace-nowrap min-w-[150px]">Fecha de Envío</th>
                  {campos.map(campo => (
                    <th key={campo.id} className="p-4 whitespace-nowrap min-w-[150px]">{campo.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {respuestas.map(r => (
                  <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-gray-400 text-xs">
                      {new Date(r.createdAt).toLocaleString('es-MX')}
                    </td>
                    {campos.map(campo => (
                      <td key={campo.id} className="p-4 truncate max-w-[250px]" title={r.respuestas[campo.label] || ''}>
                        {r.respuestas[campo.label] !== undefined ? String(r.respuestas[campo.label]) : <span className="text-gray-600">-</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}
