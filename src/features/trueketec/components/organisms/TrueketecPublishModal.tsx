// src/features/trueketec/components/organisms/TrueketecPublishModal.tsx
import React, { useState } from "react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import type { TrueketecFormData, Turno, TurnoDeseado } from "../../types/trueketec.types";

interface Props {
  isOpen:    boolean;
  onClose:   () => void;
  onPublish: (data: TrueketecFormData) => Promise<void>;
}

const DEPARTAMENTOS = [
  "Ciencias Básicas",
  "Civil",
  "Eléctrica",
  "Electrónica",
  "Industrial",
  "Mecánica",
  "Naval",
  "Sistemas de Información",
  "Química",
  "Textil",
  "Curso de Ingreso",
];

const TURNOS:          Turno[]        = ["Mañana", "Tarde", "Noche"];
const TURNOS_DESEADOS: TurnoDeseado[] = ["Mañana", "Tarde", "Noche", "Cualquiera"];

const EMPTY: TrueketecFormData = {
  departamento: "",
  materia: "", comision_actual: "", turno_actual: "",
  comision_deseada: "", turno_deseado: "",
};

// Materias comunes UTN FRBA
const MATERIAS_COMUNES = [
  "Análisis Matemático I", "Análisis Matemático II",
  "Álgebra y Geometría Analítica",
  "Física I", "Física II",
  "Química General",
  "Sistemas de Representación",
  "Introducción a la Informática",
  "Algoritmos y Estructuras de Datos",
  "Análisis de Sistemas",
  "Paradigmas de Programación",
  "Estructura de Datos",
  "Organización de Computadoras",
  "Bases de Datos",
  "Sistemas Operativos",
  "Redes de Información",
  "Inglés I", "Inglés II",
];

export const TrueketecPublishModal: React.FC<Props> = ({ isOpen, onClose, onPublish }) => {
  const [form,    setForm]    = useState<TrueketecFormData>(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [suggest, setSuggest] = useState<string[]>([]);

  const set = <K extends keyof TrueketecFormData>(k: K, v: TrueketecFormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleMateriaChange = (val: string) => {
    set("materia", val);
    setSuggest(
      val.length >= 2
        ? MATERIAS_COMUNES.filter((m) => m.toLowerCase().includes(val.toLowerCase()))
        : []
    );
  };

  const validate = (): string | null => {
    if (!form.departamento)            return "Seleccioná el departamento.";
    if (!form.materia.trim())          return "Indicá la materia.";
    if (!form.comision_actual.trim())  return "Indicá tu comisión actual.";
    if (!form.turno_actual)            return "Seleccioná tu turno actual.";
    if (!form.comision_deseada.trim()) return "Indicá la comisión deseada (o 'Cualquiera').";
    if (!form.turno_deseado)           return "Seleccioná el turno deseado.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setSaving(true);
    try {
      await onPublish(form);
      setForm(EMPTY);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al publicar.");
    } finally {
      setSaving(false);
    }
  };

  const fieldCls = "w-full px-4 py-3 text-sm rounded-xl bg-itec-surface border border-itec-border text-itec-text outline-none focus:border-itec-sky transition-colors placeholder:text-itec-muted/60";

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title="Publicar intercambio"
      description="Encontrá a otro estudiante para cambiar comisiones"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">

        {/* Departamento */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest">Departamento</label>
          <select
            value={form.departamento}
            onChange={(e) => set("departamento", e.target.value)}
            className={fieldCls}
          >
            <option value="">Seleccioná...</option>
            {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Materia con sugerencias */}
        <div className="relative flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest">Materia</label>
          <Input
            placeholder="Ej: Análisis Matemático II"
            value={form.materia}
            onChange={(e) => handleMateriaChange(e.target.value)}
            fullWidth
            className={fieldCls}
          />
          {suggest.length > 0 && (
            <ul className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border border-itec-border bg-itec-box shadow-xl max-h-48 overflow-y-auto">
              {suggest.map((s) => (
                <li
                  key={s}
                  onClick={() => { set("materia", s); setSuggest([]); }}
                  className="cursor-pointer px-4 py-2.5 text-sm text-itec-text hover:bg-itec-surface border-b border-white/5 last:border-0 transition-colors"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Comisión actual + Turno actual */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest">Comisión actual</label>
            <Input
              placeholder="Ej: K1021"
              value={form.comision_actual}
              onChange={(e) => set("comision_actual", e.target.value.toUpperCase())}
              fullWidth
              className={`${fieldCls} font-mono`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest">Turno actual</label>
            <select
              value={form.turno_actual}
              onChange={(e) => set("turno_actual", e.target.value as Turno | "")}
              className={fieldCls}
            >
              <option value="">Seleccioná...</option>
              {TURNOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Separador */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-itec-border" />
          <span className="text-[11px] font-bold text-itec-muted uppercase tracking-widest">Busco cambiar a</span>
          <div className="flex-1 h-px bg-itec-border" />
        </div>

        {/* Comisión deseada + Turno deseado */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest">Comisión deseada</label>
            <Input
              placeholder="Ej: K1032 o Cualquiera"
              value={form.comision_deseada}
              onChange={(e) => set("comision_deseada", e.target.value.toUpperCase())}
              fullWidth
              className={`${fieldCls} font-mono`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-itec-muted uppercase tracking-widest">Turno deseado</label>
            <select
              value={form.turno_deseado}
              onChange={(e) => set("turno_deseado", e.target.value as TurnoDeseado | "")}
              className={fieldCls}
            >
              <option value="">Seleccioná...</option>
              {TURNOS_DESEADOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-itec-accent/30 bg-itec-accent/10 px-4 py-2.5 text-sm text-itec-accent">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            variant="secondary"
            hierarchy="ghost"
            text="Cancelar"
            onClick={onClose}
            className="flex-1 rounded-xl py-3"
          />
          <Button
            variant="success"
            hierarchy="solid"
            text="Publicar solicitud"
            isLoading={saving}
            onClick={handleSubmit}
            className="flex-1 rounded-xl py-3"
          />
        </div>
      </div>
    </LayoutModal>
  );
};
