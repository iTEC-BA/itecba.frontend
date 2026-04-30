import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { PageHeader } from '@components/ui/PageHeader';
import { RewardsWidget } from '@features/rewards/components/organisms/RewardsWidget';
import { InboxWidget } from '@features/rewards/components/organisms/InboxWidget';
import { usePageTitle } from '@hooks/usePageTitle';

export const RewardsPage: React.FC = () => {
  usePageTitle('Beneficios y Canjes');

  return (
    <MainLayout>
      <div className="max-w-[1100px] mx-auto pb-20 pt-8 px-6 lg:px-0 animate-fade-in">
        <PageHeader 
          title="Club de Beneficios" 
          description="Canjea tus puntos acumulados y revisa los avisos de la administración." 
          colorTheme="yellow"
          iconType='star'
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <RewardsWidget />
          </div>
          <div className="lg:col-span-1">
            <InboxWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};