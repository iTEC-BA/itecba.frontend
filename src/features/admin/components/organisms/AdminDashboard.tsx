import React from "react";
import { AdminKPICard } from "@features/admin/components/atoms/AdminKPICard";
import { useAdminData } from "@features/admin/hooks/useAdminData";
import { type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

type IconType = React.ComponentProps<typeof Icons>["type"];

interface AdminDashboardProps {
  onNavigate: (s: AdminSection) => void;
}

const QUICK_ACTIONS: Array<{
  icon: IconType;
  text: string;
  section: AdminSection;
  tone: string;
}> = [
  {
    icon: "bell",
    text: "Publicar aviso",
    section: "news",
    tone: "hover:border-itec-amber/40 hover:bg-itec-amber/10 hover:text-itec-amber text-itec-amber/80",
  },
  {
    icon: "star",
    text: "Nuevo beneficio",
    section: "benefits",
    tone: "hover:border-itec-sky/40 hover:bg-itec-sky/10 hover:text-itec-sky text-itec-sky/80",
  },
  {
    icon: "gift",
    text: "Nueva recompensa",
    section: "rewards",
    tone: "hover:border-itec-purple/40 hover:bg-itec-purple/10 hover:text-itec-purple text-itec-purple/80",
  },
  {
    icon: "users",
    text: "Gestionar roles",
    section: "users",
    tone: "hover:border-itec-red/40 hover:bg-itec-red/10 hover:text-itec-red text-itec-red/80",
  },
  {
    icon: "book",
    text: "Académico",
    section: "materias",
    tone: "hover:border-itec-emerald/40 hover:bg-itec-emerald/10 hover:text-itec-emerald text-itec-emerald/80",
  },
  {
    icon: "ticket",
    text: "Ver canjes",
    section: "redemptions",
    tone: "hover:border-itec-amber/40 hover:bg-itec-amber/10 hover:text-itec-amber text-itec-amber/80",
  },
  {
    icon: "video",
    text: "Tutorías",
    section: "tutorias",
    tone: "hover:border-itec-blue-skye/40 hover:bg-itec-blue-skye/10 hover:text-itec-blue-skye text-itec-blue-skye/80",
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
}) => {
  const { stats, loading } = useAdminData();

  const kpis = [
    {
      label: "Usuarios totales",
      value: stats?.totalUsers ?? 0,
      icon: "users",
      accent: "text-itec-sky",
    },
    {
      label: "Beneficios activos",
      value: stats?.totalRewards ?? 0,
      icon: "star",
      accent: "text-itec-amber",
    },
    {
      label: "Canjes realizados",
      value: stats?.totalRedeemed ?? 0,
      icon: "ticket",
      accent: "text-itec-emerald",
    },
    {
      label: "Avisos publicados",
      value: stats?.totalNews ?? 0,
      icon: "bell",
      accent: "text-itec-red-skye",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
          Dashboard
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-itec-text font-display sm:text-4xl">
          Centro de control
        </h2>
        <p className="max-w-2xl text-sm text-itec-muted leading-relaxed">
          Vista bento para monitorear la plataforma y saltar a cada módulo sin
          perder contexto.
        </p>
      </div>

      {/* Tarjetas KPI Superiores */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <AdminKPICard key={k.label} loading={loading} {...k} />
        ))}
      </div>

      {/* Grid Bento Principal */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        {/* PANEL: Acceso Rápido */}
        <div className="rounded-4xl border border-itec-border bg-itec-box p-6 shadow-glass sm:p-8 relative overflow-hidden group">
          {/* Subtle Glow de fondo */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-itec-sky/5 blur-3xl transition-all duration-700 group-hover:bg-itec-sky/10" />

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
                Acciones
              </p>
              <h3 className="text-lg font-bold text-itec-text tracking-tight mt-1">
                Acceso rápido
              </h3>
            </div>
            <span className="shrink-0 rounded-full border border-itec-border bg-itec-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-itec-muted">
              {QUICK_ACTIONS.length} Módulos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 relative z-10">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.section}
                type="button"
                onClick={() => onNavigate(action.section)}
                className={cn(
                  "group/btn flex flex-col sm:flex-row items-center sm:items-start gap-3 rounded-2xl border border-itec-border bg-itec-surface/50 px-4 py-4 text-center sm:text-left transition-all duration-200 ease-out-expo outline-none hover:shadow-glass focus:ring-2 focus:ring-itec-sky/30 active:scale-95",
                  action.tone,
                )}
              >
                <div className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5">
                  <Icons type={action.icon} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-itec-muted group-hover/btn:text-inherit leading-tight transition-colors">
                  {action.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL: Estado del Sistema */}
        <div className="flex flex-col rounded-4xl border border-itec-border bg-itec-box p-6 shadow-glass sm:p-8 relative overflow-hidden">
          {/* Subtle Glow de fondo (diferente color) */}
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-itec-emerald/5 blur-3xl" />

          <div className="mb-6 relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Estado
            </p>
            <h3 className="text-lg font-bold text-itec-text tracking-tight mt-1">
              Sistema en línea
            </h3>
          </div>

          <div className="mt-auto space-y-3 relative z-10">
            {[
              {
                label: "API Backend",
                value: "Operativo",
                tone: "text-itec-emerald border-itec-emerald/20 bg-itec-emerald/10 shadow-[0_0_12px_rgba(16,185,129,0.1)]",
              },
              {
                label: "Firebase Auth",
                value: "Operativo",
                tone: "text-itec-emerald border-itec-emerald/20 bg-itec-emerald/10 shadow-[0_0_12px_rgba(16,185,129,0.1)]",
              },
              {
                label: "MongoDB Atlas",
                value: "Conectado",
                tone: "text-itec-sky border-itec-sky/20 bg-itec-sky/10 shadow-[0_0_12px_rgba(56,189,248,0.1)]",
              },
              {
                label: "Cache",
                value: "Sincronizado",
                tone: "text-itec-amber border-itec-amber/20 bg-itec-amber/10 shadow-[0_0_12px_rgba(245,158,11,0.1)]",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="group flex items-center justify-between rounded-[1.2rem] border border-itec-border bg-itec-surface/40 px-4 py-3 transition-colors hover:bg-itec-surface/70"
              >
                <span className="text-sm font-medium text-itec-text/90 group-hover:text-itec-text transition-colors">
                  {row.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-xl border backdrop-blur-sm",
                    row.tone,
                  )}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
