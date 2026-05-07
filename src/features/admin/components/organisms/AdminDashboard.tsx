// src/features/admin/components/organisms/AdminDashboard.tsx
import React from "react";
import { AdminKPICard }  from "@features/admin/components/atoms/AdminKPICard";
import { GlassCard }     from "@features/profile/components/atoms/GlassCard";
import { useAdminData }  from "@features/admin/hooks/useAdminData";
import { type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { cn }            from "@/lib/utils";

interface AdminDashboardProps {
  onNavigate: (s: AdminSection) => void;
}

interface QuickAction {
  emoji:   string;
  text:    string;
  section: AdminSection;
  color:   string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { emoji: "📢", text: "Publicar Aviso",    section: "news",        color: "hover:border-itec-amber/40  hover:bg-itec-amber/5  hover:text-itec-amber"  },
  { emoji: "🏷️", text: "Nuevo Beneficio",   section: "benefits",    color: "hover:border-itec-sky/40    hover:bg-itec-sky/5    hover:text-itec-sky"    },
  { emoji: "🎁", text: "Nueva Recompensa",  section: "rewards",     color: "hover:border-itec-purple/40 hover:bg-itec-purple/5 hover:text-itec-purple" },
  { emoji: "👥", text: "Gestionar Roles",   section: "users",       color: "hover:border-itec-accent/40 hover:bg-itec-accent/5 hover:text-itec-accent" },
  { emoji: "📚", text: "Panel Académico",   section: "materias",    color: "hover:border-itec-emerald/40 hover:bg-itec-emerald/5 hover:text-itec-emerald" },
  { emoji: "🧾", text: "Ver Canjes",        section: "redemptions", color: "hover:border-orange-400/40 hover:bg-orange-400/5 hover:text-orange-400"   },
  { emoji: "🎓", text: "Tutorías",          section: "tutorias",    color: "hover:border-itec-sky/40    hover:bg-itec-sky/5    hover:text-itec-sky"    },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { stats, loading } = useAdminData();

  const kpis = [
    { label: "Usuarios Totales",   value: stats?.totalUsers    ?? 0, emoji: "👥", accent: "text-itec-sky"     },
    { label: "Beneficios Activos", value: stats?.totalRewards  ?? 0, emoji: "🏷️", accent: "text-itec-amber"   },
    { label: "Canjes Realizados",  value: stats?.totalRedeemed ?? 0, emoji: "🧾", accent: "text-itec-emerald" },
    { label: "Avisos Publicados",  value: stats?.totalNews     ?? 0, emoji: "📢", accent: "text-itec-accent"  },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Título */}
      <div>
        <h2 className="text-2xl font-black text-itec-text font-display tracking-tight mb-1">
          Dashboard
        </h2>
        <p className="text-xs text-itec-muted">
          Resumen general de la plataforma ITEC.BA
        </p>
      </div>

      {/* KPI Bento 4 cols */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <AdminKPICard
            key={k.label}
            loading={loading}
            {...k}
          />
        ))}
      </div>

      {/* Acceso rápido + Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Acceso rápido — 3 cols */}
        <GlassCard className="lg:col-span-3 p-6">
          <h3 className="text-sm font-black text-itec-text mb-4 flex items-center gap-2">
            ⚡ Acceso Rápido
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.section}
                type="button"
                onClick={() => onNavigate(action.section)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-2xl",
                  "bg-itec-surface/50 border border-itec-border",
                  "text-xs font-bold text-itec-muted text-left",
                  "transition-all duration-200 hover:scale-[1.02]",
                  action.color
                )}
              >
                <span className="text-base">{action.emoji}</span>
                <span className="truncate">{action.text}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Estadísticas rápidas — 2 cols */}
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-sm font-black text-itec-text mb-4 flex items-center gap-2">
            📈 Estado del Sistema
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "API Backend",     status: "🟢", value: "Operativo"  },
              { label: "Firebase Auth",   status: "🟢", value: "Operativo"  },
              { label: "MongoDB Atlas",   status: "🟢", value: "Conectado"  },
              { label: "Groq AI",         status: "🟡", value: "Rate limit" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-itec-border/40 last:border-0">
                <span className="text-xs text-itec-muted font-bold">{item.label}</span>
                <span className="text-xs font-bold text-itec-text flex items-center gap-1.5">
                  {item.status} {item.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-itec-border mt-4 text-right">
            Actualizado ahora
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
