import React from "react";

export const CalendarSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Temporizador Skeleton */}
      <div className="h-[120px] bg-white/5 border border-white/10 rounded-xl mb-6"></div>
      
      {/* Grid de Eventos Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-3 bg-itec-card border border-white/5 rounded-xl p-4">
            {/* Fecha Icono */}
            <div className="w-14 h-14 rounded-xl bg-white/10 shrink-0"></div>
            
            {/* Textos */}
            <div className="flex-1 space-y-2.5 py-1">
              {/* Badge */}
              <div className="h-3 w-16 bg-white/10 rounded-full"></div>
              {/* Título */}
              <div className="h-4 w-3/4 bg-white/10 rounded"></div>
              {/* Subtítulo */}
              <div className="h-3 w-1/2 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
