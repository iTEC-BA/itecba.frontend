import React from "react";
import { Icons } from "../../../../components/atoms/Icons";
import logoItec from "../../../../assets/logo.png";
import type { User } from "../../../../context/AuthContext";

export const TarjeTec: React.FC<{ user: User }> = ({ user }) => {
  return (
    // CAMBIOS CLAVE AQUÍ: w-full, max-w-2xl, aspect-[1.6/1] y font sizes responsive (sm:, md:)
    <div className="w-full max-w-2xl mx-auto aspect-[1.6/1] bg-gradient-to-br from-[#2a2a2a] via-[#111] to-[#000] rounded-2xl md:rounded-3xl p-5 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-[#444] relative overflow-hidden flex flex-col justify-around group cursor-pointer transition-transform hover:-translate-y-2">
      
      {/* Brillo dinámico estilo Apple Card */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>

      {/* Holograma de fondo */}
      <div className="absolute -right-8 -bottom-8 sm:-right-16 sm:-bottom-16 opacity-[0.03] text-white w-64 h-64 sm:w-96 sm:h-96 pointer-events-none transform rotate-12">
        <Icons type="hologram" />
      </div>

      {/* Top Card */}
      <div className="flex justify-between items-center relative z-10">
        <div className="w-8 h-8 sm:w-10 sm:h-10 text-white rotate-90 opacity-80">
          <Icons type="nfc" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={logoItec}
            alt="Logo"
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
          />
          <span className="text-xl sm:text-3xl font-bold text-white tracking-widest drop-shadow-lg">
            TARJETEC
          </span>
        </div>
      </div>

      {/* Stickers Decorativos */}
      <div className="flex flex-wrap gap-2 sm:gap-3 my-2 sm:my-0 relative z-10">
        <div className="opacity-80 shadow-xl">
          <span className="bg-blue-500 text-white text-[8px] sm:text-[10px] font-bold uppercase py-1 px-2 sm:px-3 rounded-full border border-white/20 shadow-[0_4px_10px_rgba(0,64,147,0.5)]">
            UTN.BA
          </span>
        </div>
        <div className="opacity-80 shadow-xl">
          <span className="bg-orange-500 text-white text-[8px] sm:text-[10px] font-bold uppercase py-1 px-2 sm:px-3 rounded-full border border-white/20 shadow-[0_4px_10px_rgba(0,64,147,0.5)]">
            TECH
          </span>
        </div>
        <div className="opacity-80 shadow-xl">
          <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold uppercase py-1 px-2 sm:px-3 rounded-full border border-white/20 shadow-[0_4px_10px_rgba(0,64,147,0.5)] truncate max-w-[100px] sm:max-w-none inline-block align-bottom">
            {user.specialty}
          </span>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="relative z-10 flex justify-between items-end mt-2 sm:mt-4">
        <div className="min-w-0 pr-2">
          {/* El número de teléfono / legajo se adapta */}
          <p className="font-mono text-lg sm:text-2xl md:text-3xl text-gray-200 tracking-widest sm:tracking-[0.25em] mb-1 sm:mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
            {user.phone ? user.phone.replace(/(.{5})(?!$)/g, "$1 ") : ''}
          </p>
          <div className="flex flex-col">
            <p className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest sm:tracking-[0.4em] font-bold mb-0.5">
              Estudiante
            </p>
            <p className="text-xs sm:text-[15px] text-white uppercase font-bold drop-shadow-md truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        {/* Código QR responsive */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-25 md:h-25 bg-white rounded-lg sm:rounded-xl p-1 sm:p-1.5 shrink-0 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-2 border-white/20">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user.legajo || 'SinLegajo')}`}
            alt="QR"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};