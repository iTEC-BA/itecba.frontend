import React from 'react';
import { Icons } from '@/components/atoms/Icons';
import { CareerCard } from '../molecules/CareerCard';
import { useCareers, type CareerOption } from '../../hooks/useCareers';
import { PLANES_DB } from '../../types/correlativas'; // Lo usamos para validar disponibilidad del mapa

const CAREER_CARDS: CareerOption[] = [
  { id: 'sistemas', name: 'Sistemas de Información', icon: '💻', color: 'text-blue-400', border: 'hover:border-blue-500', shadow: 'hover:shadow-blue-500/20', bgGlow: 'bg-blue-500/20' },
  { id: 'electrica', name: 'Ingeniería Eléctrica', icon: '⚡', color: 'text-amber-400', border: 'hover:border-amber-500', shadow: 'hover:shadow-amber-500/20', bgGlow: 'bg-amber-500/20' },
  { id: 'industrial', name: 'Ingeniería Industrial', icon: '⚙️', color: 'text-yellow-400', border: 'hover:border-yellow-500', shadow: 'hover:shadow-yellow-500/20', bgGlow: 'bg-yellow-500/20' },
  { id: 'electronica', name: 'Ingeniería Electrónica', icon: '🔌', color: 'text-red-400', border: 'hover:border-red-500', shadow: 'hover:shadow-red-500/20', bgGlow: 'bg-red-500/20' },
  { id: 'civil', name: 'Ingeniería Civil', icon: '🏗️', color: 'text-orange-400', border: 'hover:border-orange-500', shadow: 'hover:shadow-orange-500/20', bgGlow: 'bg-orange-500/20' },
  { id: 'mecanica', name: 'Ingeniería Mecánica', icon: '🔧', color: 'text-gray-400', border: 'hover:border-gray-500', shadow: 'hover:shadow-gray-500/20', bgGlow: 'bg-gray-500/20' },
  { id: 'quimica', name: 'Ingeniería Química', icon: '🧪', color: 'text-purple-400', border: 'hover:border-purple-500', shadow: 'hover:shadow-purple-500/20', bgGlow: 'bg-purple-500/20' },
  { id: 'naval', name: 'Ingeniería Naval', icon: '🚢', color: 'text-cyan-400', border: 'hover:border-cyan-500', shadow: 'hover:shadow-cyan-500/20', bgGlow: 'bg-cyan-500/20' },
  { id: 'textil', name: 'Ingeniería Textil', icon: '🧵', color: 'text-pink-400', border: 'hover:border-pink-500', shadow: 'hover:shadow-pink-500/20', bgGlow: 'bg-pink-500/20' },
];

interface Props {
  onSelect: (id: string) => void;
}

export const CareerGrid: React.FC<Props> = ({ onSelect }) => {
  const { searchTerm, setSearchTerm, filteredCareers } = useCareers(CAREER_CARDS);

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-6xl mx-auto w-full">
      
      {/* Barra de Búsqueda Integrada */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-500 transition-colors">
            <Icons type="search" className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar tu carrera..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-itec-surface border border-itec-gray text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all shadow-lg"
          />
        </div>
      </div>

      {/* Grilla Bento */}
      {filteredCareers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCareers.map(career => {
            const isAvailable = !!PLANES_DB[career.id];
            return (
              <CareerCard 
                key={career.id} 
                career={career} 
                isAvailable={isAvailable} 
                onClick={onSelect} 
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-itec-surface border border-itec-gray rounded-3xl">
          <span className="text-4xl mb-4 block">🔍</span>
          <h3 className="text-white font-bold text-lg">No encontramos esa carrera</h3>
          <p className="text-gray-400 text-sm">Verificá que el nombre esté bien escrito.</p>
        </div>
      )}
    </div>
  );
};