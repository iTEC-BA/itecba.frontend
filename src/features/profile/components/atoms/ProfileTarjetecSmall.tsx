import React from "react";
// import tarjeTEC from "@assets/TarjeTec/iTEC-tarjeta.svg";
import { useAuth, type User } from "@context/AuthContext";
import SvgTarjeTec from "@/components/ui/icons/SvgTarjeTec";

export const ProfileTarjetecSmall: React.FC<{ user: User }> = ({ user }) => {
  const { isAuthenticated } = useAuth();

  const formattedLegajo = user.legajo
    ? user.legajo.replace(/(.{7})(?!$)/g, "$1 ")
    : "PENDIENTE";

  if (!isAuthenticated) return null;

  return (
    <div className="relative w-full h-max overflow-hidden rounded-xl border border-itec-border bg-slate-900 shadow-2xl">
      <SvgTarjeTec />
      <div className="absolute h-full top-0 flex flex-col justify-center gap-2 px-4 py-4 text-xs text-white/50">
        <div className="mt-auto">
          <p className="truncate text-xs font-bold tracking-widest">
            {formattedLegajo}
          </p>
          <p>{user.email}</p>
        </div>
        <p>
          <span className="text-itec-red-skye">Ing. </span>
          <span>{user.specialty}</span>
        </p>
      </div>
    </div>
  );
};
