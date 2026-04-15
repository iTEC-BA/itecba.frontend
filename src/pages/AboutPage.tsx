import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { PageHeader } from '@/components/molecules/PageHeader';
import { usePageTitle } from '@/hooks/usePageTitle';

import { AboutProjectWidget } from '@/features/about/components/organisms/AboutProjectWidget';
import { ContributorsWidget } from '@/features/about/components/organisms/ContributorsWidget';

export const AboutPage: React.FC = () => {
  usePageTitle("Sobre Nosotros | ITEC");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-10">
        
        {/* Header con el tema Rojo/Rosa para darle identidad a esta página */}
        <PageHeader 
          title="Sobre Nosotros" 
          description="Descubrí la historia detrás de ITEC, nuestra misión, y conocé al equipo de estudiantes que hace esto posible." 
          iconType="users" 
          colorTheme="red" 
        />

        {/* Los nuevos widgets ultra mejorados */}
        <AboutProjectWidget />
        <ContributorsWidget />

      </div>
    </DashboardLayout>
  );
};