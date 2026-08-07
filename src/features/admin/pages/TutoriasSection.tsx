// src/features/admin/components/organisms/TutoriasSection.tsx
// Módulo de gestión de tutorías — pendiente de integración con el backend.
import React from "react";
import { Card } from "@components/atoms/Card";
import { Icons } from "@components/ui/icons/Icons";

export const TutoriasSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Módulo</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-itec-text font-display">
          Tutorías
        </h2>
        <p className="text-xs text-itec-muted mt-1">
          Sesiones personalizadas entre tutores y alumnos de la UTN.
        </p>
      </div>

      {/* Estado: Próximamente */}
      <Card className="flex min-h-[360px] flex-col items-center justify-center gap-4 p-10 text-center shadow-lg">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted">
          <Icons type="clock" className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
            Próximamente
          </p>
          <h3 className="text-lg font-bold text-itec-text">
            La gestión de tutorías está en camino
          </h3>
          <p className="max-w-sm text-sm text-itec-muted leading-relaxed">
            Estamos trabajando en este módulo para que puedas coordinar,
            confirmar y dar seguimiento a las tutorías directamente desde
            el panel. Estará disponible en una próxima actualización.
          </p>
        </div>
      </Card>
    </div>
  );
};
