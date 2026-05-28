/**
 * useForum — hook central del foro anónimo
 * ─────────────────────────────────────────
 * • Short-polling silencioso: cada 2 min + trigger en scroll-to-top
 * • Optimistic UI: los contadores SOLO SUBEN (nunca bajan) antes de confirmar
 * • Infinite scroll: carga página por página
 * • Modal de confirmación para eliminar (no window.confirm)
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePointsGrant }    from '@features/points/hooks/usePointsGrant';
import { forumService }                              from '../services/forumService';
import type { ForumPost, ForumTab, ForumView }       from '../types/forum';
import type React from 'react';

interface ActiveThread { post: ForumPost; replies: ForumPost[] }

interface UseForumReturn {
  posts:         ForumPost[];
  activeThread:  ActiveThread | null;
  view:          ForumView;
  loading:       boolean;
  loadingMore:   boolean;
  error:         string | null;
  hasMore:       boolean;
  activeTab:     ForumTab;
  composing:     boolean;
  /** Id del post pendiente de confirmación de borrado */
  deleteTarget:  number | null;
  loadMore:      () => void;
  openThread:    (id: number) => void;
  closeThread:   () => void;
  setActiveTab:  (tab: ForumTab) => void;
  submitPost:    (body: string) => Promise<void>;
  submitReply:   (parentId: number, body: string) => Promise<void>;
  handleVote:    (id: number, v: 1 | -1) => void;
  handleRepost:  (id: number) => void;
  /** Pide confirmación (abre modal en ForumFeed) */
  requestDelete: (id: number) => void;
  /** Ejecuta el borrado confirmado */
  confirmDelete: () => Promise<void>;
  /** Cancela el borrado */
  cancelDelete:  () => void;
  setComposing:  (v: boolean) => void;
  /** Refresco completo (con spinner) */
  refresh:       () => void;
  /** Refresco silencioso (sin spinner) */
  silentRefresh: () => void;
  /** Nodo React del toast de puntos — renderizar en el componente padre */
  toastNode:     React.ReactNode;
}

