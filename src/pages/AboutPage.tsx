import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { PageHeader } from '@components/ui/PageHeader';
import { usePageTitle } from '@hooks/usePageTitle';

import { AboutProjectWidget } from '@features/about/components/organisms/AboutProjectWidget';
import { ContributorsWidget } from '@features/about/components/organisms/ContributorsWidget';

export const AboutPage: React.FC = () => {
  usePageTitle("Sobre Nosotros | ITEC");

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-10">
        <PageHeader 
          title="Sobre Nosotros" 
          description="Descubrí la historia detrás de ITEC, nuestra misión, y conocé al equipo de estudiantes que hace esto posible." 
          iconType="users" 
          colorTheme="red" 
        />
        <AboutProjectWidget />
        <ContributorsWidget />
      </div>
    </MainLayout>
  );
};