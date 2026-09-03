import React from "react";
import { useAdminData } from "@features/admin/hooks/useAdminData";
import { type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { Icons } from "@components/ui/icons/Icons";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  onNavigate: (s: AdminSection) => void;
}

const QUICK_ACTIONS = [
  { icon: "verified", text: "Reportes", section: "moderation" as AdminSection, color: "text-rose-400", border: "hover:border-rose-400/30" },
  { icon: "bell", text: "Avisos", section: "news" as AdminSection, color: "text-amber-400", border: "hover:border-amber-400/30" },
  { icon: "gift", text: "Beneficios", section: "benefits" as AdminSection, color: "text-itec-sky", border: "hover:border-itec-sky/30" },
  { icon: "users", text: "Usuarios", section: "users" as AdminSection, color: "text-emerald-400", border: "hover:border-emerald-400/30" },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { stats, loading } = useAdminData();

  const kpis = [
    { label: "Visitas Web", value: stats.webVisits.toLocaleString(), icon: "chart-line", bg: "bg-itec-sky/10", border: "border-itec-sky/20", color: "text-itec-sky" },
    { label: "Usuarios", value: (stats.totalUsers ?? 0).toLocaleString(), icon: "users", bg: "bg-emerald-500/10", border: "border-emerald-500/20", color: "text-emerald-400" },
    { label: "Canjes", value: stats.totalRedeemed.toLocaleString(), icon: "ticket", bg: "bg-purple-500/10", border: "border-purple-500/20", color: "text-purple-400" },
    { label: "Beneficios", value: stats.totalRewards.toLocaleString(), icon: "star", bg: "bg-amber-500/10", border: "border-amber-500/20", color: "text-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">Centro de Control</h2>
        <p className="text-xs text-itec-muted">Vista general de métricas operativas del sistema.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={cn("p-4 flex flex-col items-start rounded-xl border bg-itec-box", kpi.border)}>
            <div className="flex items-center gap-2 mb-2">
              <Icons type={kpi.icon as any} className={cn("w-4 h-4", kpi.color)} />
              <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", kpi.color)}>{kpi.label}</span>
            </div>
            {loading ? (
              <div className="h-6 w-16 bg-white/10 rounded animate-pulse" />
            ) : (
              <p className="text-lg font-bold text-white font-mono">{kpi.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border border-white/5 rounded-xl bg-itec-box flex flex-col">
          <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest text-itec-muted">Estado del Sistema</h3>
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
              <span className="text-[11px] text-itec-muted font-bold uppercase tracking-widest">API Server</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">{stats.serverStatus}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
              <span className="text-[11px] text-itec-muted font-bold uppercase tracking-widest">Base de Datos</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">{stats.dbStatus}</span>
            </div>
          </div>
        </div>

        <div className="p-5 border border-white/5 rounded-xl bg-itec-box flex flex-col">
          <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest text-itec-muted">Reportes Pendientes</h3>
          <div className="w-full flex items-center gap-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 h-full">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <Icons type="document" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-rose-400 font-mono leading-none">{stats.reportedVideos + stats.reportedFiles}</p>
              <p className="text-[10px] text-rose-400/70 font-bold uppercase tracking-widest mt-1">Requieren atención</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-itec-muted mb-3">Accesos Directos</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(a.section)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-white/5 bg-itec-box transition-colors hover:bg-white/[0.02]",
                a.border
              )}
            >
              <Icons type={a.icon as any} className={cn("w-5 h-5", a.color)} />
              <span className="text-[11px] font-bold text-itec-text uppercase tracking-wider">{a.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
