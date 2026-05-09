import { useState, useCallback, useEffect, useRef } from 'react';
import { forumService } from '../services/forumService';
import type { ForumPost, ForumView, ForumTab } from '../types/forum';
import { useAuth } from '@context/AuthContext';

interface UseForumReturn {
  posts:         ForumPost[];
  activeThread:  { post: ForumPost; replies: ForumPost[] } | null;
  view:          ForumView;
  loading:       boolean;
  loadingMore:   boolean;
  error:         string | null;
  hasMore:       boolean;
  page:          number;
  activeTab:     ForumTab;
  composing:     boolean;
  replyingTo:    number | null;
  loadMore:      () => void;
  openThread:    (id: number) => void;
  closeThread:   () => void;
  setActiveTab:  (t: ForumTab) => void;
  submitPost:    (body: string) => Promise<void>;
  submitReply:   (parentId: number, body: string) => Promise<void>;
  handleVote:    (postId: number, value: 1 | -1) => void;
  handleRepost:  (postId: number) => void;
  handleDelete:  (postId: number) => void;
  setComposing:  (v: boolean) => void;
  setReplyingTo: (id: number | null) => void;
  refresh:       () => void;
}

export const useForum = (): UseForumReturn => {
  const { user } = useAuth();

  const [posts,        setPosts]        = useState<ForumPost[]>([]);
  const [activeThread, setActiveThread] = useState<{ post: ForumPost; replies: ForumPost[] } | null>(null);
  const [view,         setView]         = useState<ForumView>('feed');
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [hasMore,      setHasMore]      = useState(false);
  const [page,         setPage]         = useState(1);
  const [activeTab,    setActiveTabState] = useState<ForumTab>('para-ti');
  const [composing,    setComposing]    = useState(false);
  const [replyingTo,   setReplyingTo]  = useState<number | null>(null);
  const loadingRef = useRef(false);

  const fetchPosts = useCallback(async (p = 1, tab: ForumTab = 'para-ti', append = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (p === 1) setLoading(true); else setLoadingMore(true);
    setError(null);
    try {
      const data = await forumService.getPosts(p, tab);
      setPosts(prev => (append ? [...prev, ...data.posts] : data.posts));
      setHasMore(data.hasMore);
      setPage(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el foro');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => { fetchPosts(1, activeTab); }, [fetchPosts, activeTab]);

  const setActiveTab = useCallback((tab: ForumTab) => {
    setActiveTabState(tab);
    setPosts([]);
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchPosts(page + 1, activeTab, true);
  }, [hasMore, loadingMore, page, fetchPosts, activeTab]);

  const openThread = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await forumService.getThread(id);
      setActiveThread(data);
      setView('thread');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el hilo');
    } finally {
      setLoading(false);
    }
  }, []);

  const closeThread = useCallback(() => {
    setActiveThread(null);
    setView('feed');
    setReplyingTo(null);
  }, []);

  const submitPost = useCallback(async (body: string) => {
    const post = await forumService.createPost(body);
    setPosts(prev => [post, ...prev]);
    setComposing(false);
  }, []);

  const submitReply = useCallback(async (parentId: number, body: string) => {
    const reply = await forumService.createReply(parentId, body);
    if (activeThread) {
      setActiveThread(prev =>
        prev ? { ...prev, replies: [...prev.replies, reply] } : prev
      );
      setPosts(prev =>
        prev.map(p => p.id === parentId ? { ...p, reply_count: (p.reply_count || 0) + 1 } : p)
      );
    }
    setReplyingTo(null);
  }, [activeThread]);

  const handleVote = useCallback(async (postId: number, value: 1 | -1) => {
    if (!user) return;
    try {
      const { upvotes } = await forumService.vote(postId, value);
      const update = (p: ForumPost): ForumPost => {
        if (p.id !== postId) return p;
        const nextVote: 0 | 1 | -1 = p.user_vote === value ? 0 : value;
        return { ...p, upvotes, user_vote: nextVote };
      };
      setPosts(prev => prev.map(update));
      if (activeThread) {
        setActiveThread(prev =>
          prev ? { post: update(prev.post), replies: prev.replies.map(update) } : prev
        );
      }
    } catch { /* silencioso */ }
  }, [user, activeThread]);

  const handleRepost = useCallback(async (postId: number) => {
    if (!user) return;
    try {
      const { reposts, is_reposted } = await forumService.repost(postId);
      const update = (p: ForumPost): ForumPost =>
        p.id === postId ? { ...p, reposts, is_reposted } : p;
      setPosts(prev => prev.map(update));
      if (activeThread) {
        setActiveThread(prev =>
          prev ? { post: update(prev.post), replies: prev.replies.map(update) } : prev
        );
      }
    } catch { /* silencioso */ }
  }, [user, activeThread]);

  const handleDelete = useCallback(async (postId: number) => {
    if (!confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return;
    try {
      await forumService.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (activeThread?.post.id === postId) closeThread();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al eliminar');
    }
  }, [activeThread, closeThread]);

  return {
    posts, activeThread, view, loading, loadingMore, error,
    hasMore, page, activeTab, composing, replyingTo,
    loadMore, openThread, closeThread, setActiveTab,
    submitPost, submitReply, handleVote, handleRepost, handleDelete,
    setComposing, setReplyingTo,
    refresh: () => fetchPosts(1, activeTab),
  };
};
