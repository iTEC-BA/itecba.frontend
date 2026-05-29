import React from "react";
import { useAuth } from "@context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@features/profile/services/profileService";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { Icons } from "@components/ui/icons/Icons";

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
    {
      label: "Puntos TarjeTEC",
      value: (user?.points ?? 0).toLocaleString("es-AR"),
      accent: "text-itec-amber",
     icon: "gift",
      sublabel: "Saldo disponible",
    },
    {
      label: "Beneficios",
      value: benefits.length,
      accent: "text-itec-emerald",
      icon: "gift",
      sublabel: "Activos en catálogo",
    },
    {
      label: "Estado",
      value: user?.role === "admin" ? "Admin" : "Activo",
      accent: user?.role === "admin" ? "text-itec-accent" : "text-itec-emerald",
      icon: "check",
      sublabel: "Cuenta verificada",
    },
    {
      label: "Carreras",
      value: careers.length || 0,
      accent: "text-itec-sky",
      icon: "book",
      sublabel: isDoubleMajor
        ? "Doble trayectoria"
        : yearsIn
          ? `${yearsIn}° año`
          : "Sin datos",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-8">
      {stats.map((s) => (
        <StatMini key={s.label} {...s} />
      ))}
    </div>
  );
};

interface StatMiniProps {
  label: string;
  value: string | number;
  accent?: string;
  icon?: string;
  loading?: boolean;
  sublabel?: string;
  onClick?: () => void;
}

const StatMini: React.FC<StatMiniProps> = ({
  label,
  value,
  accent = "text-itec-sky",
  icon,
  loading = false,
  sublabel,
  onClick,
}) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={
      `group relative overflow-hidden rounded-3xl border border-itec-border ` +
      `bg-linear-to-br from-itec-box/90 to-itec-box/80 backdrop-blur-xl ` +
      `p-4 flex flex-col gap-2 transition-all duration-300 ` +
      `hover:-translate-y-0.5 hover:border-itec-border/70 hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)]` +
      (onClick ? " cursor-pointer" : "")
    }
  >
    <div className="flex items-center justify-between">
      <span className="text-[8px] font-semibold uppercase tracking-widest text-itec-muted">
        {label}
      </span>
      {icon && (
        <span className="text-base opacity-60 transition-transform group-hover:scale-110">
          <Icons type={icon} className="size-4" />
        </span>
      )}
    </div>
    {loading ? (
      <div className="h-8 w-20 rounded-xl bg-itec-border/50 animate-pulse" />
    ) : (
      <span className={`text-base font-bold leading-none lowercase ${accent}`}>
        {value}
      </span>
    )}
    {sublabel && (
      <span className="text-[10px] text-itec-muted">{sublabel}</span>
    )}
  </div>
);
