import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { ProgressDashboard } from '@features/progress/components/organisms/ProgressDashboard';
import { useProgress } from '@features/progress/hooks/useProgress';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, updateSubjectStatus, switchCareer } = useProgress();

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-itec-surface border border-itec-gray rounded-3xl max-w-2xl mx-auto mt-10 shadow-2xl">
          <span className="text-6xl block mb-6">🔒</span>
          <h2 className="text-3xl font-bold text-white mb-3">Acceso Restringido</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">Debes iniciar sesión y estar registrado en una carrera para ver tu progreso académico.</p>
          <Link to="/login" className="bg-itec-blue hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-itec-blue/20">
            Iniciar Sesión
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
           <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
           <p className="text-gray-400 font-medium animate-pulse">Cargando tu plan de estudios...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !data) {
    return (
      <DashboardLayout>
         <div className="text-center text-red-400 py-10">Error al cargar el progreso.</div>
      </DashboardLayout>
    );
  }

return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto pb-20 pt-6"> {/* Se achicó un poco el max-w para que la tabla se vea más compacta */}
        <ProgressDashboard 
          data={data} 
          onUpdateStatus={updateSubjectStatus} // <-- MUY IMPORTANTE pasar esta prop
          onSwitchCareer={switchCareer} // <--- AÑADIR ESTO
        />
      </div>
    </DashboardLayout>
)
};