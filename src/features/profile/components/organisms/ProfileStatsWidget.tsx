import React from "react";
import { useAuth } from "@context/AuthContext";
import { StatMini } from "@features/profile/components/atoms/StatMini";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@features/profile/services/profileService";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";

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
      icon: "⭐",
      sublabel: "Saldo disponible",
    },
    {
      label: "Beneficios",
      value: benefits.length,
      accent: "text-itec-emerald",
      icon: "🎁",
      sublabel: "Activos en catálogo",
    },
    {
      label: "Estado",
      value: user?.role === "admin" ? "Admin" : "Activo",
      accent: user?.role === "admin" ? "text-itec-accent" : "text-itec-emerald",
      icon: "✅",
      sublabel: "Cuenta verificada",
    },
    {
      label: "Carreras",
      value: careers.length || 0,
      accent: "text-itec-sky",
      icon: "🎓",
      sublabel: isDoubleMajor ? "Doble trayectoria" : yearsIn ? `${yearsIn}° año` : "Sin datos",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <StatMini key={s.label} {...s} />
      ))}
    </div>
  );
};
