import React, { useState } from 'react';
import { Icons } from '@/components/ui/icons/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LayoutModal } from '@/components/templates/LayoutModal';
import type { AdmissionEvent } from '../../hooks/useAdmissionDates';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  events: AdmissionEvent[];
  onAdd: (event: Omit<AdmissionEvent, 'id'>) => Promise<boolean>;
  onDelete: (id: string) => void;
}

export const AdminAdmissionDatesModal: React.FC<Props> = ({ isOpen, onClose, events, onAdd, onDelete }) => {
  const [eventName, setEventName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !targetDate) return;
    setIsSubmitting(true);
    const success = await onAdd({ eventName, targetDate });
    if (success) {
      setEventName('');
      setTargetDate('');
    }
    setIsSubmitting(false);
  };

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Fechas de Ingreso" description="Gestiona los eventos para el reloj de cuenta regresiva." maxWidth="max-w-md">
      <div className="p-5">
        <div className="mb-6 max-h-40 overflow-y-auto custom-scrollbar space-y-2 pr-2">
          {events.length === 0 ? (
            <p className="text-xs text-itec-gray text-center py-4 bg-white/5 rounded-xl border border-white/10">No hay eventos guardados.</p>
          ) : (
            events.map(ev => (
              <div key={ev.id} className="bg-itec-bg border border-white/10 p-3 rounded-xl flex justify-between items-center shadow-md hover:border-purple-500/50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-white">{ev.eventName}</p>
                  <p className="text-[10px] text-purple-400">{new Date(ev.targetDate).toLocaleString()}</p>
                </div>
                <button onClick={() => onDelete(ev.id!)} className="text-red-400 hover:text-red-300 p-2 transition-colors cursor-pointer">
                  <Icons type="close" className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleAdd} className="bg-itec-bg/50 p-4 rounded-xl border border-white/10">
          <h4 className="text-xs font-bold text-purple-400 mb-3">Nuevo Evento</h4>
          <div className="space-y-3">
            <Input placeholder="Ej: Primer Parcial" value={eventName} onChange={e => setEventName(e.target.value)} fullWidth className="text-sm py-2" />
            <input type="datetime-local" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full bg-itec-box border border-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-purple-500 text-sm transition-colors" />
            <Button type="submit" variant="purple" hierarchy="solid" fullWidth isLoading={isSubmitting} disabled={!eventName || !targetDate}>Agregar Evento</Button>
          </div>
        </form>
      </div>
    </LayoutModal>
  );
};
