import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { usePageTitle } from "@hooks/usePageTitle";
import { useAuthStore } from '@/stores/authStore';

import { INGRESO_DATA } from "@features/admission/types/ingresoLinks";
import { ADMISSION_YEAR } from "@features/admission/constants";
import { useAdmissionProgress } from "@features/admission/hooks/useAdmissionProgress";
import { useAdmissionDates } from "@features/admission/hooks/useAdmissionDates";

import { IngresoQuickLinks } from "@features/admission/components/organisms/IngresoQuickLinks";
import { IngresoInfoAccordion } from "@features/admission/components/organisms/IngresoInfoAccordion";
import { IngresoStepsWidget } from "@features/admission/components/organisms/IngresoStepsWidget";
import { AdmissionCountdownWidget } from "@features/admission/components/organisms/AdmissionCountdownWidget";
import { AdminAdmissionDatesModal } from "@features/admission/components/organisms/AdminAdmissionDatesModal";

export const AdmissionPage: React.FC = () => {
  usePageTitle(`Ingreso UTN ${ADMISSION_YEAR} | ITEC`);
  const { isAdmin } = useAuthStore();
  
  const { completedSteps, toggleStep, getProgressPercentage, isLoaded } = useAdmissionProgress();
  const { events, addEvent, removeEvent } = useAdmissionDates();

  const [isDatesModalOpen, setIsDatesModalOpen] = useState(false);

  if (!isLoaded) return null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto pb-10 relative">
        <PageHeader
          title={`Centro de Ingresantes ${ADMISSION_YEAR}`}
          description="Encuentra accesos rápidos, material oficial y toda la información de fechas y modalidades organizadas para que no te pierdas nada."
          iconType="entry"
          colorTheme="purple"
        />
        <AdmissionCountdownWidget 
          events={events}
          isAdmin={isAdmin}
          onManageClick={() => setIsDatesModalOpen(true)}
        />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 flex flex-col">
            <IngresoQuickLinks 
              actions={INGRESO_DATA.actions} 
              socials={INGRESO_DATA.mainLinks} 
              materials={INGRESO_DATA.materials} 
              siuLinks={INGRESO_DATA.siuLinks} 
            />
            <IngresoInfoAccordion modalities={INGRESO_DATA.modalities} />
          </div>

          <div className="xl:col-span-1 flex flex-col h-full">
            <div className="sticky top-24 flex flex-col h-full">
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

      {isAdmin && (
        <AdminAdmissionDatesModal
          isOpen={isDatesModalOpen}
          onClose={() => setIsDatesModalOpen(false)}
          events={events}
          onAdd={addEvent}
          onDelete={removeEvent}
        />
      )}
    </MainLayout>
  );
};
