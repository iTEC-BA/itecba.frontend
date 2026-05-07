import { useQuery } from '@tanstack/react-query';
import { adminService } from '@features/admin/services/adminService';

interface Announcement {
  id: string;
  title: string;
  message: string;
  isCritical: boolean;
  active: boolean;
  createdAt: any;
}

export const useAnnouncements = () => {
  const { data: announcements = [], isLoading, isError } = useQuery<Announcement[]>({
    queryKey: ['announcements', 'active'],
    queryFn: async () => (await adminService.getActiveAnnouncements()) as any,
    staleTime: 1000 * 60 * 5,
  });

  const critical = (announcements as Announcement[]).find((a) => a?.isCritical);
  const hasAnnouncements = (announcements as any[])?.length > 0;

  return { announcements: announcements as Announcement[], critical, hasAnnouncements, isLoading, isError };
};
