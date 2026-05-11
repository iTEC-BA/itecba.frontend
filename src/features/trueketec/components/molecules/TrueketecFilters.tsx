// src/features/trueketec/components/molecules/TrueketecFilters.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import type { TrueketecFilters as Filters, TurnoDeseado } from "../../types/trueketec.types";

interface Props {
  initialFilters: Filters;
  onApply: (f: Filters) => void;
}

const TURNOS: TurnoDeseado[] = ["Mañana", "Tarde", "Noche", "Cualquiera"];

export const TrueketecFiltersBar: React.FC<Props> = ({ initialFilters, onApply }) => {
  const [materia,         setMateria]        = useState(initialFilters.materia ?? "");
  const [turno_deseado,   setTurnoDeseado]   = useState<TurnoDeseado | "">(initialFilters.turno_deseado ?? "");
  const [comision_actual, setComisionActual] = useState(initialFilters.comision_actual ?? "");

  const hasActiveFilters = !!(materia || turno_deseado || comision_actual);

  const apply = () => onApply({
    materia:         materia || undefined,
    turno_deseado:   turno_deseado || undefined,
    comision_actual: comision_actual || undefined,
  });

  const clear = () => {
    setMateria(""); setTurnoDeseado(""); setComisionActual("");
    onApply({});
  };

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-itec-border bg-itec-box p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-itec-muted">Filtrar búsquedas</p>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Materia */}
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-itec-muted pointer-events-none" />
          <Input
            placeholder="Ej: Análisis Matemático II"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            fullWidth
            className="pl-8 pr-3 py-2.5 text-sm rounded-2xl bg-itec-surface border border-itec-border focus:border-itec-sky"
          />
        </div>

        {/* Comisión actual */}
        <Input
          placeholder="Comisión (ej: K1021)"
          value={comision_actual}
          onChange={(e) => setComisionActual(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="w-full sm:w-36 px-3 py-2.5 text-sm rounded-2xl bg-itec-surface border border-itec-border focus:border-itec-sky font-mono"
        />

        {/* Turno deseado */}
        <select
          value={turno_deseado}
          onChange={(e) => setTurnoDeseado(e.target.value as TurnoDeseado | "")}
          className="w-full sm:w-36 rounded-2xl bg-itec-surface border border-itec-border px-3 py-2.5 text-sm text-itec-text outline-none focus:border-itec-sky"
        >
          <option value="">Turno deseado</option>
          {TURNOS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          hierarchy="solid"
          text="Buscar"
          onClick={apply}
          className="rounded-2xl py-2 text-sm px-5"
        />
        {hasActiveFilters && (
          <Button
            variant="secondary"
            hierarchy="ghost"
            text="Limpiar"
            onClick={clear}
            className="rounded-2xl py-2 text-sm"
          />
        )}
      </div>
    </div>
  );
};
