// src/features/trueketec/components/molecules/TrueketecFilters.tsx
// Lógica restrictiva:
//   - Por comisión exacta (ej: K1094): habilitado con 2+ chars
//   - Por filtros: requiere Departamento + Materia + Turno completos
import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input }  from "@components/ui/Input";
import type { TrueketecFilters as Filters, TurnoDeseado } from "../../types/trueketec.types";

interface Props {
  initialFilters: Filters;
  onApply:        (f: Filters) => void;
}

const DEPARTAMENTOS = [
  "Ciencias Básicas", "Civil", "Eléctrica", "Electrónica",
  "Industrial", "Mecánica", "Naval", "Sistemas de Información",
  "Química", "Textil", "Curso de Ingreso",
];

const TURNOS: TurnoDeseado[] = ["Mañana", "Tarde", "Noche", "Cualquiera"];

// Patrón de comisión: 1 letra + 4 dígitos (ej: K1094, Z1051, A2003)
const COMISION_REGEX = /^[A-Za-z]\d{4}$/;

export const TrueketecFiltersBar: React.FC<Props> = ({ initialFilters, onApply }) => {
  const [mode, setMode]             = useState<"filtros" | "comision">("filtros");
  const [departamento, setDept]     = useState(initialFilters.departamento ?? "");
  const [materia, setMateria]       = useState(initialFilters.materia ?? "");
  const [turno, setTurno]           = useState<TurnoDeseado | "">(initialFilters.turno_deseado ?? "");
  const [comision, setComision]     = useState(initialFilters.comision ?? "");
  const [error, setError]           = useState("");

  // ── Validación según modo ────────────────────────────────────────────────
  const canSearch = mode === "comision"
    ? comision.length >= 2
    : !!(departamento && materia && turno);

  const validate = (): string | null => {
    if (mode === "comision") {
      if (comision.length < 2) return "Ingresá al menos 2 caracteres del código de comisión.";
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

  const selectCls = "w-full rounded-xl bg-itec-surface border border-itec-border px-3 py-2.5 text-sm text-itec-text outline-none focus:border-itec-sky transition-colors";
  const inputCls  = "w-full px-3 py-2.5 text-sm rounded-xl bg-itec-surface border border-itec-border text-itec-text outline-none focus:border-itec-sky transition-colors placeholder:text-itec-muted/60";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-itec-border bg-itec-box p-5">
      {/* ── Selector de modo ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={14} className="text-itec-muted shrink-0" />
        <p className="text-xs font-bold uppercase tracking-widest text-itec-muted">Buscar por</p>
        <div className="ml-auto flex rounded-xl border border-itec-border overflow-hidden">
          {(["filtros", "comision"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                mode === m
                  ? "bg-itec-sky text-white"
                  : "text-itec-muted hover:text-itec-text hover:bg-itec-surface"
              }`}
            >
              {m === "filtros" ? "Carrera / Materia" : "Código de comisión"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Modo: Filtros (Departamento + Materia + Turno) ─────────────── */}
      {mode === "filtros" && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Departamento */}
          <select
            value={departamento}
            onChange={(e) => setDept(e.target.value)}
            className={`${selectCls} flex-1`}
          >
            <option value="">Departamento *</option>
            {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Materia */}
          <Input
            placeholder="Nombre de la materia *"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            fullWidth
            className={`${inputCls} flex-[2]`}
          />

          {/* Turno deseado */}
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value as TurnoDeseado | "")}
            className={`${selectCls} flex-1`}
          >
            <option value="">Turno deseado *</option>
            {TURNOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}

      {/* ── Modo: Comisión directa ─────────────────────────────────────── */}
      {mode === "comision" && (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-itec-muted pointer-events-none" />
            <Input
              placeholder="Ej: K1094, Z1051, A2003..."
              value={comision}
              onChange={(e) => setComision(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              fullWidth
              className={`${inputCls} pl-8 font-mono`}
            />
          </div>
          {COMISION_REGEX.test(comision) && (
            <p className="text-[11px] text-emerald-400 font-medium pl-1">
              ✓ Formato válido (1 letra + 4 dígitos)
            </p>
          )}
        </div>
      )}

      {/* ── Mensaje de ayuda ──────────────────────────────────────────── */}
      {mode === "filtros" && (
        <p className="text-[11px] text-itec-muted/70">
          * Los tres campos son obligatorios para buscar. Podés usar el modo "Código de comisión"
          para búsqueda rápida sin seleccionar carrera.
        </p>
      )}

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <p className="rounded-xl border border-itec-accent/30 bg-itec-accent/10 px-3 py-2 text-xs text-itec-accent">
          {error}
        </p>
      )}

      {/* ── Acciones ──────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          hierarchy="solid"
          text="Buscar"
          onClick={apply}
          disabled={!canSearch}
          className="rounded-xl py-2 px-5 text-sm"
        />
        <Button
          variant="secondary"
          hierarchy="ghost"
          text="Limpiar"
          onClick={clear}
          className="rounded-xl py-2 text-sm"
        />
      </div>
    </div>
  );
};
