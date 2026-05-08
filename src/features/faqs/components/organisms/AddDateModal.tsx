// src/features/faqs/components/organisms/AddDateModal.tsx
import React, { useState } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";
import type { ImportantDate } from "./ImportantDatesWidget";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newDate: ImportantDate) => void;
}

export const AddDateModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle]             = useState("");
  const [date, setDate]               = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    // TODO: Reemplazar con llamado a API (ej: datesService.createDate(...))
    const newDate: ImportantDate = {
      id: Date.now().toString(),
      title,
      date,
      description,
    };
    onAdd(newDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    /* Backdrop con blur */
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4">

      {/* Panel — bottom-sheet en mobile, modal en sm+ */}
      <div className="relative w-full sm:max-w-md overflow-hidden rounded-t-4xl sm:rounded-3xl border border-itec-border bg-itec-box p-6 shadow-glass animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-itec-amber/5 blur-3xl" />

        {/* Handle (solo mobile) */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-itec-border sm:hidden" />

        {/* Header */}
        <div className="relative z-10 mb-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Calendario
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-itec-text">
              Agregar Fecha
            </h2>
            <p className="mt-1 text-xs text-itec-muted">
              Será visible para todos los estudiantes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:bg-itec-box2 hover:text-itec-text active:scale-95"
          >
            <Icons type="close" className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Título del Evento
            </label>
            <Input
              fullWidth
              placeholder="Ej: Exámenes Finales"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Día / Rango
            </label>
            <Input
              fullWidth
              placeholder="Ej: 10 al 15 de Diciembre"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Descripción breve
            </label>
            <Input
              fullWidth
              placeholder="Anotarse por SIGA..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-itec-border pt-4">
            <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="warning" hierarchy="solid">
              Guardar Fecha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
