import { useState, useEffect, useCallback } from 'react';
import { linksService } from '@features/home/services/linksService';
import type { CampusLink } from '@features/home/services/linksService';

export interface UseLinksReturn {
  links: CampusLink[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addLink: (link: Omit<CampusLink, 'id'>) => Promise<void>;
  updateLink: (id: string, link: Partial<CampusLink>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
}

export const useLinks = (): UseLinksReturn => {
  const [links, setLinks] = useState<CampusLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await linksService.getLinks();
      setLinks(data);
    } catch (e) {
      setError('No se pudieron cargar los links.');
      console.error('useLinks error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addLink = useCallback(async (link: Omit<CampusLink, 'id'>) => {
    await linksService.addLink(link);
    await reload();
  }, [reload]);

  const updateLink = useCallback(async (id: string, link: Partial<CampusLink>) => {
    await linksService.updateLink(id, link);
    await reload();
  }, [reload]);

  const deleteLink = useCallback(async (id: string) => {
    await linksService.deleteLink(id);
    await reload();
  }, [reload]);

  return { links, isLoading, error, reload, addLink, updateLink, deleteLink };
};
