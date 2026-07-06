'use client';

import Modal from '@/components/Modal';

interface MiembroFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode: boolean;
  submitting: boolean;
  formData: {
    id: string; nombre: string; edad: string; telefono: string;
    tiempoIglesia: string; esServidor: boolean; dondeSirve: string; parentesco: string;
  };
  setFormData: (data: any) => void;
  setFoto: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  ministerios: Array<{ id: string; nombre: string }>;
}

export default function MiembroFormModal({
  isOpen, onClose, editMode, submitting, formData, setFormData, setFoto, onSubmit, ministerios
}: MiembroFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}
      maxWidth="max-w-lg"
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className="px-5 py-2.5 rounded-lg font-semibold text-gray-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10" onClick={onClose}>Cancelar</button>
          <button type="submit" form="miembro-form" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed" disabled={submitting}>{submitting ? 'Guardando...' : 'Guardar'}</button>
        </div>
      }
    >
      <form id="miembro-form" onSubmit={onSubmit} className="p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Nombre Completo</label>
          <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Edad</label>
            <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" type="number" required value={formData.edad} onChange={e => setFormData({ ...formData, edad: e.target.value })} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Teléfono</label>
            <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" required value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Tiempo en la iglesia</label>
          <select className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 appearance-none" value={formData.tiempoIglesia} onChange={e => setFormData({ ...formData, tiempoIglesia: e.target.value })}>
            <option value="Menos de 1 año">Menos de 1 año</option>
            <option value="1 a 3 años">1 a 3 años</option>
            <option value="3 a 5 años">3 a 5 años</option>
            <option value="Más de 5 años">Más de 5 años</option>
          </select>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-lg">
          <input type="checkbox" id="esServidor" checked={formData.esServidor} onChange={e => setFormData({ ...formData, esServidor: e.target.checked })} className="w-5 h-5 accent-amber-500 rounded bg-[#14161f] border-white/20" />
          <label htmlFor="esServidor" className="text-sm font-medium text-gray-200 cursor-pointer">¿Es Servidor/Voluntario?</label>
        </div>
        {formData.esServidor && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">¿En qué áreas sirve?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {ministerios.map(m => {
                const servesHere = formData.dondeSirve.split(',').map(s => s.trim()).includes(m.nombre);
                
                return (
                  <label key={m.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${servesHere ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#14161f] border-white/5 hover:border-white/10'}`}>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-amber-500 rounded bg-[#14161f] border-white/20"
                      checked={servesHere}
                      onChange={(e) => {
                        let areas = formData.dondeSirve ? formData.dondeSirve.split(',').map(s => s.trim()).filter(s => s) : [];
                        if (e.target.checked) {
                          areas.push(m.nombre);
                        } else {
                          areas = areas.filter(a => a !== m.nombre);
                        }
                        setFormData({ ...formData, dondeSirve: areas.join(', ') });
                      }}
                    />
                    <span className={`text-xs font-medium ${servesHere ? 'text-amber-500' : 'text-gray-300'}`}>{m.nombre}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Familia / Parentesco (Opcional)</label>
          <input className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50" value={formData.parentesco} onChange={e => setFormData({ ...formData, parentesco: e.target.value })} placeholder="Ej. Esposo de María, asiste con 2 hijos" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Foto de perfil (Opcional)</label>
          <input type="file" accept="image/*" className="w-full bg-[#14161f] border border-white/10 text-gray-400 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 transition-colors" onChange={e => setFoto(e.target.files ? e.target.files[0] : null)} />
        </div>
      </form>
    </Modal>
  );
}
