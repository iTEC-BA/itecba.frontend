import React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from '../molecules/CourseCard';
import { Icons } from '@/components/atoms/Icons';
import type { CourseData } from '../../services/coursesService';

export interface CourseWithLocalProgress extends CourseData {
  localProgress: number;
}

interface Props {
  courses: CourseWithLocalProgress[];
  isLoading: boolean;
  isAdmin: boolean;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const CourseGrid: React.FC<Props> = ({ courses, isLoading, isAdmin, onDelete }) => {
  const safeCourses = courses || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
           <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Cargando material...</h3>
        <p className="text-slate-500 text-sm">Preparando el reproductor</p>
      </div>
    );
  }

  if (safeCourses.length === 0) {
    return (
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/5 border-dashed rounded-3xl p-12 text-center shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/10 rounded-full pointer-events-none transition-all duration-700 group-hover:bg-sky-500/10"></div>
        
        <div className="w-20 h-20 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-sky-400 mb-6 shadow-inner relative z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
          <Icons type="search" className="w-8 h-8 opacity-50" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2 relative z-10 tracking-tight">Cinta vacía</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto relative z-10">
          No encontramos cursos que coincidan con tus filtros. Probá ajustando la búsqueda o cambiando de materia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {safeCourses.map((curso) => {
        const cursoId = curso.id || (curso as any)._id;
        // Hardcoded rules del legacy
        const isOficial = curso.categoria === 'Oficial' || cursoId.startsWith('seminario') || cursoId.startsWith('analisis');
        const isSystemCourse = isOficial || cursoId.startsWith('arquitectura') || cursoId.startsWith('podcast');

        return (
          <div key={cursoId} className="relative group h-full">
            <Link to={`/cursos/${cursoId}`} className="block h-full cursor-pointer">
              <CourseCard 
                title={curso.title} 
                description={curso.description || ''} 
                progress={curso.localProgress} 
                imageUrl={curso.imageUrl}
                isOficial={isOficial} 
              />
            </Link>

            {isAdmin && !isSystemCourse && (
              <button 
                onClick={(e) => onDelete(e, cursoId)}
                className="cursor-pointer absolute top-3 left-3 z-30 bg-red-600/90 hover:bg-red-500 text-white w-9 h-9 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 border border-red-400/50"
                title="Eliminar curso permanentemente"
              >
                <span className="text-sm">🗑️</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};