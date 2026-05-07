import React from "react";
import { cn } from "@/lib/utils";

interface ProfileCoverBannerProps {
  onEdit?: () => void;
  className?: string;
}

/**
 * Banner de portada del perfil (cover).
 * Diseño: 3 celdas degradadas + overlay + botones de acción.
 */
export const ProfileCoverBanner: React.FC<ProfileCoverBannerProps> = ({
  onEdit,
  className,
}) => (
  <div
    className={cn(
      "relative h-44 sm:h-52 overflow-hidden rounded-t-[2rem]",
      className
    )}
  >
    {/* celdas de fondo */}
    <div className="absolute inset-0 grid grid-cols-3 gap-0.5">
      <div className="bg-gradient-to-br from-[#1a2a4a] to-[#2a1f4a]" />
      <div className="bg-gradient-to-br from-[#0a1828] to-[#1a2030]" />
      <div className="bg-gradient-to-br from-[#1f0a28] to-[#2a1535]" />
    </div>
    {/* overlay bottom fade */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-itec-bg/70" />
    {/* acciones */}
    <div className="absolute top-3 right-3 flex gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-bold text-white/80 backdrop-blur-sm transition hover:bg-black/60"
        >
          <span className="ti ti-pencil text-sm" />
          Editar portada
        </button>
      )}
      <button className="flex items-center justify-center rounded-xl border border-white/15 bg-black/45 p-1.5 text-white/80 backdrop-blur-sm transition hover:bg-black/60">
        <span className="ti ti-camera text-sm" />
      </button>
    </div>
  </div>
);
