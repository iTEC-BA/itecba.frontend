import React from "react";
import { Icons } from "@/components/ui/icons/Icons";

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, disabled, placeholder }) => (
  <div className="relative group flex-1">
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-itec-gray group-focus-within:text-itec-blue-skye transition-colors">
      <Icons type="search" className="w-4 h-4" />
    </div>
    <input
      type="text"
      disabled={disabled}
      placeholder={placeholder ?? "Buscar cursos..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/[0.04] border border-white/8 text-itec-text rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-itec-blue-skye/60 focus:ring-2 focus:ring-itec-blue-skye/10 transition-all placeholder:text-itec-gray/60 disabled:opacity-40 hover:border-white/15"
    />
  </div>
);
