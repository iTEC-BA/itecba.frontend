import React from "react";
import { Icons } from "@/components/ui/icons/Icons";

interface Props { message?: string; }

export const EmptyState: React.FC<Props> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-itec-border rounded-2xl text-center px-6 animate-in fade-in duration-300">
    <div className="w-14 h-14 rounded-2xl bg-itec-blue/20 border border-itec-blue-skye/20 text-itec-blue-skye flex items-center justify-center">
      <Icons type="search" className="w-6 h-6 opacity-70" />
    </div>
    <div>
      <p className="text-itec-text font-bold text-sm mb-1">Sin resultados</p>
      <p className="text-itec-gray text-xs max-w-xs">
        {message ?? "No encontramos cursos que coincidan con tus filtros. Probá ajustando la búsqueda."}
      </p>
    </div>
  </div>
);
