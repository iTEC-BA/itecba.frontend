import React, { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Send, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  createMutation: UseMutationResult<string, Error, { title: string; message: string; hours: number; isCritical: boolean }, unknown>;
}

export const NewsForm: React.FC<Props> = ({ createMutation }) => {
  const [form, setForm] = useState({ title: "", message: "", hours: "24", isCritical: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title: form.title, message: form.message, hours: parseInt(form.hours) || 24, isCritical: form.isCritical },
      { onSuccess: () => setForm({ title: "", message: "", hours: "24", isCritical: false }) }
    );
  };

  const isFormValid = form.title.trim().length > 0 && form.message.trim().length > 0;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-itec-border bg-itec-box p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-itec-text">Redactar aviso</h3>
        <p className="text-xs text-itec-muted">Completá los datos para enviar un mensaje masivo a todos los estudiantes.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-itec-text">Título</label>
          <input
            type="text"
            required
            placeholder="Ej: Apertura de inscripciones 2026"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-transparent border border-itec-border rounded-lg px-4 py-3 text-sm text-itec-text focus:outline-none focus:border-white/30 transition-all placeholder:text-itec-muted/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-itec-text">Mensaje</label>
          <textarea
            required
            placeholder="Detallá la información aquí..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="min-h-[140px] w-full resize-none bg-transparent border border-itec-border rounded-lg px-4 py-3 text-sm text-itec-text focus:outline-none focus:border-white/30 transition-all placeholder:text-itec-muted/50 custom-scrollbar"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-itec-text flex items-center gap-1.5">
              Duración
            </label>
            <select
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full appearance-none bg-transparent border border-itec-border rounded-lg px-4 py-2.5 text-sm text-itec-text focus:outline-none focus:border-white/30 transition-all cursor-pointer"
            >
              <option value="5" className="bg-itec-bg">5 horas</option>
              <option value="12" className="bg-itec-bg">12 horas</option>
              <option value="24" className="bg-itec-bg">1 día</option>
              <option value="72" className="bg-itec-bg">3 días</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label 
              className={cn(
                "flex items-center justify-center gap-2 h-[42px] rounded-lg border cursor-pointer transition-all text-xs font-bold select-none",
                form.isCritical 
                  ? "bg-itec-red/10 border-itec-red/30 text-itec-red" 
                  : "bg-transparent border-itec-border text-itec-text hover:bg-white/5"
              )}
            >
              <input
                type="checkbox"
                checked={form.isCritical}
                onChange={(e) => setForm({ ...form, isCritical: e.target.checked })}
                className="hidden"
              />
              <AlertTriangle className={cn("w-3.5 h-3.5", form.isCritical ? "text-itec-red" : "text-itec-muted")} />
              Aviso Crítico
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending || !isFormValid}
          className={cn(
            "mt-2 flex items-center justify-center gap-2 w-full text-xs font-bold py-3 rounded-lg transition-colors disabled:cursor-not-allowed",
            isFormValid 
              ? "bg-white/10 hover:bg-white/20 text-white border border-transparent" 
              : "bg-transparent border border-itec-border text-itec-muted/50"
          )}
        >
          {createMutation.isPending ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Publicar aviso
        </button>
      </form>
    </div>
  );
};
