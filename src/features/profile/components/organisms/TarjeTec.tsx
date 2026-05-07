import React from "react";
import type { User } from "@context/AuthContext";
import SvgTarjeTec from "@/components/ui/icons/SvgTarjeTec";
export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  const formattedLegajo = user.legajo
    ? user.legajo.replace(/(.{7})(?!$)/g, "$1 ")
    : "PENDIENTE";
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group">
      <SvgTarjeTec className="w-full h-auto" />
      <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5 pt-3">
        <div className="mt-auto space-y-0.5">
          <p className="text-white/90 text-sm font-black tracking-[0.2em] font-mono">
            {formattedLegajo}
          </p>
          <p className="text-white/55 text-xs truncate">{user.email}</p>
          <p className="text-xs">
            <span className="text-red-400 font-bold">Ing. </span>
            <span className="text-white/70">{user.specialty ?? "—"}</span>
          </p>
        </div>
      </div>
      <div className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.legajo || "SinLegajo")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-white/50 hover:text-white/80 transition-colors"
        >
          Ver QR ↗
        </a>
      </div>
    </div>
  );
};
