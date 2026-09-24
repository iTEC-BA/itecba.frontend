import React from 'react';
import { MainLayout }  from '@components/templates/MainLayout';
import { ForumFeed }   from '@/features/forum/components/organisms/ForumFeed';
import { usePageTitle } from '@hooks/usePageTitle';
import { useLocation } from 'react-router-dom';
import { ForumThreadPage } from './ForumThreadPage';

export const ForumPage: React.FC = () => {
  usePageTitle('Foro Anónimo · iTEC BA');
  const location = useLocation();
  const threadPath = location.pathname.replace(/^\/foro\/?/, '').replace(/\/+$/, '');

  if (threadPath) {
    return <ForumThreadPage />;
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full">
        <div className="border-x border-itec-border/50 overflow-hidden bg-itec-bg">
          <ForumFeed />
        </div>
      </div>
    </MainLayout>
  );
};

export default ForumPage;
