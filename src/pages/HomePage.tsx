import React from 'react';
import { MainLayout } from '@components/templates/MainLayout';
import { WelcomeWidget } from '@features/home/components/organisms/WelcomeWidget';
import { UniversityLinksWidget } from '@features/home/components/organisms/UniversityLinksWidget';
import { HubNavigation } from '@features/home/components/organisms/HubNavigation';
import { AnnouncementsSection } from '@features/home/components/organisms/AnnouncementsSection';
import { QuickStatsRow } from '@features/home/components/organisms/QuickStatsRow';
import { usePageTitle } from '@hooks/usePageTitle';

export const HomePage: React.FC = () => {
  usePageTitle('Inicio');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full">
        <AnnouncementsSection />
        <WelcomeWidget />
        <UniversityLinksWidget />
        <QuickStatsRow />
        <HubNavigation />
      </div>
    </MainLayout>
  );
};
