import React, { useState } from "react";
import { Search, Filter, Hash, BookOpen } from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input }  from "@components/ui/Input";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { TrueketecFilters as Filters, TurnoDeseado } from "../../types/trueketec.types";
import { cn } from "@/lib/utils";

interface Props { initialFilters: Filters; onApply: (f: Filters) => void; allowedDepts: string[]; }

const TURNOS: TurnoDeseado[] = ["Mañana", "Tarde", "Noche", "Cualquiera"];
const COMISION_REGEX = /^[A-Za-z]\d{4}$/;

export const TrueketecFiltersBar: React.FC<Props> = ({ initialFilters, onApply, allowedDepts }) => {
  const [mode, setMode]         = useState<"filtros" | "comision">("filtros");
  const [departamento, setDept] = useState(initialFilters.departamento ?? "");
  const [materia, setMateria]   = useState(initialFilters.materia ?? "");
  const [turno, setTurno]       = useState<TurnoDeseado | "">(initialFilters.turno_deseado ?? "");
  const [comision, setComision] = useState(initialFilters.comision ?? "");
  const [error, setError]       = useState("");

  const canSearch = mode === "comision" ? comision.length >= 2 : !!(departamento && materia && turno);

  const validate = (): string | null => {
    if (mode === "comision") return comision.length < 2 ? "Requiere 2 caracteres mínimo." : null;
    if (!departamento || !materia.trim() || !turno) return "Parámetros incompletos.";
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
  const turnoOptions = TURNOS.map(t => ({ value: t, label: t }));

  return (
    <div className="flex flex-col gap-4 bg-itec-box rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-itec-bg pb-3">
        <div className="flex items-center gap-2 text-white">
          <div className="p-1.5 bg-itec-surface rounded border border-transparent"><Filter size={14} className="text-itec-blue-skye" /></div>
          <span className="text-sm font-bold">Filtros de Búsqueda</span>
        </div>
        <div className="flex rounded-lg bg-itec-surface p-1">
          <button onClick={() => { setMode("filtros"); setError(""); }} className={cn("px-4 py-1.5 text-[11px] font-bold transition-all rounded-md", mode === "filtros" ? "bg-itec-box text-white" : "text-itec-muted hover:text-white")}>
            <BookOpen size={12} className="inline mr-1.5 mb-0.5" /> Materia
          </button>
          <button onClick={() => { setMode("comision"); setError(""); }} className={cn("px-4 py-1.5 text-[11px] font-bold transition-all rounded-md", mode === "comision" ? "bg-itec-box text-white" : "text-itec-muted hover:text-white")}>
            <Hash size={12} className="inline mr-1.5 mb-0.5" /> Comisión
          </button>
        </div>
      </div>

      <div className="bg-itec-surface p-4 rounded-xl">
        {mode === "filtros" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <CustomSelect value={departamento} onChange={setDept} options={deptOptions} placeholder="Departamento" className="w-full bg-itec-box border-transparent py-2.5 text-sm rounded-lg" />
            <div className="md:col-span-2">
              <Input placeholder="Nombre de la materia..." value={materia} onChange={(e) => setMateria(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} fullWidth className="w-full bg-itec-box border-transparent rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <CustomSelect value={turno} onChange={(val) => setTurno(val as TurnoDeseado | "")} options={turnoOptions} placeholder="Turno" className="w-full bg-itec-box border-transparent py-2.5 text-sm rounded-lg" />
          </div>
        ) : (
          <div className="relative w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-itec-muted" />
            <Input placeholder="Ej: K1094" value={comision} onChange={(e) => setComision(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && apply()} fullWidth className="w-full bg-itec-box border-transparent rounded-lg pl-11 pr-4 py-3 font-mono text-sm" />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[10px] text-itec-muted font-medium bg-itec-surface px-3 py-1.5 rounded-lg w-max">
          {error ? <span className="text-itec-red">{error}</span> : mode === "filtros" ? "Exclusivo materias de tu carrera y homogéneas." : "Formato estándar: Letra + 4 números."}
        </span>
        <div className="flex gap-2">
          <Button variant="slate" hierarchy="ghost" text="Restablecer" onClick={clear} className="text-xs bg-itec-surface rounded-lg" />
          <Button variant="primary" hierarchy="solid" text="Aplicar" onClick={apply} disabled={!canSearch} className="px-6 py-2 text-xs rounded-lg bg-itec-blue-skye text-black font-bold hover:bg-itec-blue" />
        </div>
      </div>
    </div>
  );
};
