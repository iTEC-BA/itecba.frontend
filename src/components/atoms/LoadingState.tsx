import React from 'react';
import logo from '../../assets/logo.png'; // Asegúrate de que la ruta coincida con la ubicación de tu logo

export const LoadingState: React.FC = () => {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
      <div className="relative w-42 h-42 flex items-center justify-center scale-90 md:scale-100">
        
        {/* Anillo de Plasma de Energía Evolucionado */}
        <div className="absolute inset-0 rounded-full border-10 border-white/5 opacity-40 animate-[spin_12s_linear_infinite] blur-md scale-105"></div>
        <div className="absolute inset-1 rounded-full border-[6px] border-itecBlue-dark/20 opacity-30 animate-[spin_8s_ease-in-out_infinite_reverse] blur-sm scale-102"></div>
        
        {/* Anillos de Borde Punteado Co-rotatorios */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-400 opacity-40 animate-[spin_6s_linear_infinite]"></div>
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-gray-300/70 animate-[spin_4s_ease-in-out_infinite_reverse] scale-98"></div>
        
        {/* Resplandor exterior (Pulso de respiración) */}
        <div className="absolute inset-4 bg-gray-400/20 rounded-full blur-2xl animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div className="absolute inset-6 bg-itecBlue/10 rounded-full blur-xl animate-[pulse_2s_ease-in-out_infinite_reverse]"></div>
        {/* Imagen del Logo Original */}
        <img 
          src={logo} 
          alt="Cargando..." 
          className="relative z-10 w-32 h-32 object-contain rounded-full drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default LoadingState;