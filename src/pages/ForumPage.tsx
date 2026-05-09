import React from 'react';
import { MainLayout }  from '@components/templates/MainLayout';
import { ForumFeed }   from '@/features/forum/components/organisms/ForumFeed';
import { usePageTitle } from '@hooks/usePageTitle';

export const ForumPage: React.FC = () => {
  usePageTitle('Foro Anónimo · iTEC BA');
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full">
        <div className="rounded-2xl border border-itec-border overflow-hidden bg-itec-bg">
          <ForumFeed />
        </div>
      </div>
    </MainLayout>
  );
};

export default ForumPage;
