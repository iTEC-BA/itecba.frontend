import React from "react";
import type { User } from "@context/AuthContext";
import SvgTarjeTec from "@/components/ui/icons/SvgTarjeTec";
import { cn } from "@/lib/utils";

export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  const formattedLegajo = user.legajo ? user.legajo.replace(/(.{7})(?!$)/g, "$1 ") : "PENDIENTE";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-[1.8rem] border border-itec-border",
      "bg-gradient-to-br from-itec-box via-itec-box2 to-itec-bg shadow-[0_20px_48px_rgba(0,0,0,0.42)]"
    )}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_32%)]" />
      <SvgTarjeTec className="relative h-auto w-full" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-[0.22em] text-white/90 font-mono">
                {formattedLegajo}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/60">{user.email}</p>
              <p className="mt-1 text-xs">
                <span className="font-bold text-itec-accent">Ing. </span>
                <span className="text-white/75">{(user as any).specialty ?? "—"}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/45">Estado</p>
              <p className="text-sm font-black text-itec-emerald">Activa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