export const useForum = (): UseForumReturn => {
  const [posts,        setPosts]        = useState<ForumPost[]>([]);
  const [activeThread, setActiveThread] = useState<ActiveThread | null>(null);
  const [view,         setView]         = useState<ForumView>('feed');
  const [loading,      setLoading]      = useState(false);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [hasMore,      setHasMore]      = useState(true);
  const [activeTab,    setActiveTabSt]  = useState<ForumTab>('para-ti');
  const [composing,    setComposing]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const { grant }                        = usePointsGrant();
  const showToast = useCallback(() => {}, []);
  const toastNode = null;

  const pageRef    = useRef(1);
  const loadingRef = useRef(false); // guard against concurrent fetches

  // ── Fetch feed (completo, con spinner) ──────────────────────────────────
  const fetchFeed = useCallback(async (tab: ForumTab, reset = true) => {
    if (loadingRef.current && reset) return;
    loadingRef.current = true;
    if (reset) { setLoading(true); setPosts([]); pageRef.current = 1; }
    setError(null);
    try {
      const data = await forumService.getFeed(tab, reset ? 1 : pageRef.current);
      setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      if (!reset) pageRef.current += 1;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el foro');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // ── Refresco silencioso — NO muestra spinner, solo actualiza nuevos posts ─
  const silentRefresh = useCallback(async () => {
    if (loadingRef.current) return;
    try {
      const data = await forumService.getFeed(activeTab, 1);
      pageRef.current = 1;
      // Merge: nuevos posts arriba, conservamos los optimistic locales
      setPosts(data.posts);
      setHasMore(data.hasMore);
    } catch { /* silencioso */ }
  }, [activeTab]);

  const refresh = useCallback(() => fetchFeed(activeTab, true), [fetchFeed, activeTab]);

  // ── Short-poll silencioso cada 2 minutos ─────────────────────────────────
  useEffect(() => {
    const id = setInterval(silentRefresh, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [silentRefresh]);

  // ── Carga inicial y al cambiar de tab ───────────────────────────────────
  useEffect(() => { fetchFeed(activeTab, true); }, [activeTab, fetchFeed]);

  const setActiveTab = (tab: ForumTab) => setActiveTabSt(tab);

  // ── Infinite scroll ────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loadingRef.current) return;
    setLoadingMore(true);
    pageRef.current += 1;
    try {
      const data = await forumService.getFeed(activeTab, pageRef.current);
      setPosts(prev => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } catch {
      pageRef.current -= 1;
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, activeTab]);

  // ── Thread ─────────────────────────────────────────────────────────────
  const openThread = useCallback(async (id: number) => {
    setView('thread');
    try {
      const data = await forumService.getThread(id);
      setActiveThread({ post: data.post, replies: data.replies });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el hilo');
      setView('feed');
    }
  }, [grant, showToast]);

  const closeThread = useCallback(() => {
    setView('feed');
    setActiveThread(null);
  }, [grant, showToast]);

  // ── Crear post (optimistic) ─────────────────────────────────────────────
  const submitPost = useCallback(async (body: string) => {
    const placeholder: ForumPost = {
      id: Date.now(), parent_id: null, root_id: null,
      pseudonym: '…', body, upvotes: 0, reposts: 0, shares: 0,
      views: 0, reply_count: 0, user_vote: 0, is_reposted: false,
      is_author: true, created_at: new Date().toISOString(),
      expires_at: new Date().toISOString(),
    };
    // Optimistic: inserta al principio
    setPosts(prev => [placeholder, ...prev]);
    try {
      const created = await forumService.createPost(body);
      // Reemplaza el placeholder con el post real
      setPosts(prev => prev.map(p => p.id === placeholder.id ? created : p));
      // Otorgar puntos por publicar en el foro
    } catch (e) {
      // Revierte si falla
      setPosts(prev => prev.filter(p => p.id !== placeholder.id));
      throw e;
    }
  }, []);

  // ── Crear respuesta ────────────────────────────────────────────────────
  const submitReply = useCallback(async (parentId: number, body: string) => {
    const reply = await forumService.createReply(parentId, body);
    // Otorgar puntos por responder en el foro
    setActiveThread(prev =>
      prev ? { ...prev, replies: [...prev.replies, reply] } : prev
    );
    setPosts(prev =>
      prev.map(p => p.id === parentId
        ? { ...p, reply_count: (p.reply_count || 0) + 1 }
        : p
      )
    );
  }, []);

  // ── Voto optimista (SOLO SUMA — nunca resta) ────────────────────────────
  const handleVote = useCallback((id: number, v: 1 | -1) => {
    const applyOpt = (p: ForumPost): ForumPost => {
      if (p.id !== id) return p;
      // Si ya votó igual, no hace nada (no restamos)
      if (p.user_vote === v) return p;
      return { ...p, upvotes: p.upvotes + 1, user_vote: v };
    };
    setPosts(prev => prev.map(applyOpt));
    setActiveThread(prev => prev
      ? {
          post:    applyOpt(prev.post),
          replies: prev.replies.map(applyOpt),
        }
      : prev
    );
    // Confirma en background (no revertimos si falla — spec: solo suma)
    forumService.vote(id, v).catch(() => {});
  }, []);

  // ── Repost optimista (SOLO SUMA) ────────────────────────────────────────
  const handleRepost = useCallback((id: number) => {
    const applyOpt = (p: ForumPost): ForumPost => {
      if (p.id !== id) return p;
      if (p.is_reposted) return p; // ya reposteado, no resta
      return { ...p, reposts: (p.reposts || 0) + 1, is_reposted: true };
    };
    setPosts(prev => prev.map(applyOpt));
    setActiveThread(prev => prev
      ? { post: applyOpt(prev.post), replies: prev.replies }
      : prev
    );
    forumService.repost(id).catch(() => {});
  }, []);

  // ── Eliminar (con confirmación via modal) ──────────────────────────────
  const requestDelete = useCallback((id: number) => setDeleteTarget(id), []);
  const cancelDelete  = useCallback(() => setDeleteTarget(null), []);

  const confirmDelete = useCallback(async () => {
    if (deleteTarget === null) return;
    const id = deleteTarget;
    setDeleteTarget(null);
    try {
      await forumService.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      setActiveThread(prev => {
        if (!prev) return prev;
        if (prev.post.id === id) { setView('feed'); return null; }
        return { ...prev, replies: prev.replies.filter(r => r.id !== id) };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    }
  }, [deleteTarget]);

  return {
    posts, activeThread, view, loading, loadingMore, error,
    hasMore, activeTab, composing, deleteTarget,
    loadMore, openThread, closeThread, setActiveTab,
    submitPost, submitReply, handleVote, handleRepost,
    requestDelete, confirmDelete, cancelDelete,
    setComposing, refresh, silentRefresh,
    toastNode,
  };
};
