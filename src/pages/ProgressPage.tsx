// src/pages/ProgressPage.tsx
// FIX: Usa LoadingState (componente global) en lugar del spinner inline.
// FIX: Conecta correctamente con updateSubjectStatus, switchCareer, removeCareer.
// REGLA: sin botones HTML crudos ni modales a mano.
import React from 'react';

import { useAuth }           from '@context/AuthContext';
import { usePageTitle }      from '@hooks/usePageTitle';
import { MainLayout }        from '@components/templates/MainLayout';
import LoadingState          from '@components/ui/LoadingState';
import { ProgressDashboard } from '@features/progress/components/organisms/ProgressDashboard';
import { useProgress }       from '@features/progress/hooks/useProgress';
import { Button }            from '@components/ui/Button';

export const ProgressPage: React.FC = () => {
  usePageTitle('Progreso de Carrera');
  const { user } = useAuth();
  const {
    data,
    isLoading,
    isError,
    updateSubjectStatus,
    switchCareer,
    removeCareer,
  } = useProgress();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center p-10 bg-itec-bg border border-itec-gray rounded-xl max-w-lg shadow-xl">
            <span className="text-6xl block mb-6">🔒</span>
            <h2 className="text-2xl font-bold text-itec-text mb-3">
              Acceso Restringido
            </h2>
            <p className="text-itec-text mb-8 text-sm">
              Iniciá sesión para llevar el registro de tu progreso académico y
              calcular correlativas.
            </p>
            <Button
              variant="primary"
              hierarchy="solid"
              text="Iniciar Sesión"
              onClick={() => { window.location.href = '/login'; }}
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <div className="bg-itec-accent/10 border border-itec-accent/30 text-itec-accent p-8 rounded-xl text-center max-w-md">
            <span className="text-4xl block mb-4">⚠️</span>
            <h3 className="text-xl font-bold mb-2">Error al cargar datos</h3>
            <p className="text-sm mb-6">
              Hubo un problema al procesar tu plan de estudios. Intentá recargar
              la página.
            </p>
            <Button
              variant="primary"
              hierarchy="outline"
              text="Recargar página"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Sin carrera activa: invitar a seleccionar una
  if (!data) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <div className="text-center p-10 bg-itec-bg border border-itec-gray rounded-xl max-w-lg shadow-xl">
            <span className="text-6xl block mb-6">🎓</span>
            <h2 className="text-2xl font-bold text-itec-text mb-3">
              Configurá tu carrera
            </h2>
            <p className="text-itec-text mb-6 text-sm">
              Actualizá tu perfil con la carrera que cursás para ver tu plan de
              estudios y seguir tu progreso.
            </p>
            <Button
              variant="primary"
              hierarchy="solid"
              text="Ir a mi Perfil"
              onClick={() => { window.location.href = '/perfil'; }}
            />
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
