import { useState, useEffect, useCallback } from 'react';
import { auth } from '@lib/firebase';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/forum`;

export interface ForumBanner {
  id:           number;
  title:        string;
  description:  string;
  redirect_url: string;
  svg_content:  string;
  is_active:    number;  // 1 | 0 (SQLite)
  created_at:   string;
  updated_at:   string;
}

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Hook para leer y CRUD de banners del foro.
 * @param onlyActive true → GET /banners?active=1  (feed)
 *                   false → GET /banners           (admin panel)
 */
export const useBanners = (onlyActive: boolean) => {
  const [banners, setBanners] = useState<ForumBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const qs  = onlyActive ? '?active=1' : '';
      const res = await fetch(`${BASE}/banners${qs}`, { headers: await getAuthHeaders() });
      if (!res.ok) throw new Error('Error al cargar banners');
      const data = await res.json();
      setBanners(data.banners ?? []);
    } catch { setBanners([]); }
    finally  { setLoading(false); }
  }, [onlyActive]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const create = async (payload: Omit<ForumBanner, 'id' | 'created_at' | 'updated_at'>) => {
    const res = await fetch(`${BASE}/banners`, {
      method:  'POST',
      headers: await getAuthHeaders(),
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al crear banner');
    await fetch_();
  };

  const update = async (id: number, payload: Partial<ForumBanner>) => {
    const res = await fetch(`${BASE}/banners/${id}`, {
      method:  'PATCH',
      headers: await getAuthHeaders(),
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al actualizar banner');
    await fetch_();
  };

  const remove = async (id: number) => {
    const res = await fetch(`${BASE}/banners/${id}`, {
      method:  'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Error al eliminar banner');
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  return { banners, loading, refresh: fetch_, create, update, remove };
};
