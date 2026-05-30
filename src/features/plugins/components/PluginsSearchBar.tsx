import React from "react";
import { Icons } from "@components/ui/icons/Icons";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const PluginsSearchBar: React.FC<Props> = ({ value, onChange }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <div className="w-4 h-4 text-[#5a6475]">
        <Icons type="search" className="w-full h-full" />
      </div>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar herramienta, materia o link..."
      // font-size 16px evita que iOS haga zoom al enfocar el input
      style={{ fontSize: "16px" }}
      className="
        w-full bg-itec-card border border-white/7 rounded-xl
        pl-10 pr-10 py-2.5 text-itec-text placeholder-[#5a6475]
        focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10
        transition-colors
      "
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute inset-y-0 right-3 flex items-center"
        aria-label="Limpiar búsqueda"
      >
        <div className="w-4 h-4 text-[#5a6475] hover:text-itec-text transition-colors">
          <Icons type="close" className="w-full h-full" />
        </div>
      </button>
    )}
  </div>
);