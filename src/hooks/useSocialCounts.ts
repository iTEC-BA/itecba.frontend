/**
 * useSocialCounts
 * ───────────────────────────────────────────────────────────────────────────
 * Lee los contadores de redes sociales desde Firestore (config/social) y los
 * cachea en sessionStorage con un TTL de 1 hora para no re-fetchar en cada
 * render.
 *
 * Para actualizar los valores SIN re-deployar:
 *   Firestore → config → social → { youtube, instagram, community, discord }
 *
 * Mientras carga (o ante cualquier error de red) usa los FALLBACK como valor
 * inicial, así el componente nunca queda vacío.
 * ───────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from 'react';
import { doc, getDoc }         from 'firebase/firestore';
import { db }                  from '@lib/firebase';

export interface SocialCounts {
  youtube:   string;
  instagram: string;
  community: string;
  discord:   string;
}

/** Últimos valores conocidos — actualizalos acá como respaldo estático */
const FALLBACK: SocialCounts = {
  youtube:   '43K',
  instagram: '65K',
  community: '309K',
  discord:   '309K',
};

const CACHE_KEY = 'itec:social_counts';
const CACHE_TTL = 60 * 60 * 1_000; // 1 hora en ms

function readCache(): SocialCounts | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: SocialCounts; ts: number };
    return Date.now() - ts < CACHE_TTL ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: SocialCounts): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded → ignorar */ }
}

export function useSocialCounts(): SocialCounts {
  // Hidratación instantánea desde caché → sin parpadeo
  const [counts, setCounts] = useState<SocialCounts>(
    () => readCache() ?? FALLBACK
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'config', 'social'));
        if (cancelled || !snap.exists()) return;
        const data: SocialCounts = {
          ...FALLBACK,
          ...(snap.data() as Partial<SocialCounts>),
        };
        setCounts(data);
        writeCache(data);
      } catch {
        // Error de red → el fallback / caché ya está activo, no hacer nada
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return counts;
}
