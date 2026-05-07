import React from 'react';

export const ProfileStats = ({ points = 0, rank = "Novato" }: { points?: number, rank?: string }) => (
  <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-[2rem] border border-white/5 flex flex-col items-center">
      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Puntos i-TEC</span>
      <span className="text-2xl font-bold text-white mt-1">{points}</span>
    </div>
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-[2rem] border border-white/5 flex flex-col items-center">
      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rango Global</span>
      <span className="text-xl font-bold text-itec-red mt-1">{rank}</span>
    </div>
  </div>
);
