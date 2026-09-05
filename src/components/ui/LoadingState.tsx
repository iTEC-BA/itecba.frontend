import React from 'react';
import logo from '../../assets/logo.png';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-itec-bg">
      <div className="relative w-42 h-42 flex items-center justify-center scale-90 md:scale-100">
        {/* Anillos 100% Flat Design, sin Blurs */}
        <div className="absolute inset-0 rounded-full border-[6px] border-white/5 animate-[spin_12s_linear_infinite] scale-105"></div>
        <div className="absolute inset-1 rounded-full border-[4px] border-itec-blue-skye/20 animate-[spin_8s_ease-in-out_infinite_reverse] scale-102"></div>
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-itec-gray/40 animate-[spin_6s_linear_infinite]"></div>
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/10 animate-[spin_4s_ease-in-out_infinite_reverse] scale-98"></div>
        
        {/* Círculos base de opacidad plana */}
        <div className="absolute inset-4 bg-white/5 rounded-full animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div className="absolute inset-6 bg-itec-blue-skye/10 rounded-full animate-[pulse_2s_ease-in-out_infinite_reverse]"></div>
        
        <img 
          src={logo} 
          alt="Cargando..." 
          className="relative z-10 w-32 h-32 object-contain rounded-full"
        />
      </div>
    </div>
  );
};

export default LoadingState;
