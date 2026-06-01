import React, { useState } from 'react';
import { MainLayout } from '@components/templates/MainLayout';
import { UniversityLinksWidget } from '@features/home/components/organisms/UniversityLinksWidget';
import { HubNavigation } from '@features/home/components/organisms/HubNavigation';
import { QuickStatsRow } from '@features/home/components/organisms/QuickStatsRow';
import { usePageTitle } from '@hooks/usePageTitle';
import { Button } from '@/components/ui/Button';
import useSizeWindow from '@/hooks/useSizeWindow';

const WelcomeWidget = React.lazy(() => import('@features/home/components/organisms/WelcomeWidget').then(module => ({ default: module.WelcomeWidget })));
const AnnouncementsSection = React.lazy(() => import('@features/home/components/organisms/AnnouncementsSection').then(module => ({ default: module.AnnouncementsSection })));
const ForumFeed = React.lazy(() => import('@/features/forum/components/organisms').then(module => ({ default: module.ForumFeed })));

export const HomePage: React.FC = () => {
  usePageTitle('iTEC.BA');
  const {md} = useSizeWindow()
  return (
    <MainLayout>
      <React.Suspense fallback={<div />}>{md ? <HomeMain /> : <HomeFile />}</React.Suspense>
    </MainLayout>
  );
};

const HomeFile = () =>{
  const [active, setActive] = useState(true)
  return (
    <>
        <div className='flex w-min mb-3 bg-itec-box rounded-xl gap-2'>
          <Button
            onClick={() => setActive(true)}
            text='Principal'
            className={active ? 'bg-itec-red' : 'bg-transparent'}
            variant='slate'
          />
          <Button
            onClick={() => setActive(false)}
            text='ForoTec'
            className={!active ? 'bg-itec-red' : 'bg-transparent'}
            variant='slate'
          />
        </div>
        {active ? <HomeMain/> : <React.Suspense fallback={<div/>}><ForumFeed/></React.Suspense>}
    </>
  )
}


const HomeMain = () => {
    const {md} = useSizeWindow()
  return (
    <>
      {md ? <React.Suspense fallback={<div/>}><AnnouncementsSection /></React.Suspense> : <></> }
      <React.Suspense fallback={<div/>}><WelcomeWidget /></React.Suspense>
      <UniversityLinksWidget />
      <QuickStatsRow />
      <HubNavigation />
    </>
  );
};
