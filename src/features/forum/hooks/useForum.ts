// src/features/forum/hooks/useForum.ts
// Toda la lógica asíncrona del foro vive aquí.
import { useState, useCallback, useEffect, useRef } from "react";
import { forumService } from "../services/forumService";
import type { ForumPost, ForumView } from "../types/forum";
import { useAuth } from "@context/AuthContext";

interface UseForumReturn {
  // Estado
  posts: ForumPost[];
  activeThread: { post: ForumPost; replies: ForumPost[] } | null;
  view: ForumView;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  composing: boolean;
  replyingTo: number | null;
  // Acciones
  loadMore: () => void;
  openThread: (id: number) => void;
  closeThread: () => void;
  submitPost: (body: string) => Promise<void>;
  submitReply: (parentId: number, body: string) => Promise<void>;
  handleVote: (postId: number, value: 1 | -1) => void;
  handleDelete: (postId: number) => void;
  setComposing: (v: boolean) => void;
  setReplyingTo: (id: number | null) => void;
  refresh: () => void;
}

export const useForum = (): UseForumReturn => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeThread, setActiveThread] = useState<{
    post: ForumPost;
    replies: ForumPost[];
  } | null>(null);
  const [view, setView] = useState<ForumView>("feed");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [composing, setComposing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const loadingRef = useRef(false);

  const fetchPosts = useCallback(async (p = 1, append = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const data = await forumService.getPosts(p);
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setHasMore(data.hasMore);
      setPage(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el foro");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchPosts(page + 1, true);
  }, [hasMore, loadingMore, page, fetchPosts]);

  const openThread = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await forumService.getThread(id);
      setActiveThread(data);
      setView("thread");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el hilo");
    } finally {
      setLoading(false);
    }
  }, []);

  const closeThread = useCallback(() => {
    setActiveThread(null);
    setView("feed");
    setReplyingTo(null);
  }, []);

  const submitPost = useCallback(async (body: string) => {
    const post = await forumService.createPost(body);
    setPosts((prev) => [post, ...prev]);
    setComposing(false);
  }, []);

  const submitReply = useCallback(
    async (parentId: number, body: string) => {
      const reply = await forumService.createReply(parentId, body);
      if (activeThread) {
        setActiveThread((prev) =>
          prev ? { ...prev, replies: [...prev.replies, reply] } : prev,
        );
        // Actualizar reply_count en el post raíz
        setPosts((prev) =>
          prev.map((p) =>
            p.id === parentId
              ? { ...p, reply_count: (p.reply_count || 0) + 1 }
              : p,
          ),
        );
      }
      setReplyingTo(null);
    },
    [activeThread],
  );

  const handleVote = useCallback(
    async (postId: number, value: 1 | -1) => {
      if (!user) return;
      try {
        const { upvotes } = await forumService.vote(postId, value);
        // El cast explícito resuelve el error TS: user_vote es 0|1|-1, no number genérico
        const updatePost = (p: ForumPost): ForumPost => {
          if (p.id !== postId) return p;
          const nextVote: 0 | 1 | -1 = p.user_vote === value ? 0 : value;
          return { ...p, upvotes, user_vote: nextVote };
        };
        setPosts((prev) => prev.map(updatePost));
        if (activeThread) {
          setActiveThread((prev) =>
            prev
              ? {
                  post: updatePost(prev.post),
                  replies: prev.replies.map(updatePost),
                }
              : prev,
          );
        }
      } catch (_e) {
        /* silencioso */
      }
    },
    [user, activeThread],
  );

  const handleDelete = useCallback(
    async (postId: number) => {
      if (
        !confirm(
          "¿Eliminar esta publicación? Esta acción no se puede deshacer.",
        )
      )
        return;
      try {
        await forumService.deletePost(postId);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        if (activeThread?.post.id === postId) closeThread();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Error al eliminar");
      }
    },
    [activeThread, closeThread],
  );

  return {
    posts,
    activeThread,
    view,
    loading,
    loadingMore,
    error,
    hasMore,
    page,
    composing,
    replyingTo,
    loadMore,
    openThread,
    closeThread,
    submitPost,
    submitReply,
    handleVote,
    handleDelete,
    setComposing,
    setReplyingTo,
    refresh: () => fetchPosts(1),
  };
};
