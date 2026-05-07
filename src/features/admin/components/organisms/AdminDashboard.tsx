import React from "react";
import { AdminKPICard } from "@features/admin/components/atoms/AdminKPICard";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { useAdminData } from "@features/admin/hooks/useAdminData";
import { type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  onNavigate: (s: AdminSection) => void;
}

const QUICK_ACTIONS: Array<{ emoji: string; text: string; section: AdminSection; tone: string }> = [
  { emoji: "📢", text: "Publicar aviso", section: "news", tone: "hover:border-itec-amber/40 hover:bg-itec-amber/5 hover:text-itec-amber" },
  { emoji: "🏷️", text: "Nuevo beneficio", section: "benefits", tone: "hover:border-itec-sky/40 hover:bg-itec-sky/5 hover:text-itec-sky" },
  { emoji: "🎁", text: "Nueva recompensa", section: "rewards", tone: "hover:border-itec-purple/40 hover:bg-itec-purple/5 hover:text-itec-purple" },
  { emoji: "👥", text: "Gestionar roles", section: "users", tone: "hover:border-itec-accent/40 hover:bg-itec-accent/5 hover:text-itec-accent" },
  { emoji: "📚", text: "Académico", section: "materias", tone: "hover:border-itec-emerald/40 hover:bg-itec-emerald/5 hover:text-itec-emerald" },
  { emoji: "🧾", text: "Ver canjes", section: "redemptions", tone: "hover:border-orange-400/40 hover:bg-orange-400/5 hover:text-orange-400" },
  { emoji: "🎓", text: "Tutorías", section: "tutorias", tone: "hover:border-itec-sky/40 hover:bg-itec-sky/5 hover:text-itec-sky" },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { stats, loading } = useAdminData();

  const kpis = [
    { label: "Usuarios totales", value: stats?.totalUsers ?? 0, emoji: "👥", accent: "text-itec-sky" },
    { label: "Beneficios activos", value: stats?.totalRewards ?? 0, emoji: "🏷️", accent: "text-itec-amber" },
    { label: "Canjes realizados", value: stats?.totalRedeemed ?? 0, emoji: "🧾", accent: "text-itec-emerald" },
    { label: "Avisos publicados", value: stats?.totalNews ?? 0, emoji: "📢", accent: "text-itec-accent" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Dashboard</p>
        <h2 className="text-3xl font-black tracking-tight text-itec-text sm:text-4xl">
          Centro de control
        </h2>
        <p className="max-w-2xl text-sm text-itec-muted">
          Vista bento para monitorear la plataforma y saltar a cada módulo sin perder contexto.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <AdminKPICard key={k.label} loading={loading} {...k} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="p-5 sm:p-6" variant="elevated">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Acciones</p>
              <h3 className="mt-1 text-sm font-black text-itec-text">Acceso rápido</h3>
            </div>
            <span className="rounded-full border border-itec-border bg-itec-surface px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-itec-muted">
              {QUICK_ACTIONS.length} módulos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.section}
                type="button"
                onClick={() => onNavigate(action.section)}
                className={cn(
                  "group flex items-center gap-3 rounded-[1.2rem] border border-itec-border bg-itec-surface/70 px-3 py-3 text-left text-xs font-bold text-itec-muted transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(0,0,0,0.18)]",
                  action.tone
                )}
              >
                <span className="text-lg transition-transform group-hover:scale-110">{action.emoji}</span>
                <span className="leading-tight">{action.text}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6" variant="elevated" glow="sky">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Estado</p>
          <h3 className="mt-1 text-sm font-black text-itec-text">Sistema en línea</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "API Backend", value: "Operativo", tone: "text-itec-emerald" },
              { label: "Firebase Auth", value: "Operativo", tone: "text-itec-emerald" },
              { label: "MongoDB Atlas", value: "Conectado", tone: "text-itec-sky" },
              { label: "Cache", value: "Sincronizado", tone: "text-itec-amber" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-[1.1rem] border border-itec-border bg-itec-surface/60 px-4 py-3">
                <span className="text-sm text-itec-muted">{row.label}</span>
                <span className={cn("text-sm font-black", row.tone)}>{row.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
