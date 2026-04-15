import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import type { CalculatedSubject } from '../../hooks/useProgress';

interface Props {
  subject: CalculatedSubject;
  targetStatus: 'aprobada' | 'regular';
  onClose: () => void;
  onConfirm: (id: string, status: string, grade?: number, year?: number) => void;
}

export const GradeModal: React.FC<Props> = ({ subject, targetStatus, onClose, onConfirm }) => {
  const [grade, setGrade] = useState<number | ''>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const isAprobada = targetStatus === 'aprobada';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(subject.id, targetStatus, isAprobada ? Number(grade) : undefined, year);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-1">
          {isAprobada ? 'Aprobar / Promocionar' : 'Regularizar Materia'}
        </h3>
        <p className="text-sm text-gray-400 mb-6">{subject.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {/* Solo mostramos la nota si la va a Aprobar/Promocionar */}
            {isAprobada && (
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 mb-1">Nota Final</label>
                <input 
                  type="number" min="1" max="10" required
                  value={grade} onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full bg-itec-bg border border-itec-gray rounded-lg px-3 py-2 text-white outline-none focus:border-itec-blue"
                  placeholder="Ej: 8"
                />
              </div>
            )}
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 mb-1">Año de Cursada</label>
              <input 
                type="number" min="1990" max="2030" required
                value={year} onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-itec-bg border border-itec-gray rounded-lg px-3 py-2 text-white outline-none focus:border-itec-blue"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};