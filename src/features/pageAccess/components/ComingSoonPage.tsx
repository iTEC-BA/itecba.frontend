// src/features/pageAccess/components/ComingSoonPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface ComingSoonPageProps {
  label?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Clock className="w-7 h-7 text-itec-muted" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-itec-text">
          {label ? `${label} está en camino` : "Próximamente"}
        </h1>
        <p className="text-sm text-itec-muted mt-1 max-w-sm">
          Estamos terminando esta sección. Todavía no está disponible, pero ya casi.
        </p>
      </div>
      <Link
        to="/"
        className="text-xs font-bold uppercase tracking-widest text-itec-text/80 hover:text-itec-text transition-colors mt-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
};
