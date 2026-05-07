import React, { useEffect, useRef } from "react";
import { useEditProfile } from "@features/profile/hooks/useEditProfile";
import { CareerSelector } from "@features/profile/components/molecules/CareerSelector";
import { cn } from "@/lib/utils";
interface EditProfileModalProps { onClose: () => void; }
export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const { form, setField, careers, setCareers, saving, error, handleSubmit } = useEditProfile(onClose);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  const inputCls = cn(
    "w-full bg-itec-surface border border-itec-border text-itec-text",
    "text-sm px-3 py-2.5 rounded-xl outline-none transition-all",
    "focus:border-itec-sky/50 focus:ring-1 focus:ring-itec-sky/20",
    "placeholder:text-itec-muted"
  );
  const labelCls = "block text-[10px] font-black text-itec-muted uppercase tracking-widest mb-1.5";
  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && onClose()}
      className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className={cn(
        "w-full max-w-lg bg-itec-box border border-itec-border rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.7)]",
        "animate-[scale-in_0.2s_ease] overflow-y-auto max-h-[90vh]"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-itec-border">
          <div>
            <h2 className="text-lg font-black text-itec-text">Editar Perfil</h2>
            <p className="text-xs text-itec-muted mt-0.5">Tu información académica en ITEC</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-itec-muted hover:text-itec-text hover:bg-itec-surface transition-all text-xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nombre completo</label>
              <input
                className={inputCls}
                placeholder="Ej: María González"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>DNI</label>
              <input
                className={inputCls}
                placeholder="12345678"
                value={form.dni}
                maxLength={8}
                onChange={(e) => setField("dni", e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div>
              <label className={labelCls}>N° Legajo</label>
              <input
                className={inputCls}
                placeholder="172XXXXX"
                value={form.legajo}
                onChange={(e) => setField("legajo", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input
                className={inputCls}
                placeholder="+54 11 XXXX-XXXX"
                value={form.phone ?? ""}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Año de inicio</label>
              <input
                type="number"
                className={inputCls}
                placeholder={String(new Date().getFullYear())}
                value={form.startYear ?? ""}
                min={2000}
                max={new Date().getFullYear()}
                onChange={(e) => setField("startYear", Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Carrera(s) — máx. 2</label>
            <CareerSelector value={careers} onChange={setCareers} max={2} />
            <p className="text-[10px] text-itec-muted mt-1.5">
              Podés cursar dos carreras (doble título).
            </p>
          </div>
          {error && (
            <p className="text-itec-accent text-xs font-bold bg-itec-accent/10 border border-itec-accent/20 rounded-xl px-3 py-2">
              ⚠️ {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-itec-muted bg-itec-surface hover:bg-itec-border transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all",
                "bg-itec-sky hover:bg-itec-blue disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </span>
              ) : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
