import React from "react";

export const CourseLoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-500">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-2 border-itec-gray/30 rounded-full" />
      <div className="absolute inset-0 border-2 border-t-itec-blue-skye rounded-full animate-spin" />
    </div>
    <p className="text-itec-gray text-xs font-bold uppercase tracking-widest">Cargando cursos...</p>
  </div>
);
