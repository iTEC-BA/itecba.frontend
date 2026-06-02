// GradePlanSection.tsx — Botonera por año + modal de materias (<100 líneas)
import React, { useState } from 'react';
import type { AnioEstudios } from '../../types/grade.types';
import { GradeYearButton }  from '../atoms/GradeYearButton';
import { GradeAnioModal }   from '../molecules/GradeAnioModal';

interface Props {
  plan: AnioEstudios[];
  byCode?: Record<string, string>;
  loadingDB?: boolean;
}

export const GradePlanSection: React.FC<Props> = ({ plan, byCode = {}, loadingDB = false }) => {
  const [openAnio, setOpenAnio] = useState<AnioEstudios | null>(null);

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-1 h-6 bg-itec-blue-skye rounded-full" />
        <h2 className="text-base font-bold text-itec-text">Plan de Estudios</h2>
        {loadingDB && (
          <span className="text-[10px] text-itec-description animate-pulse">cargando materias…</span>
        )}
      </div>
      <p className="text-xs text-itec-description mb-4">
        Hacé clic en cada año para ver el listado de materias y sus correlativas.
        {' '}Los años con <span className="text-itec-blue-skye font-medium">▶</span> incluyen un video introductorio.
      </p>
      <div className="flex flex-wrap gap-2">
        {plan.map(anio => (
          <GradeYearButton
            key={anio.anio}
            label={anio.label}
            hasVideo={!!anio.videoUrl}
            isActive={openAnio?.anio === anio.anio}
            onClick={() => setOpenAnio(anio)}
          />
        ))}
      </div>
      {openAnio && (
        <GradeAnioModal
          anio={openAnio}
          onClose={() => setOpenAnio(null)}
          byCode={byCode}
        />
      )}
    </section>
  );
};
