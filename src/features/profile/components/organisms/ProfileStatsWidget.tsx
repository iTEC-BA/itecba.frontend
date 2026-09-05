import React from "react";
import { useAuth } from "@context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@features/profile/services/profileService";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { Gift, ShieldCheck, BookOpen, Star } from "lucide-react";

export const ProfileStatsWidget: React.FC = () => {
  const { user } = useAuth();
  const { careers, isDoubleMajor, startYear } = useMultiCareer();

  const { data: benefits = [] } = useQuery({
    queryKey: ["benefits", "all"],
    queryFn: () => profileService.getBenefits(),
    staleTime: 5 * 60 * 1000,
  });

  const currentYear = new Date().getFullYear();
  const yearsIn = startYear ? currentYear - startYear + 1 : null;

  const stats = [
    { label: "Puntos iTEC", value: (user?.points ?? 0).toLocaleString("es-AR"), accent: "text-itec-amber", bgAccent: "bg-itec-amber/10", borderAccent: "border-itec-amber/30", icon: Star, sublabel: "Saldo actual" },
    { label: "Beneficios", value: benefits.length, accent: "text-itec-red-skye", bgAccent: "bg-itec-red/10", borderAccent: "border-itec-red/30", icon: Gift, sublabel: "Catálogo activo" },
    { label: "Estado", value: user?.role === "admin" ? "Admin" : "Activo", accent: user?.role === "admin" ? "text-itec-accent" : "text-emerald-400", bgAccent: user?.role === "admin" ? "bg-itec-accent/10" : "bg-emerald-500/10", borderAccent: user?.role === "admin" ? "border-itec-accent/30" : "border-emerald-500/30", icon: ShieldCheck, sublabel: "Cuenta verificada" },
    { label: "Carreras", value: careers.length || 0, accent: "text-itec-purple", bgAccent: "bg-itec-purple/10", borderAccent: "border-itec-purple/30", icon: BookOpen, sublabel: isDoubleMajor ? "Doble trayectoria" : yearsIn ? `${yearsIn}° año` : "Sin datos" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-2">
      {stats.map((s) => <StatMini key={s.label} {...s} />)}
    </div>
  );
};

interface StatMiniProps {
  label: string;
  value: string | number;
  accent: string;
  bgAccent: string;
  borderAccent: string;
  icon: React.ElementType;
  loading?: boolean;
  sublabel?: string;
}

const StatMini: React.FC<StatMiniProps> = ({ label, value, accent, bgAccent, borderAccent, icon: Icon, loading = false, sublabel }) => (
  <div className={`group relative overflow-hidden rounded-2xl border border-itec-border bg-itec-box p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:${borderAccent}`}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">{label}</span>
      <span className={`flex items-center justify-center w-8 h-8 rounded-xl border ${bgAccent} ${borderAccent} ${accent}`}>
        <Icon className="w-4 h-4" />
      </span>
    </div>
    {loading ? (
      <div className="h-8 w-20 rounded-xl bg-itec-surface animate-pulse" />
    ) : (
      <div className="flex flex-col">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight ${accent}`}>{value}</span>
        {sublabel && <span className="text-[11px] text-itec-gray mt-1">{sublabel}</span>}
      </div>
    )}
  </div>
);
