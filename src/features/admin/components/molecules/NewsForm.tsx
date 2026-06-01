import React, { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";

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

  return (
    <GlassCard className="p-5 sm:p-6 lg:p-7" variant="elevated" glow="amber">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Comunicados</p>
        <h3 className="mt-1 text-xl font-bold text-itec-text">Redactar aviso</h3>
        <p className="mt-2 text-sm text-itec-muted">Compartí novedades con toda la comunidad ITEC.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block pl-1 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Título</label>
          <Input
            type="text"
            required
            placeholder="Ej: Apertura de inscripciones 2026"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth
          />
        </div>

        <div className="space-y-1.5">
          <label className="block pl-1 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Mensaje</label>
          <textarea
            required
            placeholder="Detallá la información aquí..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="min-h-[160px] w-full rounded-xl border border-itec-border bg-itec-surface/80 p-4 text-sm text-itec-text outline-none transition-all placeholder:text-itec-muted/80 focus:border-itec-amber/40 focus:ring-2 focus:ring-itec-amber/10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.3rem] border border-itec-border bg-itec-surface/60 p-4">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Tiempo visible</label>
            <select
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full bg-transparent text-sm font-bold text-itec-text outline-none"
            >
              <option value="5">5 horas</option>
              <option value="12">12 horas</option>
              <option value="24">1 día</option>
              <option value="72">3 días</option>
            </select>
          </div>

          <div className="rounded-[1.3rem] border border-itec-border bg-itec-surface/60 p-4">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Criticidad</label>
            <label className="flex items-center gap-3 text-sm text-itec-text">
              <input
                type="checkbox"
                checked={form.isCritical}
                onChange={(e) => setForm({ ...form, isCritical: e.target.checked })}
                className="h-4 w-4 rounded border-itec-border bg-itec-surface accent-itec-accent"
              />
              Destacar como crítico
            </label>
          </div>
        </div>

        <Button
          variant="warning"
          hierarchy="solid"
          fullWidth
          type="submit"
          isLoading={createMutation.isPending}
        >
          Publicar aviso
        </Button>
      </form>
    </GlassCard>
  );
};
