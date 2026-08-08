import React, { useState } from "react";
import { Search, SlidersHorizontal, Layers, Hash } from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input }  from "@components/ui/Input";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { TrueketecFilters as Filters, TurnoDeseado } from "../../types/trueketec.types";
import { cn } from "@/lib/utils";

interface Props {
  initialFilters: Filters;
  onApply:        (f: Filters) => void;
}

const DEPARTAMENTOS = ["Ciencias Básicas", "Civil", "Eléctrica", "Electrónica", "Industrial", "Mecánica", "Naval", "Sistemas de Información", "Química", "Textil", "Curso de Ingreso"];
const TURNOS: TurnoDeseado[] = ["Mañana", "Tarde", "Noche", "Cualquiera"];
const COMISION_REGEX = /^[A-Za-z]\d{4}$/;

export const TrueketecFiltersBar: React.FC<Props> = ({ initialFilters, onApply }) => {
  const [mode, setMode]             = useState<"filtros" | "comision">("filtros");
  const [departamento, setDept]     = useState(initialFilters.departamento ?? "");
  const [materia, setMateria]       = useState(initialFilters.materia ?? "");
  const [turno, setTurno]           = useState<TurnoDeseado | "">(initialFilters.turno_deseado ?? "");
  const [comision, setComision]     = useState(initialFilters.comision ?? "");
  const [error, setError]           = useState("");

  const canSearch = mode === "comision" ? comision.length >= 2 : !!(departamento && materia && turno);

  const validate = (): string | null => {
    if (mode === "comision") {
      if (comision.length < 2) return "Ingresá al menos 2 caracteres del código.";
      return null;
    }
    if (!departamento) return "Seleccioná un Departamento.";
    if (!materia.trim()) return "Escribí el nombre de la Materia.";
    if (!turno) return "Seleccioná un Turno deseado.";
    return null;
  };

  const apply = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    if (mode === "comision") {
      onApply({ comision: comision.trim().toUpperCase() });
    } else {
      onApply({ departamento, materia: materia.trim(), turno_deseado: turno });
    }
  };

  const clear = () => {
    setDept(""); setMateria(""); setTurno(""); setComision(""); setError("");
    onApply({});
  };

  // Convertimos los arrays a la estructura que requiere CustomSelect
  const deptOptions = DEPARTAMENTOS.map(d => ({ value: d, label: d }));
  const turnoOptions = TURNOS.map(t => ({ value: t, label: t }));

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      {/* ── Segmented Control ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-white/40 shrink-0" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Modo de búsqueda</p>
        </div>
        <div className="flex w-full sm:w-auto rounded-xl border border-white/10 bg-black/20 p-1">
          <button onClick={() => { setMode("filtros"); setError(""); }} className={cn("flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all", mode === "filtros" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80")}>
            <Layers size={14} /> Carrera
          </button>
          <button onClick={() => { setMode("comision"); setError(""); }} className={cn("flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all", mode === "comision" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80")}>
            <Hash size={14} /> Comisión
          </button>
        </div>
      </div>

      {/* ── Modo: Filtros ── */}
      {mode === "filtros" && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <CustomSelect 
            value={departamento} 
            onChange={setDept} 
            options={deptOptions} 
            placeholder="Departamento *" 
            className="w-full bg-white/5 border-white/10 py-3 px-4 text-sm text-white focus:border-white/30" 
          />
          <div className="sm:col-span-2">
            <Input placeholder="Nombre exacto de la materia *" value={materia} onChange={(e) => setMateria(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} fullWidth className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/30" />
          </div>
          <CustomSelect 
            value={turno} 
            onChange={(val) => setTurno(val as TurnoDeseado | "")} 
            options={turnoOptions} 
            placeholder="Turno deseado *" 
            className="w-full bg-white/5 border-white/10 py-3 px-4 text-sm text-white focus:border-white/30" 
          />
        </div>
      )}

      {/* ── Modo: Comisión ── */}
      {mode === "comision" && (
        <div className="flex flex-col gap-2 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <Input placeholder="Ej: K1094, Z1051, A2003..." value={comision} onChange={(e) => setComision(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && apply()} fullWidth className="w-full rounded-md border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors font-mono placeholder:text-white/30 placeholder:font-sans" />
          </div>
        </div>
      )}

      {/* ── Acciones ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-[10px] text-white/40">
          {mode === "filtros" ? "* Los tres campos son obligatorios." : (COMISION_REGEX.test(comision) ? <span className="text-itec-emerald">✓ Formato de comisión válido</span> : "Ingresá 1 letra y 4 números.")}
        </p>
        <div className="flex items-center gap-3">
          {error && <span className="text-[10px] font-bold text-itec-red uppercase tracking-widest">{error}</span>}
          <Button variant="slate" hierarchy="ghost" text="Limpiar" onClick={clear} className="text-xs" />
          <Button variant="primary" hierarchy="solid" text="Buscar" onClick={apply} disabled={!canSearch} className="px-6 py-2.5 text-xs rounded-xl" />
        </div>
      </div>
    </div>
  );
};
