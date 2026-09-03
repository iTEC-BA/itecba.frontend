import React, { useState } from "react";
import { Search, ListFilter, Hash, BookOpen } from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { TrueketecFilters as Filters, TurnoDeseado } from "../../types/trueketec.types";
import { TURNOS_DESEADOS, MENSAJES } from "../../data";
import { cn } from "@/lib/utils";

interface Props {
  initialFilters: Filters;
  onApply: (f: Filters) => void;
  allowedDepts: string[];
  materiaOptions: string[];
}

export const TrueketecFiltersBar: React.FC<Props> = ({ initialFilters, onApply, allowedDepts, materiaOptions }) => {
  const [mode, setMode]         = useState<"filtros" | "comision">("filtros");
  const [departamento, setDept] = useState(initialFilters.departamento ?? "");
  const [materia, setMateria]   = useState(initialFilters.materia ?? "");
  const [turno, setTurno]       = useState<TurnoDeseado | "">(initialFilters.turno_deseado ?? "");
  const [comision, setComision] = useState(initialFilters.comision ?? "");
  const [error, setError]       = useState("");

  const canSearch = mode === "comision" ? comision.length >= 2 : !!(departamento && materia && turno);

  const validate = (): string | null => {
    if (mode === "comision") return comision.length < 2 ? MENSAJES.comisionCorta : null;
    if (!departamento || !materia.trim() || !turno) return MENSAJES.filtrosIncompletos;
    return null;
  };

  const apply = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    if (mode === "comision") onApply({ comision: comision.trim().toUpperCase() });
    else onApply({ departamento, materia: materia.trim(), turno_deseado: turno });
  };

  const clear = () => {
    setDept(""); setMateria(""); setTurno(""); setComision(""); setError("");
    onApply({});
  };

  const deptOptions = allowedDepts.map(d => ({ value: d, label: d }));
  const turnoOptions = TURNOS_DESEADOS.map(t => ({ value: t, label: t }));
  const materiaSelectOptions = materiaOptions.map(m => ({ value: m, label: m }));

  return (
    <div className="flex flex-col rounded-xl border border-itec-section-trueketec/10 p-4">

      {/* ── Encabezado + Toggle de modo ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white">
          <div className="p-1.5 bg-itec-section-trueketec/10 rounded-lg border border-itec-section-trueketec/30">
            <ListFilter size={14} className="text-itec-section-trueketec" />
          </div>
          <span className="text-sm font-bold">Buscar en el Directorio</span>
        </div>
        <div className="flex rounded-lg bg-itec-surface p-1 border border-itec-border w-full sm:w-auto">
          <button
            onClick={() => { setMode("filtros"); setError(""); }}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-[11px] font-bold transition-colors rounded-md",
              mode === "filtros" ? "bg-itec-section-trueketec text-white" : "text-itec-muted hover:text-white"
            )}
          >
            <BookOpen size={12} /> Por Materia
          </button>
          <button
            onClick={() => { setMode("comision"); setError(""); }}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-[11px] font-bold transition-colors rounded-md",
              mode === "comision" ? "bg-itec-section-trueketec text-white" : "text-itec-muted hover:text-white"
            )}
          >
            <Hash size={12} /> Por Comisión
          </button>
        </div>
      </div>

      {/* ── Campos del modo activo ── */}
      <div className="px-5 py-5 flex flex-col gap-4">
        {mode === "filtros" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-itec-muted px-1">Departamento</label>
              <CustomSelect value={departamento} onChange={setDept} options={deptOptions} placeholder="Elegir" className="w-full bg-itec-surface border-itec-border py-2.5 text-sm rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-itec-muted px-1">Materia (tu carrera)</label>
              <CustomSelect
                value={materia}
                onChange={setMateria}
                options={materiaSelectOptions}
                placeholder={materiaSelectOptions.length ? "Elegir materia" : "Sin materias disponibles"}
                disabled={materiaSelectOptions.length === 0}
                className="w-full bg-itec-surface border-itec-border py-2.5 text-sm rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-itec-muted px-1">Turno</label>
              <CustomSelect value={turno} onChange={(val) => setTurno(val as TurnoDeseado | "")} options={turnoOptions} placeholder="Elegir" className="w-full bg-itec-surface border-itec-border py-2.5 text-sm rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-itec-muted px-1">Código de comisión</label>
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-itec-muted" />
              <Input placeholder="Ej: K1094" value={comision} onChange={(e) => setComision(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && apply()} fullWidth className="w-full bg-itec-surface border-itec-border rounded-lg pl-11 pr-4 py-3 font-mono text-sm" />
            </div>
          </div>
        )}

        {/* ── Ayuda contextual + acciones, siempre en la misma línea visual ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[10px] font-medium text-itec-muted">
            {error ? <span className="text-itec-red font-bold">{error}</span> : mode === "filtros" ? MENSAJES.ayudaFiltros : MENSAJES.ayudaComision}
          </span>
          <div className="flex gap-2 shrink-0">
            <Button variant="slate" hierarchy="ghost" text="Restablecer" onClick={clear} className="text-xs bg-itec-surface border border-itec-border rounded-lg" />
            <Button variant="primary" hierarchy="solid" text="Buscar" icon={<Search size={12} />} onClick={apply} disabled={!canSearch} className="px-6 py-2 text-xs rounded-lg bg-itec-section-trueketec text-white font-bold hover:bg-itec-section-trueketec/80" />
          </div>
        </div>
      </div>
    </div>
  );
};
