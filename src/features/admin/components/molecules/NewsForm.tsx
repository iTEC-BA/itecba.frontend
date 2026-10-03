import React, { useEffect, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Send, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { adminService, type RoleDefinition } from "@/features/admin/services/admin.service";
import { CARRERAS_OPTIONS } from "@/features/groups/types/groups";

interface Props {
  createMutation: UseMutationResult<string, Error, {
    title: string;
    message: string;
    hours: number;
    isCritical: boolean;
    audienceRoles: string[];
    audienceCareers: string[];
  }, unknown>;
  onSuccess?: () => void;
}

export const NewsForm: React.FC<Props> = ({ createMutation, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    hours: "24",
    isCritical: false,
    audienceRoles: ["all"],
    audienceCareers: [] as string[],
  });
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [roleToAdd, setRoleToAdd] = useState("");
  const [careerToAdd, setCareerToAdd] = useState("");

  useEffect(() => {
    adminService.getRoles().then(setRoles).catch((error) => {
      console.error("No se pudieron cargar los roles para avisos:", error);
    });
  }, []);

  const addRole = (role: string) => {
    if (!role) return;
    setForm((current) => ({
      ...current,
      audienceRoles: role === "all" ? ["all"] : [...current.audienceRoles.filter((item) => item !== "all"), role],
    }));
    setRoleToAdd("");
  };

  const addCareer = (career: string) => {
    if (!career) return;
    setForm((current) => ({
      ...current,
      audienceCareers: current.audienceCareers.includes(career)
        ? current.audienceCareers
        : [...current.audienceCareers, career],
    }));
    setCareerToAdd("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        title: form.title,
        message: form.message,
        hours: parseInt(form.hours) || 24,
        isCritical: form.isCritical,
        audienceRoles: form.audienceRoles,
        audienceCareers: form.audienceCareers,
      },
      { onSuccess: () => {
        setForm({ title: "", message: "", hours: "24", isCritical: false, audienceRoles: ["all"], audienceCareers: [] });
        onSuccess?.();
      } }
    );
  };

  const isFormValid = form.title.trim().length > 0 && form.message.trim().length > 0;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-itec-border/50 bg-itec-box p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-itec-text">Redactar aviso</h3>
        <p className="text-xs text-itec-muted">Completá los datos para enviar un mensaje masivo a todos los estudiantes.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-itec-text">Título</label>
          <Input
            fullWidth
            type="text"
            required
            placeholder="Ej: Apertura de inscripciones 2026"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-itec-border/50 bg-transparent px-4 py-3 text-sm focus:border-itec-border/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-itec-text">Mensaje</label>
          <textarea
            required
            placeholder="Detallá la información aquí..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="min-h-[140px] w-full resize-none bg-transparent border border-itec-border/50 rounded-lg px-4 py-3 text-sm text-itec-text focus:outline-none focus:border-itec-border/50 transition-all placeholder:text-itec-muted/50 custom-scrollbar"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <CustomSelect
              label="Duración"
              value={form.hours}
              onChange={(hours) => setForm({ ...form, hours })}
              options={[
                { value: "5", label: "5 horas" },
                { value: "12", label: "12 horas" },
                { value: "24", label: "1 día" },
                { value: "72", label: "3 días" },
              ]}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <CustomSelect
                label="Roles destinatarios"
                value={roleToAdd}
                onChange={addRole}
                placeholder="Agregar un rol..."
                options={[
                  { value: "all", label: "Todos los usuarios" },
                  ...roles.map((role) => ({ value: role.key, label: role.name })),
                ]}
              />
              <div className="flex flex-wrap gap-1.5">
                {form.audienceRoles.map((role) => (
                  <span key={role} className="inline-flex items-center gap-1 rounded-lg border border-itec-border/50 bg-itec-surface px-2 py-1 text-xs text-itec-text">
                    {role === "all" ? "Todos" : roles.find((item) => item.key === role)?.name ?? role}
                    <button type="button" onClick={() => setForm({ ...form, audienceRoles: form.audienceRoles.filter((item) => item !== role) })} className="text-itec-muted hover:text-itec-text">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <CustomSelect
                label="Carreras destinatarias"
                value={careerToAdd}
                onChange={addCareer}
                placeholder="Agregar una carrera..."
                options={CARRERAS_OPTIONS}
              />
              <div className="flex flex-wrap gap-1.5">
                {form.audienceCareers.map((career) => (
                  <span key={career} className="inline-flex items-center gap-1 rounded-lg border border-itec-border/50 bg-itec-surface px-2 py-1 text-xs text-itec-text">
                    {CARRERAS_OPTIONS.find((item) => item.value === career)?.label ?? career}
                    <button type="button" onClick={() => setForm({ ...form, audienceCareers: form.audienceCareers.filter((item) => item !== career) })} className="text-itec-muted hover:text-itec-text">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-itec-muted">
            Los filtros se combinan: el usuario debe coincidir con el rol y, si se indican carreras, con al menos una de ellas. Dejá “all” y carreras vacías para un aviso global.
          </p>

          <div className="flex flex-col justify-end">
            <label 
              className={cn(
                "flex items-center justify-center gap-2 h-[42px] rounded-lg border cursor-pointer transition-all text-xs font-bold select-none",
                form.isCritical 
                  ? "bg-itec-red/10 border-itec-red/30 text-itec-red" 
                  : "bg-transparent border-itec-border/50 text-itec-text hover:bg-white/5"
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

        <Button
          variant="primary"
          hierarchy="solid"
          type="submit"
          disabled={createMutation.isPending || !isFormValid}
          fullWidth
          isLoading={createMutation.isPending}
          icon={!createMutation.isPending ? <Send className="w-4 h-4" /> : undefined}
          text="Publicar aviso"
        >
        </Button>
      </form>
    </div>
  );
};
