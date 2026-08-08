import React, { useState } from "react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { ArrowRight } from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { CustomSelect } from "@components/ui/CustomSelect";
import type { TrueketecFormData, Turno, TurnoDeseado } from "../../types/trueketec.types";

interface Props { isOpen: boolean; onClose: () => void; onPublish: (data: TrueketecFormData) => Promise<void>; }

const DEPARTAMENTOS = ["Ciencias Básicas", "Civil", "Eléctrica", "Electrónica", "Industrial", "Mecánica", "Naval", "Sistemas de Información", "Química", "Textil", "Curso de Ingreso"];
const TURNOS: Turno[] = ["Mañana", "Tarde", "Noche"];
const TURNOS_DESEADOS: TurnoDeseado[] = ["Mañana", "Tarde", "Noche", "Cualquiera"];
const EMPTY: TrueketecFormData = { departamento: "", materia: "", comision_actual: "", turno_actual: "", comision_deseada: "", turno_deseado: "" };

export const TrueketecPublishModal: React.FC<Props> = ({ isOpen, onClose, onPublish }) => {
  const [form, setForm] = useState<TrueketecFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof TrueketecFormData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if(!form.departamento || !form.materia || !form.comision_actual || !form.turno_actual || !form.comision_deseada || !form.turno_deseado) {
      setError("Todos los campos son obligatorios."); return;
    }
    setError(""); setSaving(true);
    try { await onPublish(form); setForm(EMPTY); onClose(); } catch (e: any) { setError(e.message || "Error al publicar."); } finally { setSaving(false); }
  };

  const inputCls = "w-full rounded-md border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30";
  
  // Transformar listas para CustomSelect
  const deptoOptions = DEPARTAMENTOS.map(d => ({ value: d, label: d }));
  const turnoOptions = TURNOS.map(t => ({ value: t, label: t }));
  const turnoDeseadoOptions = TURNOS_DESEADOS.map(t => ({ value: t, label: t }));

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Publicar Intercambio" description="Encontrá a otro estudiante para cambiar de comisión." maxWidth="max-w-lg">
      <div className="flex flex-col gap-6 px-6 py-6">
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Departamento *</label>
            <CustomSelect 
              value={form.departamento} 
              onChange={val => set("departamento", val)} 
              options={deptoOptions} 
              placeholder="Seleccioná..." 
              className="w-full rounded-md border-white/10 bg-white/5 py-3 px-4 text-sm text-white focus:border-white/30" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Materia *</label>
            <Input placeholder="Ej: Análisis Matemático II" value={form.materia} onChange={e => set("materia", e.target.value)} fullWidth className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/30" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 border-b border-white/10 pb-2 pl-1">Tu cursada actual</span>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Comisión (K1021)" value={form.comision_actual} onChange={e => set("comision_actual", e.target.value.toUpperCase())} fullWidth className={`${inputCls} font-mono placeholder:font-sans`} />
              <CustomSelect 
                value={form.turno_actual} 
                onChange={val => set("turno_actual", val)} 
                options={turnoOptions} 
                placeholder="Turno..." 
                className="w-full rounded-md border-white/10 bg-black/20 py-3 px-4 text-sm text-white focus:border-white/30" 
              />
            </div>
          </div>
          <div className="flex justify-center -my-3 relative z-10">
            <div className="bg-itec-box p-1.5 rounded-full border border-white/10 text-white/30"><ArrowRight size={14}/></div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-itec-emerald border-b border-itec-emerald/20 pb-2 pl-1">La que estás buscando</span>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Comisión (K1032)" value={form.comision_deseada} onChange={e => set("comision_deseada", e.target.value.toUpperCase())} fullWidth className={`${inputCls} font-mono border-itec-emerald/20 focus:border-itec-emerald/50 placeholder:font-sans`} />
              <CustomSelect 
                value={form.turno_deseado} 
                onChange={val => set("turno_deseado", val)} 
                options={turnoDeseadoOptions} 
                placeholder="Turno..." 
                className="w-full rounded-md border-itec-emerald/20 bg-black/20 py-3 px-4 text-sm text-white focus:border-itec-emerald/50" 
              />
            </div>
          </div>
        </div>

        {error && <p className="text-[10px] font-bold uppercase tracking-widest text-itec-red text-center bg-itec-red/10 border border-itec-red/20 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button variant="slate" hierarchy="ghost" text="Cancelar" onClick={onClose} className="w-1/3 py-3 rounded-xl" />
          <Button variant="success" hierarchy="solid" text="Publicar ahora" isLoading={saving} onClick={handleSubmit} className="w-2/3 py-3 rounded-xl bg-itec-emerald text-black hover:bg-emerald-500" />
        </div>
      </div>
    </LayoutModal>
  );
};
