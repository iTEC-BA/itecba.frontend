import React, { useState } from 'react';
import { Icons } from '@/components/atoms/Icons';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-500 hover:text-white">
          <Icons type="close" className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Fechas de Ingreso</h2>
        <p className="text-xs text-gray-400 mb-6">Agrega los eventos para el reloj de cuenta regresiva.</p>

        {/* Lista de Eventos Actuales */}
        <div className="mb-6 max-h-40 overflow-y-auto custom-scrollbar space-y-2 pr-2">
          {events.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No hay eventos guardados.</p>
          ) : (
            events.map(ev => (
              <div key={ev.id} className="bg-itec-bg border border-itec-gray p-3 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-white">{ev.eventName}</p>
                  <p className="text-[10px] text-gray-400">{new Date(ev.targetDate).toLocaleString()}</p>
                </div>
                <button onClick={() => onDelete(ev.id!)} className="text-red-500 hover:text-red-400 p-2">
                  <Icons type="close" className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Formulario para Nuevo Evento */}
        <form onSubmit={handleAdd} className="bg-itec-bg p-4 rounded-2xl border border-itec-gray">
          <h4 className="text-xs font-bold text-purple-400 mb-3">Nuevo Evento</h4>
          <div className="space-y-3">
            <Input 
              placeholder="Ej: Primer Parcial" 
              value={eventName} 
              onChange={e => setEventName(e.target.value)} 
              fullWidth 
              className="text-sm py-2"
            />
            {/* Input nativo de fecha y hora */}
            <input 
              type="datetime-local" 
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full bg-itec-surface border border-itec-gray text-white px-4 py-2 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || !eventName || !targetDate} 
              className="w-full bg-purple-600 hover:bg-purple-500 border-none text-white text-sm py-2"
            >
              {isSubmitting ? 'Guardando...' : 'Agregar Evento'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};