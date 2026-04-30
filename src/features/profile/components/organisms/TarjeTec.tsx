import React from "react";
import { Icons } from "@components/ui/Icons";
import logoItec from "@assets/logo.png";
import type { User } from "@context/AuthContext";

export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="w-full max-w-2xl mx-auto aspect-[1.6/1] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl md:rounded-3xl p-5 sm:p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden flex flex-col justify-around group cursor-pointer transition-transform hover:-translate-y-1">
      
      {/* Brillo dinámico estilo Apple Card */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out z-20 pointer-events-none"></div>

      {/* Holograma de fondo */}
      <div className="absolute -right-8 -bottom-8 sm:-right-16 sm:-bottom-16 opacity-[0.04] text-sky-400 w-64 h-64 sm:w-96 sm:h-96 pointer-events-none transform rotate-12 z-0">
        <Icons type="hologram" />
      </div>

      {/* Top Card */}
      <div className="flex justify-between items-center relative z-10">
        <div className="w-8 h-8 sm:w-10 sm:h-10 text-itec-textrotate-90 opacity-50">
          <Icons type="nfc" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={logoItec}
            alt="Logo"
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain drop-shadow-md"
          />
          <span className="text-xl sm:text-3xl font-black text-itec-texttracking-widest drop-shadow-lg">
            TARJETEC
          </span>
        </div>
      </div>

      {/* Stickers Decorativos */}
      <div className="flex flex-wrap gap-2 sm:gap-3 my-2 sm:my-0 relative z-10">
        <span className="bg-sky-500/10 text-sky-400 text-[8px] sm:text-[10px] font-bold uppercase py-1 px-2 sm:px-3 rounded-md border border-sky-500/20">
          UTN.BA
        </span>
        <span className="bg-emerald-500/10 text-emerald-400 text-[8px] sm:text-[10px] font-bold uppercase py-1 px-2 sm:px-3 rounded-md border border-emerald-500/20">
          TECH
        </span>
        <span className="bg-indigo-500/10 text-indigo-400 text-[8px] sm:text-[10px] font-bold uppercase py-1 px-2 sm:px-3 rounded-md border border-indigo-500/20">
          {user.specialty || 'Ingeniería'}
        </span>
      </div>

      {/* Bottom Card */}
      <div className="relative z-10 flex justify-between items-end mt-2 sm:mt-4">
        <div className="min-w-0 pr-2">
          {/* Número de Legajo formateado */}
          <p className="font-mono text-lg sm:text-2xl md:text-3xl text-slate-200 tracking-widest sm:tracking-[0.25em] mb-1 sm:mb-2 drop-shadow-md truncate">
            {user.legajo ? user.legajo.replace(/(.{7})(?!$)/g, "$1 ") : 'PENDIENTE'}
          </p>
          <div className="flex flex-col">
            <p className="text-[8px] sm:text-[10px] text-sky-400 uppercase tracking-widest sm:tracking-[0.4em] font-bold mb-0.5">
              Estudiante Regular
            </p>
            <p className="text-xs sm:text-[15px] text-itec-textuppercase font-bold drop-shadow-md truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        {/* Código QR usando tu lógica original pero con estilos integrados */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-lg sm:rounded-xl p-1.5 shrink-0 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-4 border-slate-900/50">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.legajo || 'SinLegajo')}`}
            alt="QR de acceso"
            className="w-full h-full rounded-sm"
          />
        </div>
      </div>
    </div>
  );
};