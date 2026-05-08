import React from "react";
import type { User } from "@context/AuthContext";
import SvgTarjeTec from "@/components/ui/icons/SvgTarjeTec";
import QRCode from "react-qr-code";

export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  const formattedLegajo = user.legajo
    ? user?.legajo.replace(/(.{7})(?!$)/g, "$1 ")
    : "PENDIENTE";

  const qrValue = user.legajo ? `ITEC-${user.legajo}` : user.email;

  return (
    <div
      className="relative overflow-hidden rounded-[1.8rem] border border-itec-border
        bg-linear-to-br from-itec-box via-itec-box2 to-itec-bg shadow-[0_20px_48px_rgba(0,0,0,0.42)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_32%)]" />
      <div className="relative overflow-hidden max-h-75 w-full">
        <SvgTarjeTec className="relative h-auto w-full" />
      </div>
      
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="w-full h-max flex flex-row justify-between items-end mb-4">
          <p className="truncate text-base md:text-3xl font-black tracking-[0.5rem] text-white/90 font-mono">
            {formattedLegajo}
          </p>
          
          {/* ACA VA EL QR - Fondo blanco necesario para el contraste del lector */}
          <div className="bg-white p-1.5 rounded-xl shadow-lg shrink-0 transition-transform hover:scale-105">
            <QRCode
              value={qrValue || "GUEST"}
              size={56} 
              bgColor="#ffffff"
              fgColor="#000000"
              level="L"
              className="h-auto max-w-full"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-itec-border bg-black/35 p-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs md:text-[14px]">
              <p className="mt-0.5 truncate text-white/60">
                {user?.email}
              </p>
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