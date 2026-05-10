import React, { useState, useEffect } from "react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import {
  CalendarEvent,
  CalendarEventInput,
  EventType,
} from "../hooks/useCalendarEvents";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onCreate: (data: CalendarEventInput) => Promise<void>;
  onUpdate: (id: string, data: Partial<CalendarEventInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: "examen", label: "Examen" },
  { value: "institucional", label: "Institucional" },
  { value: "feriado", label: "Feriado" },
  { value: "beca", label: "Beca" },
  { value: "actividad", label: "Actividad" },
];
const EMPTY: CalendarEventInput = {
  title: "",
  description: "",
  subtitle: "",
  date: "",
  type: "examen",
};

export const CalendarAdminModal: React.FC<Props> = ({
  isOpen,
  onClose,
  event,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [form, setForm] = useState<CalendarEventInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!event;

  useEffect(() => {
    if (isOpen) {
      setError("");
      setForm(
        event
          ? {
              title: event.title,
              description: event.description ?? "",
              subtitle: event.subtitle ?? "",
              date: event.date,
              type: event.type,
            }
          : EMPTY,
      );
    }
  }, [event, isOpen]);

  const set = (field: keyof CalendarEventInput, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!form.date) {
      setError("La fecha es obligatoria.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      if (isEditing) await onUpdate(event!.id, form);
      else await onCreate(form);
      onClose();
    } catch {
      setError("Ocurrió un error al guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !confirm("¿Eliminar esta fecha definitivamente?")) return;
    setDeleting(true);
    try {
      await onDelete(event.id);
      onClose();
    } catch {
      setError("Error al eliminar.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar fecha" : "Nueva fecha importante"}
      description={
        isEditing
          ? "Modificá los datos del evento académico."
          : "Completá los campos para agregar una nueva fecha."
      }
      maxWidth="max-w-lg"
    >
      <div className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest">
            Título *
          </label>
          <Input
            fullWidth
            placeholder="Ej: 1.° Turno de finales"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest">
            Subtítulo{" "}
            <span className="opacity-50 normal-case font-normal">
              (opcional)
            </span>
          </label>
          <Input
            fullWidth
            placeholder="Ej: AM2, Física I, Álgebra"
            value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest">
            Descripción{" "}
            <span className="opacity-50 normal-case font-normal">
              (opcional)
            </span>
          </label>
          <textarea
            rows={3}
            placeholder="Descripción adicional del evento..."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="bg-itec-surface/80 border border-itec-border text-itec-text px-4 py-3 rounded-2xl shadow-inner shadow-black/10 placeholder:text-itec-muted/80 outline-none transition-all resize-none w-full focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest">
            Fecha *
          </label>
          <Input
            fullWidth
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-itec-gray uppercase tracking-widest">
            Tipo *
          </label>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("type", opt.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.type === opt.value ? "bg-itec-red border-itec-red text-white" : "bg-transparent border-itec-border text-[#9aa3b0] hover:border-white/20"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p className="text-xs text-[#e01540] bg-itec-red/10 border border-itec-red/20 rounded-xl px-4 py-2">
            {error}
          </p>
        )}
        <div
          className={`flex gap-2 pt-1 ${isEditing ? "justify-between" : "justify-end"}`}
        >
          {isEditing && (
            <Button
              variant="danger"
              hierarchy="outline"
              text={deleting ? "Eliminando..." : "Eliminar"}
              onClick={handleDelete}
              disabled={deleting || saving}
            />
          )}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              hierarchy="solid"
              text="Cancelar"
              onClick={onClose}
              disabled={saving || deleting}
            />
            <Button
              variant="primary"
              hierarchy="solid"
              text={
                saving
                  ? "Guardando..."
                  : isEditing
                    ? "Guardar cambios"
                    : "Crear fecha"
              }
              onClick={handleSave}
              disabled={saving || deleting}
              isLoading={saving}
            />
          </div>
        </div>
      </div>
    </LayoutModal>
  );
};
