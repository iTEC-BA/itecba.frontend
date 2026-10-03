import React from 'react';
import { LinkSection, CampusLink, AudienceRole } from '@features/home/services/linksService';
import { useHomeSections } from '@features/home/hooks/useLinks';
import { useAuthStore } from '@/stores/authStore';
import { SectionLabel } from '@features/home/components/atoms/SectionLabel';
import { BentoCard } from '@features/home/components/atoms/BentoCard';

const roleMatches = (section: LinkSection, role?: string) =>
  section.audienceRoles.includes('all') || section.audienceRoles.includes((role || 'student') as AudienceRole);

const LinkItem: React.FC<{ link: CampusLink; story?: boolean }> = ({ link, story }) => (
  <a
    href={link.url}
    target={link.url.startsWith('/') ? '_self' : '_blank'}
    rel="noopener noreferrer"
    className={story
      ? 'flex w-24 shrink-0 flex-col items-center gap-2 text-center'
      : 'flex items-center gap-2 rounded-xl border border-itec-border/50 bg-itec-card px-3 py-2 transition-colors hover:border-itec-red/60'}
  >
    <span className={story ? 'flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-itec-red bg-itec-box text-2xl' : 'text-lg'}>
      {link.imageUrl ? <img src={link.imageUrl} alt="" className="h-full w-full object-cover" /> : link.icon || '🔗'}
    </span>
    <span className="text-xs font-semibold text-itec-text">{link.title}</span>
  </a>
);

const SectionView: React.FC<{ section: LinkSection }> = ({ section }) => {
  if (!section.links.length) return null;
  if (section.displayType === 'stories') {
    return <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">{section.links.map((link) => <LinkItem key={link.id} link={link} story />)}</div>;
  }
  if (section.displayType === 'carousel') {
    return <div className="flex snap-x gap-3 overflow-x-auto pb-2 no-scrollbar">{section.links.map((link) => <div key={link.id} className="min-w-[78%] snap-start"><LinkItem link={link} /></div>)}</div>;
  }
  return <div className="flex flex-wrap gap-2">{section.links.map((link) => <LinkItem key={link.id} link={link} />)}</div>;
};

export const HomeSectionsWidget: React.FC = () => {
  const { sections, isLoading, error } = useHomeSections();
  const role = useAuthStore((state) => state.user?.role);
  const visibleSections = sections.filter((section) => section.links.length > 0 && roleMatches(section, role));
  if (isLoading) return <div className="h-20 animate-pulse rounded-xl bg-itec-box" />;
  if (error) return <p className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</p>;
  return (
    <div className="mb-5 flex flex-col gap-5">
      {visibleSections.map((section) => (
        <section key={section.id}>
          <SectionLabel>{section.title}</SectionLabel>
          {section.description && <p className="mb-2 text-xs text-itec-muted">{section.description}</p>}
          <BentoCard className="p-4" hover={false}><SectionView section={section} /></BentoCard>
        </section>
      ))}
    </div>
  );
};
