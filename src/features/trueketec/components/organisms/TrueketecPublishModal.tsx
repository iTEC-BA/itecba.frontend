import React, { useState } from "react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { TrueketecFormData } from "../../types/trueketec.types";
import { TURNOS, TURNOS_DESEADOS, EMPTY_FORM, MENSAJES } from "../../data";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: TrueketecFormData) => Promise<void>;
  allowedDepts: string[];
  materiaOptions: string[];
}

export const TrueketecPublishModal: React.FC<Props> = ({ isOpen, onClose, onPublish, allowedDepts, materiaOptions }) => {
  const [form, setForm] = useState<TrueketecFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof TrueketecFormData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.departamento || !form.materia || !form.comision_actual || !form.turno_actual || !form.comision_deseada || !form.turno_deseado) {
      setError(MENSAJES.documentacionIncompleta); return;
    }
    setError(""); setSaving(true);
    try { await onPublish(form); setForm(EMPTY_FORM); onClose(); } catch (e: any) { setError(e.message || "Error al procesar solicitud."); } finally { setSaving(false); }
  };

  const deptoOptions = allowedDepts.map(d => ({ value: d, label: d }));
  const turnoOptions = TURNOS.map(t => ({ value: t, label: t }));
  const turnoDeseadoOptions = TURNOS_DESEADOS.map(t => ({ value: t, label: t }));
  const materiaSelectOptions = materiaOptions.map(m => ({ value: m, label: m }));
  const inputCls = "w-full bg-itec-box border border-itec-border rounded px-3 py-2 text-sm focus:border-itec-section-trueketec";

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Registro de Permuta" description="Ingreso de solicitud al sistema de gestión." maxWidth="max-w-lg">
      <div className="flex flex-col gap-6 px-6 py-6">

        <div className="grid grid-cols-1 gap-4 border border-itec-border bg-itec-box rounded-lg p-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Departamento Académico</label>
            <CustomSelect value={form.departamento} onChange={val => set("departamento", val)} options={deptoOptions} placeholder="Seleccionar" className="w-full bg-itec-box border-itec-border py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Materia (tu carrera)</label>
            <CustomSelect
              value={form.materia}
              onChange={val => set("materia", val)}
              options={materiaSelectOptions}
              placeholder={materiaSelectOptions.length ? "Seleccionar materia" : "Sin materias disponibles"}
              disabled={materiaSelectOptions.length === 0}
              className="w-full bg-itec-box border-itec-border py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border border-itec-border bg-itec-box rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 border-b border-itec-border pb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Comisión Actual</label>
              <Input placeholder="K1021" value={form.comision_actual} onChange={e => set("comision_actual", e.target.value.toUpperCase())} fullWidth className={`${inputCls} font-mono`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Turno Asignado</label>
              <CustomSelect value={form.turno_actual} onChange={val => set("turno_actual", val)} options={turnoOptions} placeholder="Turno" className="w-full bg-itec-box border-itec-border py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-itec-section-trueketec">Comisión Requerida</label>
              <Input placeholder="K1032" value={form.comision_deseada} onChange={e => set("comision_deseada", e.target.value.toUpperCase())} fullWidth className={`${inputCls} font-mono border-itec-section-trueketec/50 focus:border-itec-section-trueketec`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-itec-section-trueketec">Turno Requerido</label>
              <CustomSelect value={form.turno_deseado} onChange={val => set("turno_deseado", val)} options={turnoDeseadoOptions} placeholder="Turno" className="w-full bg-itec-box border-itec-section-trueketec/50 py-2 text-sm" />
            </div>
          </div>
        </div>

        {error && <p className="text-[10px] font-bold uppercase tracking-widest text-itec-red text-center">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="slate" hierarchy="outline" text="Cancelar" onClick={onClose} className="rounded border-itec-border bg-itec-surface" />
          <Button variant="primary" hierarchy="solid" text="Procesar Solicitud" isLoading={saving} onClick={handleSubmit} className="rounded px-6 bg-itec-section-trueketec text-white hover:bg-itec-section-trueketec/80" />
        </div>
      </div>
    </LayoutModal>
  );
};
