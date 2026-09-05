import React from "react";
import type { User } from '@/stores/authStore';
import SvgTarjeTec from "@/components/ui/icons/SvgTarjeTec";

export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  const formattedLegajo = user.legajo ? user?.legajo.replace(/(.{7})(?!$)/g, "$1 ") : "PENDIENTE";
  const qrValue = user.legajo ? `ITEC-${user.legajo}` : user.email;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=${encodeURIComponent(qrValue || "GUEST")}`;

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-itec-border bg-itec-box">
      <div className="relative overflow-hidden max-h-75 w-full">
        <SvgTarjeTec className="relative h-auto w-full" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="w-full h-max flex flex-row justify-between items-end mb-4">
          <p className="truncate text-base md:text-3xl font-bold tracking-[0.5rem] text-white/90 font-mono">
            {formattedLegajo}
          </p>
          <div className="bg-white p-1.5 rounded-xl shrink-0 transition-transform hover:scale-105">
            <img src={qrSrc} alt="Código QR" width={56} height={56} className="h-auto max-w-full" />
          </div>
        </div>
        <div className="rounded-xl border border-itec-border bg-itec-surface p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs md:text-[14px]">
              <p className="mt-0.5 truncate text-white/60">{user?.email}</p>
              <p className="mt-1">
                <span className="font-bold text-itec-accent">Ing. </span>
                <span className="text-white/75">{user?.specialty ?? "—"}</span>
              </p>
            </div>
            <div className="rounded-xl border border-itec-border bg-itec-card px-3 py-2 flex gap-1 text-[8px] md:text-xs uppercase">
              <h5>Rol:</h5>
              <p className="font-bold text-itec-groups">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
