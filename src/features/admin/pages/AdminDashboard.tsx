import React, { useMemo } from "react";
// useNavigate not required here
import { useAdminData } from "@features/admin/hooks/useAdminData";
import { type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { Card } from "@components/atoms/Card";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Ticket,
  Star,
  BellRing,
  MapPin,
  MessageSquare,
  FileWarning,
  Server,
  Video,
  Activity,
  PieChart
} from "lucide-react";

interface AdminDashboardProps {
  onNavigate: (s: AdminSection) => void;
}

const QUICK_ACTIONS = [
  { icon: BellRing, text: "Publicar aviso", section: "news" as AdminSection, tone: "text-itec-amber hover:bg-itec-amber/10 hover:border-itec-amber/40" },
  { icon: Star, text: "Nuevo ítem", section: "benefits" as AdminSection, tone: "text-itec-sky hover:bg-itec-sky/10 hover:border-itec-sky/40" },
  { icon: Users, text: "Gestionar roles", section: "users" as AdminSection, tone: "text-itec-red hover:bg-itec-red/10 hover:border-itec-red/40" },
  { icon: Ticket, text: "Ver canjes", section: "redemptions" as AdminSection, tone: "text-itec-emerald hover:bg-itec-emerald/10 hover:border-itec-emerald/40" },
  { icon: Video, text: "Tutorías", section: "tutorias" as AdminSection, tone: "text-itec-blue-skye hover:bg-itec-blue-skye/10 hover:border-itec-blue-skye/40" },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { stats, loading } = useAdminData();

  const kpis = [
    { label: "Visitas a la Web", value: stats.webVisits.toLocaleString(), Icon: TrendingUp, accent: "text-itec-sky", bg: "bg-itec-sky/10", border: "border-itec-sky/20" },
    { label: "Usuarios Registrados", value: (stats.totalUsers ?? 0).toLocaleString(), Icon: Users, accent: "text-itec-emerald", bg: "bg-itec-emerald/10", border: "border-itec-emerald/20" },
    { label: "Canjes Realizados", value: stats.totalRedeemed, Icon: Ticket, accent: "text-itec-emerald", bg: "bg-itec-emerald/10", border: "border-itec-emerald/20" },
    { label: "Beneficios Activos", value: stats.totalRewards, Icon: Star, accent: "text-itec-amber", bg: "bg-itec-amber/10", border: "border-itec-amber/20" },
  ];

  const secondaryKpis = [
    { label: "Aulas", value: stats.classrooms, Icon: MapPin, accent: "text-itec-sky" },
    { label: "Foro", value: stats.questions, Icon: MessageSquare, accent: "text-itec-purple" },
    { label: "Avisos", value: stats.totalNews, Icon: BellRing, accent: "text-itec-amber" },
    { label: "Admins", value: stats.totalAdmins, Icon: ShieldCheck, accent: "text-itec-text" },
  ];

  // Datos simulados para el gráfico de barras de visitas de los últimos 7 días
  const weeklyVisits = useMemo(() => [1200, 1850, 1420, 2100, 2800, 3200, 2850], []);
  const maxVisit = Math.max(...weeklyVisits);
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Datos para las barras de estado del contenido
  const maxContent = Math.max(stats.classrooms, stats.questions, stats.totalRewards, stats.totalNews, 1);

  return (
    <div className="flex flex-col gap-6 animate-fade-up pb-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Dashboard</p>
        <h2 className="text-3xl font-bold tracking-tight text-itec-text font-display sm:text-4xl">
          Centro de control
        </h2>
        <p className="max-w-2xl text-sm text-itec-muted leading-relaxed">
          Vista general de métricas y acceso rápido a los módulos de administración de la plataforma.
        </p>
      </div>

      {/* Tarjetas KPI Principales */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="flex flex-col gap-4 p-5 hover:bg-white/[0.02] transition-colors duration-300">
            <div className="flex items-start justify-between">
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl border", kpi.bg, kpi.border)}>
                <kpi.Icon className={cn("w-5 h-5", kpi.accent)} />
              </div>
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-20 bg-white/5 rounded animate-pulse mb-1" />
              ) : (
                <h3 className={cn("text-2xl font-bold tracking-tight", kpi.accent)}>{kpi.value}</h3>
              )}
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted mt-1.5">{kpi.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráficos y Métricas Secundarias */}
      <div className="grid gap-4 lg:grid-cols-3">
        
        {/* Gráfico de Barras: Visitas de la semana */}
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-itec-text flex items-center gap-2">
                <Activity className="w-4 h-4 text-itec-sky" />
                Tráfico Semanal
              </h3>
              <p className="text-[10px] text-itec-muted uppercase tracking-widest mt-1">Últimos 7 días</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-itec-text">{stats.webVisits.toLocaleString()}</p>
              <p className="text-[10px] text-itec-emerald font-bold uppercase tracking-widest">↑ +12%</p>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-40 gap-2 mt-auto">
            {weeklyVisits.map((val, i) => {
              const heightPct = Math.max((val / maxVisit) * 100, 5);
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full flex justify-center relative h-full items-end">
                    <div 
                      className="w-full max-w-[40px] bg-itec-sky/30 rounded-t-md hover:bg-itec-sky transition-colors relative"
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-itec-box border border-itec-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {val}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-itec-muted">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Gráfico de Barras Horizontales: Distribución */}
        <Card className="p-5 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-itec-text flex items-center gap-2">
              <PieChart className="w-4 h-4 text-itec-purple" />
              Distribución de Contenido
            </h3>
            <p className="text-[10px] text-itec-muted uppercase tracking-widest mt-1">Volumen por módulo</p>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            {[
              { label: "Foro (Preguntas)", value: stats.questions, color: "bg-itec-purple" },
              { label: "Aulas Registradas", value: stats.classrooms, color: "bg-itec-sky" },
              { label: "Beneficios Act.", value: stats.totalRewards, color: "bg-itec-amber" },
              { label: "Avisos Globales", value: stats.totalNews, color: "bg-itec-emerald" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-itec-text/80">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", item.color)} 
                    style={{ width: `${Math.max((item.value / maxContent) * 100, 2)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Alertas y Estado del Sistema */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryKpis.map((kpi, idx) => (
          <Card key={idx} className="p-4 flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-white/5", kpi.accent)}>
              <kpi.Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{kpi.value}</p>
              <p className="text-[10px] text-itec-muted uppercase tracking-widest mt-0.5">{kpi.label}</p>
            </div>
          </Card>
        ))}

        <Card className="p-4 flex items-center gap-3 border-itec-red/20 bg-itec-red/5">
          <div className="p-2 rounded-lg bg-itec-red/20 text-itec-red relative">
             {(stats.reportedVideos > 0 || stats.reportedFiles > 0) && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-itec-red animate-ping" />
             )}
            <FileWarning className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-itec-red">{stats.reportedVideos + stats.reportedFiles}</p>
            <p className="text-[10px] text-itec-red/70 uppercase tracking-widest mt-0.5">Reportes Pend.</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-itec-emerald/10 text-itec-emerald">
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-none text-itec-emerald truncate">{stats.serverStatus}</p>
            <p className="text-[10px] text-itec-muted uppercase tracking-widest mt-1">Servidor</p>
          </div>
        </Card>
      </div>

      {/* Grid Acciones Rápidas */}
      <Card className="relative overflow-hidden group mt-2">
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-itec-sky/5 blur-3xl transition-all duration-700 group-hover:bg-itec-sky/10" />

        <div className="mb-5 flex flex-col gap-1 relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-itec-muted">
            Acciones rápidas
          </p>
          <h3 className="text-base font-bold text-itec-text">
            Módulos del panel
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 relative z-10">
          {QUICK_ACTIONS.map((a, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(a.section)}
              className={cn(
                "flex items-center justify-center flex-col gap-2.5 rounded-xl border border-itec-border bg-itec-surface p-4",
                "text-xs font-semibold transition-all duration-200 active:scale-95",
                a.tone
              )}
            >
              <a.icon className="w-6 h-6 shrink-0" />
              <span className="leading-snug text-center">{a.text}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};