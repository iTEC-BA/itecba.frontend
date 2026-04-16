import React from 'react';

export const BackgroundBlur: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Brillo principal superior derecho */}
      <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-itec-blue-blur/15 blur-[120px]"></div>
      
      {/* Brillo secundario inferior izquierdo */}
      <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-itec-blue-blur/10 blur-[150px]"></div>
      
      {/* Brillo sutil central para unificar */}
      <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-itec-blue-blur/5 blur-[100px]"></div>
    </div>
  );
};