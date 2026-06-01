// src/features/admin/components/organisms/AdminDashboard.tsx
// Dashboard principal del panel de administración.
// La gestión de "Materias" y "Videos Rotos" vive en modales dentro de
// GroupsPage y CoursesPage respectivamente, por eso no aparecen en
// AdminSection ni en las acciones rápidas de este dashboard.
import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminKPICard } from "@features/admin/components/atoms/AdminKPICard";
import { useAdminData } from "@features/admin/hooks/useAdminData";
import { type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

type IconType = React.ComponentProps<typeof Icons>["type"];

interface AdminDashboardProps {
  onNavigate: (s: AdminSection) => void;
}

// Solo secciones que existen en AdminSection — sin "materias"
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

// Acciones rápidas que navegan a páginas (fuera del admin panel)
const EXTERNAL_QUICK_ACTIONS: Array<{
  icon: IconType;
  text: string;
  route: string;
  tone: string;
}> = [
  {
    icon: "book",
    text: "Gestionar materias",
    route: "/grupos",
    tone: "hover:border-itec-emerald/40 hover:bg-itec-emerald/10 hover:text-itec-emerald text-itec-emerald/80",
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
}) => {
  const { stats, loading } = useAdminData();
  const navigate = useNavigate();

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
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-itec-sky/5 blur-3xl transition-all duration-700 group-hover:bg-itec-sky/10" />

          <div className="mb-5 flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-itec-muted">
              Acciones rápidas
            </p>
            <h3 className="text-base font-bold text-itec-text">
              Módulos del panel
            </h3>
          </div>

          {/* Acciones del panel admin */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.section}
                onClick={() => onNavigate(a.section)}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl border border-itec-border bg-itec-surface px-3.5 py-3",
                  "text-xs font-semibold transition-all duration-200 active:scale-95",
                  a.tone,
                )}
              >
                <Icons type={a.icon} className="h-4 w-4 shrink-0" />
                <span className="leading-snug text-left">{a.text}</span>
              </button>
            ))}

            {/* Acciones externas (navegan a otras páginas) */}
            {EXTERNAL_QUICK_ACTIONS.map((a) => (
              <button
                key={a.route}
                onClick={() => navigate(a.route)}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl border border-itec-border bg-itec-surface px-3.5 py-3",
                  "text-xs font-semibold transition-all duration-200 active:scale-95",
                  a.tone,
                )}
              >
                <Icons type={a.icon} className="h-4 w-4 shrink-0" />
                <span className="leading-snug text-left">{a.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL: Estadísticas rápidas */}
        <div className="rounded-4xl border border-itec-border bg-itec-box p-6 shadow-glass sm:p-8">
          <div className="mb-5 flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-itec-muted">
              Estado
            </p>
            <h3 className="text-base font-bold text-itec-text">
              Resumen de la plataforma
            </h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-2xl bg-white/5 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="flex items-center justify-between rounded-2xl bg-itec-surface px-4 py-2.5 border border-itec-border/50"
                >
                  <span className="text-xs text-itec-muted">{k.label}</span>
                  <span className={cn("text-sm font-bold", k.accent)}>
                    {k.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
