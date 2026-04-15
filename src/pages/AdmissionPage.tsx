import React, { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { PageHeader } from "@/components/molecules/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/context/AuthContext";

// Hooks y Datos
import { INGRESO_DATA } from "@/features/admission/types/ingresoLinks";
import { useAdmissionProgress } from "@/features/admission/hooks/useAdmissionProgress";
import { useAdmissionDates } from "@/features/admission/hooks/useAdmissionDates"; // 🟢 NUEVO

// Componentes
import { IngresoHighlightActions } from "@/features/admission/components/organisms/IngresoHighlightActions";
import { IngresoSocialGrid } from "@/features/admission/components/organisms/IngresoSocialGrid";
import { IngresoAcademicGrid } from "@/features/admission/components/organisms/IngresoAcademicGrid";
import { IngresoStepsWidget } from "@/features/admission/components/organisms/IngresoStepsWidget";
import { AdmissionCountdownWidget } from "@/features/admission/components/organisms/AdmissionCountdownWidget";
import { AdminAdmissionDatesModal } from "@/features/admission/components/organisms/AdminAdmissionDatesModal"; // 🟢 NUEVO

export const AdmissionPage: React.FC = () => {
  usePageTitle("Ingreso UTN | ITEC");
  const { isAdmin } = useAuth();
  
  const { completedSteps, toggleStep, getProgressPercentage, isLoaded } = useAdmissionProgress();
  const { events, addEvent, removeEvent } = useAdmissionDates(); // 🟢 Traemos los eventos de Firebase

  const [isDatesModalOpen, setIsDatesModalOpen] = useState(false);

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10">
        
        <PageHeader
          title="Centro de Ingresantes"
          description="Tu panel de control para el Seminario Universitario. Inscribite, estudiá y trackeá tu progreso paso a paso."
          iconType="entry"
          colorTheme="purple"
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="xl:col-span-2 flex flex-col">
            <IngresoHighlightActions actions={INGRESO_DATA.actions} />
            <IngresoSocialGrid links={INGRESO_DATA.mainLinks} />
            <IngresoAcademicGrid materials={INGRESO_DATA.materials} siuLinks={INGRESO_DATA.siuLinks} />
          </div>

          <div className="xl:col-span-1 flex flex-col h-full">
            <div className="sticky top-24 flex flex-col h-full">
              
              {/* 🟢 Reloj Conectado a la Base de Datos */}
              <AdmissionCountdownWidget 
                events={events}
                isAdmin={isAdmin}
                onManageClick={() => setIsDatesModalOpen(true)}
              />

              <div className="flex-1">
                <IngresoStepsWidget 
                  steps={INGRESO_DATA.steps} 
                  completedSteps={completedSteps}
                  onToggleStep={toggleStep}
                  progressPercentage={getProgressPercentage(INGRESO_DATA.steps.length)}
                />
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 🟢 Modal protegido solo para Administradores */}
      {isAdmin && (
        <AdminAdmissionDatesModal
          isOpen={isDatesModalOpen}
          onClose={() => setIsDatesModalOpen(false)}
          events={events}
          onAdd={addEvent}
          onDelete={removeEvent}
        />
      )}

    </DashboardLayout>
  );
};