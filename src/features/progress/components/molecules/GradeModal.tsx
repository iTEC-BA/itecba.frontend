// src/features/progress/components/molecules/GradeModal.tsx
// Usa LayoutModal (componente global) en lugar de un modal hecho a mano.
// Usa Input (componente global) en lugar de <input> HTML crudo.
// Usa Button (componente global) en lugar de <button> HTML crudo.
import React, { useState } from 'react';
import { LayoutModal }     from '@components/templates/LayoutModal';
import { Button }          from '@components/ui/Button';
import { Input }           from '@components/ui/Input';

interface Props {
  subject:      { id: string; name: string };
  targetStatus: 'aprobada' | 'regular' | 'promocionada';
  onClose:      () => void;
  onConfirm:    (id: string, status: string, grade?: number, year?: number) => void;
}

const TITLE_MAP = {
  aprobada:     'Aprobar Final',
  promocionada: 'Promocioné ✦ (exento de final)',
  regular:      'Regularizar Materia',
} as const;

export const GradeModal: React.FC<Props> = ({
  subject,
  targetStatus,
  onClose,
  onConfirm,
}) => {
  const isPromo   = targetStatus === 'promocionada';
  const needsGrade = targetStatus === 'aprobada' || isPromo;
  const minGrade   = isPromo ? 6 : 1;

  const [grade, setGrade] = useState<number | ''>(isPromo ? 8 : '');
  const [year,  setYear]  = useState<number>(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(
      subject.id,
      targetStatus,
      needsGrade ? Number(grade) : undefined,
      year
    );
  };

  return (
    <LayoutModal
      isOpen
      onClose={onClose}
      title={TITLE_MAP[targetStatus]}
      description={subject.name}
      maxWidth="max-w-sm"
    >
      <div className="px-6 py-5">
        {isPromo && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
            ✦ La promoción{' '}
            <strong>desbloquea las correlativas</strong> y{' '}
            <strong>cuenta como final aprobado</strong> — no necesitás rendir.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {needsGrade && (
              <div className="flex-1">
                <label className="block text-xs font-bold text-itec-text mb-1">
                  Nota Final {isPromo ? '(mín. 6)' : ''}
                </label>
                <Input
                  type="number"
                  min={minGrade}
                  max={10}
                  required
                  fullWidth
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  placeholder={`Ej: ${isPromo ? '8' : '7'}`}
                  className="bg-itec-bg border border-itec-gray rounded-lg px-3 py-2 outline-none focus:border-itec-blue"
                />
              </div>
            )}
            <div className="flex-1">
              <label className="block text-xs font-bold text-itec-text mb-1">
                Año de Cursada
              </label>
              <Input
                type="number"
                min={1990}
                max={new Date().getFullYear() + 1}
                required
                fullWidth
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-itec-bg border border-itec-gray rounded-lg px-3 py-2 outline-none focus:border-itec-blue"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="slate"
              hierarchy="ghost"
              onClick={onClose}
              type="button"
              text="Cancelar"
            />
            <Button
              variant={isPromo ? 'success' : 'primary'}
              type="submit"
              text={isPromo ? '✦ Confirmar Promoción' : 'Guardar'}
            />
          </div>
        </form>
      </div>
    </LayoutModal>
  );
};
