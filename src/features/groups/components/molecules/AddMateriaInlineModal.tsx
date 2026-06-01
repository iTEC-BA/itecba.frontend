// src/features/groups/components/molecules/AddMateriaInlineModal.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@features/notifications/components/atoms/Toast";
import { materiasService } from "../../services/materiasService";
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from "../../types/groups";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { Button } from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  initialCarrera: string;
  initialNivel: string;
  onClose: () => void;
  onCreated: (nombreMateria: string) => void;
}

const FIELD_CLS =
  "bg-itec-bg border border-white/10 text-itec-text text-sm px-3 py-2.5 rounded-xl outline-none focus:border-itec-groups/50 placeholder:text-itec-gray/50 transition-colors w-full";

export const AddMateriaInlineModal: React.FC<Props> = ({
  isOpen, initialCarrera, initialNivel, onClose, onCreated,
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ carrera: initialCarrera, nivel: initialNivel, materia: "", codigo: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const field = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.carrera || !form.nivel || !form.materia.trim()) {
      setError("Carrera, nivel y nombre son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await materiasService.createMateria({
        carrera: form.carrera,
        nivel: form.nivel,
        materia: form.materia.trim(),
        codigo: form.codigo.trim() || undefined,
      });
      toast.success(`"${created.materia}" agregada al catálogo`);
      onCreated(created.materia);
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al crear materia.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar nueva materia"
      description="Se sumará al catálogo y podrás seleccionarla."
      maxWidth="max-w-md"
    >
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">Carrera *</span>
            <select className={FIELD_CLS} value={form.carrera} onChange={field("carrera")}>
              <option value="">Elegir...</option>
              {CARRERAS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">Nivel *</span>
            <select className={FIELD_CLS} value={form.nivel} onChange={field("nivel")}>
              <option value="">Elegir...</option>
              {NIVEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">Nombre *</span>
          <input
            className={FIELD_CLS}
            placeholder="Ej: Análisis Matemático I"
            value={form.materia}
            onChange={field("materia")}
            onKeyDown={(e) => e.key === "Enter" && !saving && handleSave()}
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-itec-gray uppercase tracking-wider">
            Código <span className="normal-case font-normal text-itec-gray/50">(opcional)</span>
          </span>
          <input
            className={`${FIELD_CLS} font-mono`}
            placeholder="Ej: 950605"
            value={form.codigo}
            onChange={field("codigo")}
          />
        </label>
        {error && (
          <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2 px-5 pb-5 border-t border-white/10">
        <Button onClick={onClose} variant="slate" hierarchy="ghost">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <Plus className="size-3.5" />
              Crear materia
            </>
          )}
        </Button>
      </div>
    </LayoutModal>
  );
};
