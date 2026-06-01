// src/features/aulas/components/organisms/AulaFormModal.tsx
import React, { useState, useEffect } from "react";
import { LayoutModal }    from "@components/templates/LayoutModal";
import { Button }         from "@components/ui/Button";
import { aulasService }   from "../../services/aulas.service";
import { invalidateAulasCache } from "../../hooks/useAulas";
import { MarkdownEditor } from "../atoms/MarkdownEditor";
import type { Aula, AulaFormData, FuncionAula, SedeAula } from "../../types/aulas.types";

interface Props {
  isOpen:  boolean;
  onClose: () => void;
  onSaved: () => void;
  aula?:   Aula | null;
}

const SEDES: { value: SedeAula; label: string }[] = [
  { value: "medrano", label: "Medrano" },
  { value: "campus",  label: "Campus"  },
];

const FUNCIONES: { value: FuncionAula; label: string }[] = [
  { value: "aula_comun",               label: "Aula común"                   },
  { value: "laboratorio_informatica",  label: "Laboratorio de Informática"   },
  { value: "laboratorio_especialidad", label: "Laboratorio de especialidad"  },
  { value: "departamento",             label: "Departamento de carrera"      },
  { value: "bedelia",                  label: "Bedelía"                      },
  { value: "ceit",                     label: "CEIT / Centro de Estudiantes" },
  { value: "sala_reunion",             label: "Sala de reuniones"            },
  { value: "secretaria",               label: "Secretaría"                   },
  { value: "otro",                     label: "Otro"                         },
];

const EMPTY: AulaFormData = {
  numero: "", sede: "", piso: "", funcion: "",
  pasillo: "", ala: "", capacidad: "", carrera: "",
  descripcion: "", referencias: "", videos: [],
};

const fieldCls = "w-full px-4 py-2.5 text-xs rounded-xl bg-itec-surface border border-itec-border text-itec-text outline-none focus:border-itec-sky transition-colors placeholder:text-itec-muted/60";
const labelCls = "text-xs font-semibold text-itec-muted";

export const AulaFormModal: React.FC<Props> = ({ isOpen, onClose, onSaved, aula }) => {
  const isEdit = !!aula;
  const [form,   setForm]   = useState<AulaFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setForm(aula ? {
        numero:      aula.numero,
        sede:        aula.sede,
        piso:        aula.piso,
        funcion:     aula.funcion,
        pasillo:     aula.pasillo     ?? "",
        ala:         aula.ala         ?? "",
        capacidad:   aula.capacidad   ?? "",
        carrera:     aula.carrera     ?? "",
        descripcion: aula.descripcion ?? "",
        referencias: aula.referencias ?? "",
        videos:      aula.videos      ?? [],
      } : EMPTY);
    }
  }, [isOpen, aula]);

  const set = <K extends keyof AulaFormData>(k: K, v: AulaFormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validate = (): string | null => {
    if (!form.numero.trim()) return "El número/nombre del aula es requerido.";
    if (!form.sede)          return "Seleccioná una sede.";
    if (form.piso === "")    return "El piso es requerido.";
    if (!form.funcion)       return "Seleccioná la función del espacio.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setSaving(true);
    try {
      const payload = {
        ...form,
        piso:      form.piso === "" ? 0 : Number(form.piso),
        capacidad: form.capacidad === "" ? undefined : Number(form.capacidad),
      };
      if (isEdit && aula) {
        await aulasService.update(aula._id, payload);
      } else {
        await aulasService.create(payload as unknown as Omit<AulaFormData, "">);
      }
      invalidateAulasCache();
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar aula" : "Crear aula nueva"}
      description={isEdit ? `Editando: ${aula?.numero}` : "Completá los datos del nuevo espacio"}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4 px-4 py-3">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Fila 1: Número + Sede */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 ">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Número / Nombre *</label>
            <input
              placeholder="Ej: 265, Bedelía, Lab-A"
              value={form.numero}
              onChange={(e) => set("numero", e.target.value)}
              className={fieldCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Sede *</label>
            <select value={form.sede} onChange={(e) => set("sede", e.target.value as SedeAula)} className={fieldCls}>
              <option value="">Seleccioná...</option>
              {SEDES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Fila 2: Piso + Función */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Piso *</label>
            <input
              type="number"
              placeholder="Ej: 1, 2, 3"
              value={form.piso}
              onChange={(e) => set("piso", e.target.value === "" ? "" : Number(e.target.value))}
              className={fieldCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Función *</label>
            <select value={form.funcion} onChange={(e) => set("funcion", e.target.value as FuncionAula)} className={fieldCls}>
              <option value="">Seleccioná...</option>
              {FUNCIONES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>

        {/* Fila 3: Pasillo + Ala */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Pasillo</label>
            <input
              placeholder="Ej: Pasillo B"
              value={form.pasillo}
              onChange={(e) => set("pasillo", e.target.value)}
              className={fieldCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Ala</label>
            <input
              placeholder="Ej: Ala Norte"
              value={form.ala}
              onChange={(e) => set("ala", e.target.value)}
              className={fieldCls}
            />
          </div>
        </div>

        {/* Fila 4: Capacidad + Carrera */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Capacidad</label>
            <input
              type="number"
              min={1}
              placeholder="Ej: 60"
              value={form.capacidad}
              onChange={(e) => set("capacidad", e.target.value === "" ? "" : Number(e.target.value))}
              className={fieldCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Carrera / Departamento</label>
            <input
              placeholder="Ej: Ing. Civil"
              value={form.carrera}
              onChange={(e) => set("carrera", e.target.value)}
              className={fieldCls}
            />
          </div>
        </div>

        {/* Descripción — Markdown */}
        <MarkdownEditor
          label="Descripción"
          placeholder={"Información adicional sobre el espacio...\n\nEjemplo:\n- Tiene **proyector** y pizarrón\n- Capacidad para _60 personas_\n- [Ver plano](https://...)"}
          value={form.descripcion}
          onChange={(v) => set("descripcion", v)}
          rows={5}
        />

        {/* Referencias — Markdown */}
        <MarkdownEditor
          label="Referencias de acceso (cómo llegar)"
          placeholder={"Indicaciones para llegar...\n\nEjemplo:\n1. Entrá por la **puerta principal**\n2. Subí por la escalera central al **2° piso**\n3. Doblá a la derecha en el pasillo B"}
          value={form.referencias}
          onChange={(v) => set("referencias", v)}
          rows={5}
        />

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
          <Button variant="secondary" hierarchy="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" hierarchy="solid" onClick={handleSubmit} isLoading={saving}>
            {isEdit ? "Guardar cambios" : "Crear aula"}
          </Button>
        </div>
      </div>
    </LayoutModal>
  );
};
