import React from 'react';
import { AnnouncementBar } from '@features/home/components/molecules/AnnouncementBar';
import { useAnnouncements } from '@features/home/hooks/useAnnouncements';

export const AnnouncementsSection: React.FC = () => {
  const { announcements, isLoading } = useAnnouncements();
  if (isLoading || !announcements.length) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {announcements.slice(0, 3).map((ann) => (
        <AnnouncementBar
          key={ann.id}
          title={ann.title}
          message={ann.message}
          isCritical={ann.isCritical}
        />
      ))}
    </div>
  );
};
