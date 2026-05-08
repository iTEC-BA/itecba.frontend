import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@context/AuthContext';
import { usePageTitle } from '@hooks/usePageTitle';

import { MainLayout } from '@/components/templates/MainLayout';
import { ProgressDashboard } from '@features/progress/components/organisms/ProgressDashboard';
import { useProgress } from '@features/progress/hooks/useProgress';

export const ProgressPage: React.FC = () => {
  usePageTitle("Progreso de Carrera");
  const { user } = useAuth();

  const { data, isLoading, isError, updateSubjectStatus, switchCareer, removeCareer } = useProgress();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center p-10 bg-itec-bg border border-itec-gray rounded-3xl max-w-lg shadow-xl">
            <span className="text-6xl block mb-6">🔒</span>
            <h2 className="text-2xl font-bold text-itec-text mb-3">Acceso Restringido</h2>
            <p className="text-itec-text mb-8 text-sm">Debes iniciar sesión para llevar el registro de tu progreso académico y calcular correlativas.</p>
            <Link to="/login" className="bg-itec-primary hover:bg-itecBlue text-itec-textpx-8 py-3 rounded-full font-bold transition-all inline-block shadow-lg">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-[70vh] gap-5">
           <div className="w-10 h-10 border-[3px] border-itec-gray border-t-itecBlue rounded-full animate-spin"></div>
           <p className="text-itec-text font-bold tracking-widest text-xs animate-pulse uppercase">Cargando Plan...</p>
        </div>
      </MainLayout>
    );
  }

  if (isError || !data) {
    return (
      <MainLayout>
         <div className="flex flex-col justify-center items-center h-[70vh]">
           <div className="bg-itec-accent/10 border border-itec-accent/30 text-itec-accent p-8 rounded-2xl text-center max-w-md">
             <span className="text-4xl block mb-4">⚠️</span>
             <h3 className="text-xl font-bold mb-2">Error al cargar datos</h3>
             <p className="text-sm">Hubo un problema procesando tu plan de estudios. Refresca la página o contacta soporte.</p>
           </div>
         </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1300px] mx-auto pb-24 pt-8 px-4 lg:px-0">
        <ProgressDashboard 
          data={data} 
          onUpdateStatus={updateSubjectStatus} 
          onSwitchCareer={switchCareer} 
          onRemoveCareer={removeCareer} 
        />
      </div>
    </MainLayout>
  );
};