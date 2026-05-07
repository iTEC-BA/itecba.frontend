import React, { useEffect, useRef } from "react";
import { useEditProfile } from "@features/profile/hooks/useEditProfile";
import { CareerSelector } from "@features/profile/components/molecules/CareerSelector";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { cn } from "@/lib/utils";

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const { form, setField, careers, setCareers, saving, error, handleSubmit } = useEditProfile(onClose);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const labelCls = "block text-[10px] font-black text-itec-muted uppercase tracking-[0.22em] mb-1.5";

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && onClose()}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <GlassCard
        variant="elevated"
        className={cn(
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto",
          "border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        )}
      >
        <div className="sticky top-0 z-10 border-b border-itec-border bg-itec-box/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-itec-text">Editar perfil</h2>
              <p className="text-xs text-itec-muted mt-0.5">Actualizá tus datos académicos y de contacto.</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:text-itec-text hover:bg-itec-box2"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Nombre completo</label>
              <Input fullWidth value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Tu nombre" />
            </div>
            <div>
              <label className={labelCls}>DNI</label>
              <Input fullWidth value={form.dni} onChange={(e) => setField("dni", e.target.value)} placeholder="Documento" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Legajo</label>
              <Input fullWidth value={form.legajo} onChange={(e) => setField("legajo", e.target.value)} placeholder="Legajo" />
            </div>
            <div>
              <label className={labelCls}>Año de ingreso</label>
              <Input
                fullWidth
                type="number"
                min="1990"
                max={new Date().getFullYear()}
                value={form.startYear ?? ""}
                onChange={(e) => setField("startYear", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="2022"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Teléfono</label>
              <Input fullWidth value={form.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} placeholder="+54 9..." />
            </div>
            <div>
              <label className={labelCls}>Carreras</label>
              <CareerSelector value={careers} onChange={setCareers} max={2} />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-itec-accent/20 bg-itec-accent/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="slate" hierarchy="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" hierarchy="solid" type="submit" isLoading={saving}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
