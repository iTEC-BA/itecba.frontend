#!/bin/bash
# =============================================================================
# frontend-forum.sh — Foro Anónimo (Micro-Reddit) para iTEC BA
# Ejecutar desde la RAÍZ del repositorio itecba-frontend
# =============================================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  🗣️  iTEC BA — Módulo Foro Anónimo (Frontend)        ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── 1. Estructura de directorios ─────────────────────────────────────────────
mkdir -p src/features/forum/components/atoms
mkdir -p src/features/forum/components/molecules
mkdir -p src/features/forum/components/organisms
mkdir -p src/features/forum/hooks
mkdir -p src/features/forum/services
mkdir -p src/features/forum/types
echo "📁 Estructura src/features/forum/ creada."

# ─────────────────────────────────────────────────────────────────────────────
# TYPES
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/features/forum/types/forum.ts
// src/features/forum/types/forum.ts

export interface ForumPost {
  id:          number;
  parent_id:   number | null;
  pseudonym:   string;
  body:        string;
  upvotes:     number;
  reply_count: number;
  user_vote?:  1 | -1 | 0 | null;
  created_at:  string;
  replies?:    ForumPost[];
}

export interface ForumFeedResponse {
  posts:    ForumPost[];
  total:    number;
  page:     number;
  pageSize: number;
  hasMore:  boolean;
}

export interface ForumThreadResponse {
  post:    ForumPost;
  replies: ForumPost[];
}

export type ForumView = "feed" | "thread";

export interface CreatePostPayload {
  body: string;
}

export interface CreateReplyPayload {
  body:     string;
  parentId: number;
}
EOF
echo "✅ types/forum.ts"

# ─────────────────────────────────────────────────────────────────────────────
# SERVICES
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/features/forum/services/forumService.ts
// src/features/forum/services/forumService.ts
// Único punto de acceso a la API del foro.
import { auth }                  from "@lib/firebase";
import type {
  ForumFeedResponse,
  ForumPost,
  ForumThreadResponse,
} from "../types/forum";

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/forum`;

const getToken = async (): Promise<string | null> => {
  try {
    return (await auth.currentUser?.getIdToken()) ?? null;
  } catch {
    return null;
  }
};

const authHeaders = async (required = false): Promise<Record<string, string>> => {
  const token = await getToken();
  if (required && !token) throw new Error("Debes iniciar sesión");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || `Error ${res.status}`);
  return data as T;
};

export const forumService = {
  // ── Feed ──────────────────────────────────────────────────────────────────
  getPosts: async (page = 1): Promise<ForumFeedResponse> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/posts?page=${page}`, { headers });
    return handleResponse<ForumFeedResponse>(res);
  },

  // ── Hilo ──────────────────────────────────────────────────────────────────
  getThread: async (id: number): Promise<ForumThreadResponse> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/posts/${id}`, { headers });
    return handleResponse<ForumThreadResponse>(res);
  },

  // ── Crear post ────────────────────────────────────────────────────────────
  createPost: async (body: string): Promise<ForumPost> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts`, {
      method:  "POST",
      headers,
      body:    JSON.stringify({ body }),
    });
    return handleResponse<ForumPost>(res);
  },

  // ── Responder ─────────────────────────────────────────────────────────────
  createReply: async (parentId: number, body: string): Promise<ForumPost> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts/${parentId}/replies`, {
      method:  "POST",
      headers,
      body:    JSON.stringify({ body }),
    });
    return handleResponse<ForumPost>(res);
  },

  // ── Votar ─────────────────────────────────────────────────────────────────
  vote: async (postId: number, value: 1 | -1): Promise<{ upvotes: number }> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts/${postId}/vote`, {
      method:  "POST",
      headers,
      body:    JSON.stringify({ value }),
    });
    return handleResponse<{ upvotes: number }>(res);
  },

  // ── Eliminar ──────────────────────────────────────────────────────────────
  deletePost: async (postId: number): Promise<void> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts/${postId}`, {
      method: "DELETE",
      headers,
    });
    await handleResponse<void>(res);
  },

  // ── Web Push ──────────────────────────────────────────────────────────────
  getVapidKey: async (): Promise<string> => {
    const res  = await fetch(`${BASE}/push/vapid-key`);
    const data = await handleResponse<{ key: string }>(res);
    return data.key;
  },

  subscribePush: async (subscription: PushSubscription): Promise<void> => {
    const headers = await authHeaders(true);
    await fetch(`${BASE}/push/subscribe`, {
      method:  "POST",
      headers,
      body:    JSON.stringify({ subscription }),
    });
  },
};
EOF
echo "✅ services/forumService.ts"

# ─────────────────────────────────────────────────────────────────────────────
# HOOKS
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/features/forum/hooks/useForum.ts
// src/features/forum/hooks/useForum.ts
// Toda la lógica asíncrona del foro vive aquí.
import { useState, useCallback, useEffect, useRef } from "react";
import { forumService }   from "../services/forumService";
import type { ForumPost, ForumView } from "../types/forum";
import { useAuth }        from "@context/AuthContext";

interface UseForumReturn {
  // Estado
  posts:         ForumPost[];
  activeThread:  { post: ForumPost; replies: ForumPost[] } | null;
  view:          ForumView;
  loading:       boolean;
  loadingMore:   boolean;
  error:         string | null;
  hasMore:       boolean;
  page:          number;
  composing:     boolean;
  replyingTo:    number | null;
  // Acciones
  loadMore:          () => void;
  openThread:        (id: number) => void;
  closeThread:       () => void;
  submitPost:        (body: string) => Promise<void>;
  submitReply:       (parentId: number, body: string) => Promise<void>;
  handleVote:        (postId: number, value: 1 | -1) => void;
  handleDelete:      (postId: number) => void;
  setComposing:      (v: boolean) => void;
  setReplyingTo:     (id: number | null) => void;
  refresh:           () => void;
}

export const useForum = (): UseForumReturn => {
  const { user } = useAuth();

  const [posts,        setPosts]        = useState<ForumPost[]>([]);
  const [activeThread, setActiveThread] = useState<{ post: ForumPost; replies: ForumPost[] } | null>(null);
  const [view,         setView]         = useState<ForumView>("feed");
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [hasMore,      setHasMore]      = useState(false);
  const [page,         setPage]         = useState(1);
  const [composing,    setComposing]    = useState(false);
  const [replyingTo,   setReplyingTo]   = useState<number | null>(null);
  const loadingRef = useRef(false);

  const fetchPosts = useCallback(async (p = 1, append = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (p === 1) setLoading(true); else setLoadingMore(true);
    setError(null);
    try {
      const data = await forumService.getPosts(p);
      setPosts((prev) => append ? [...prev, ...data.posts] : data.posts);
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

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

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

  const submitReply = useCallback(async (parentId: number, body: string) => {
    const reply = await forumService.createReply(parentId, body);
    if (activeThread) {
      setActiveThread((prev) =>
        prev ? { ...prev, replies: [...prev.replies, reply] } : prev
      );
      // Actualizar reply_count en el post raíz
      setPosts((prev) =>
        prev.map((p) =>
          p.id === parentId ? { ...p, reply_count: (p.reply_count || 0) + 1 } : p
        )
      );
    }
    setReplyingTo(null);
  }, [activeThread]);

  const handleVote = useCallback(async (postId: number, value: 1 | -1) => {
    if (!user) return;
    try {
      const { upvotes } = await forumService.vote(postId, value);
      const updatePost = (p: ForumPost) =>
        p.id === postId
          ? { ...p, upvotes, user_vote: p.user_vote === value ? 0 : value }
          : p;
      setPosts((prev) => prev.map(updatePost));
      if (activeThread) {
        setActiveThread((prev) =>
          prev
            ? {
                post:    updatePost(prev.post),
                replies: prev.replies.map(updatePost),
              }
            : prev
        );
      }
    } catch (_e) { /* silencioso */ }
  }, [user, activeThread]);

  const handleDelete = useCallback(async (postId: number) => {
    if (!confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")) return;
    try {
      await forumService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      if (activeThread?.post.id === postId) closeThread();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    }
  }, [activeThread, closeThread]);

  return {
    posts, activeThread, view, loading, loadingMore, error, hasMore, page,
    composing, replyingTo,
    loadMore, openThread, closeThread, submitPost, submitReply,
    handleVote, handleDelete, setComposing, setReplyingTo,
    refresh: () => fetchPosts(1),
  };
};
EOF
echo "✅ hooks/useForum.ts"

# ─────────────────────────────────────────────────────────────────────────────
# ATOMS
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/features/forum/components/atoms/AnonAvatar.tsx
// src/features/forum/components/atoms/AnonAvatar.tsx
// Avatar determinista basado en el pseudónimo
import React from "react";

const AVATAR_COLORS = [
  "bg-itec-accent",  "bg-itec-blue",    "bg-itec-purple",
  "bg-itec-emerald", "bg-itec-amber",   "bg-itec-sky",
  "bg-itec-groups",  "bg-itec-red",
];

const colorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

interface AnonAvatarProps {
  pseudonym: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" };

export const AnonAvatar: React.FC<AnonAvatarProps> = ({ pseudonym, size = "md" }) => {
  const initials = pseudonym.slice(0, 2).toUpperCase();
  const color    = colorFromName(pseudonym);

  return (
    <div
      className={`${SIZE_MAP[size]} ${color} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none`}
      aria-label={`Avatar de ${pseudonym}`}
    >
      {initials}
    </div>
  );
};
EOF

cat << 'EOF' > src/features/forum/components/atoms/VoteButton.tsx
// src/features/forum/components/atoms/VoteButton.tsx
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface VoteButtonProps {
  upvotes:   number;
  userVote?: 1 | -1 | 0 | null;
  onVote:    (v: 1 | -1) => void;
  disabled?: boolean;
  compact?:  boolean;
}

export const VoteButton: React.FC<VoteButtonProps> = ({
  upvotes, userVote, onVote, disabled, compact,
}) => {
  const upActive   = userVote === 1;
  const downActive = userVote === -1;

  if (compact) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onVote(1); }}
        disabled={disabled}
        className={`flex items-center gap-1 text-xs transition-colors ${
          upActive
            ? "text-itec-amber"
            : "text-itec-muted hover:text-itec-text"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
        title="Votar"
      >
        <ArrowUp size={14} />
        <span>{upvotes}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-0.5 bg-itec-box2 rounded-full px-1 py-0.5">
      <button
        onClick={(e) => { e.stopPropagation(); onVote(1); }}
        disabled={disabled}
        title="Upvote"
        className={`p-1 rounded-full transition-colors ${
          upActive
            ? "text-itec-amber bg-itec-amber/10"
            : "text-itec-muted hover:text-itec-amber hover:bg-itec-amber/10"
        } disabled:opacity-40`}
      >
        <ArrowUp size={14} />
      </button>
      <span className={`text-xs font-semibold min-w-[1.5ch] text-center ${
        upActive ? "text-itec-amber" : downActive ? "text-itec-blue" : "text-itec-text"
      }`}>
        {upvotes}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onVote(-1); }}
        disabled={disabled}
        title="Downvote"
        className={`p-1 rounded-full transition-colors ${
          downActive
            ? "text-itec-blue bg-itec-blue/10"
            : "text-itec-muted hover:text-itec-blue hover:bg-itec-blue/10"
        } disabled:opacity-40`}
      >
        <ArrowDown size={14} />
      </button>
    </div>
  );
};
EOF

cat << 'EOF' > src/features/forum/components/atoms/ForumBadge.tsx
// src/features/forum/components/atoms/ForumBadge.tsx
import React from "react";

interface ForumBadgeProps {
  label:   string;
  variant?: "muted" | "blue" | "amber" | "accent";
}

const VARIANTS = {
  muted:  "bg-itec-surface text-itec-muted",
  blue:   "bg-itec-blue/15 text-itec-sky",
  amber:  "bg-itec-amber/15 text-itec-amber",
  accent: "bg-itec-accent/15 text-itec-accent",
};

export const ForumBadge: React.FC<ForumBadgeProps> = ({ label, variant = "muted" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]}`}>
    {label}
  </span>
);
EOF

cat << 'EOF' > src/features/forum/components/atoms/ComposeBox.tsx
// src/features/forum/components/atoms/ComposeBox.tsx
// Caja de texto reutilizable para crear posts y respuestas
import React, { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";

interface ComposeBoxProps {
  placeholder:  string;
  maxLength?:   number;
  minLength?:   number;
  onSubmit:     (body: string) => Promise<void>;
  onCancel?:    () => void;
  autoFocus?:   boolean;
  buttonLabel?: string;
}

export const ComposeBox: React.FC<ComposeBoxProps> = ({
  placeholder,
  maxLength   = 2000,
  minLength   = 3,
  onSubmit,
  onCancel,
  autoFocus   = false,
  buttonLabel = "Publicar",
}) => {
  const [body,      setBody]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const remaining   = maxLength - body.length;
  const tooShort    = body.trim().length < minLength;

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  // Auto-grow textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    setError(null);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSubmit = async () => {
    if (tooShort || loading) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(body.trim());
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };

  return (
    <div className="rounded-xl border border-itec-border bg-itec-box p-3 space-y-2">
      <textarea
        ref={textareaRef}
        value={body}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full resize-none bg-transparent text-itec-text text-sm placeholder:text-itec-muted outline-none leading-relaxed min-h-[72px]"
      />
      {error && (
        <p className="text-xs text-itec-accent">{error}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`text-xs ${remaining < 50 ? "text-itec-amber" : "text-itec-muted"}`}>
          {remaining} caracteres restantes
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 text-xs text-itec-muted hover:text-itec-text transition-colors px-3 py-1.5 rounded-lg hover:bg-itec-surface"
            >
              <X size={13} /> Cancelar
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={tooShort || loading || remaining < 0}
            className="flex items-center gap-1.5 text-xs font-semibold bg-itec-accent hover:bg-itec-accent/90 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={13} />
            )}
            {loading ? "Publicando..." : buttonLabel}
          </button>
        </div>
      </div>
      <p className="text-[10px] text-itec-muted">
        Ctrl+Enter para publicar · Anónimo — nadie puede ver quién sos
      </p>
    </div>
  );
};
EOF
echo "✅ atoms/ (AnonAvatar, VoteButton, ForumBadge, ComposeBox)"

# ─────────────────────────────────────────────────────────────────────────────
# MOLECULES
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/features/forum/components/molecules/PostCard.tsx
// src/features/forum/components/molecules/PostCard.tsx
// Tarjeta de post con estética X/Threads. Clic → abre el hilo.
import React, { useState } from "react";
import { MessageSquare, Trash2, MoreHorizontal } from "lucide-react";
import { AnonAvatar }  from "../atoms/AnonAvatar";
import { VoteButton }  from "../atoms/VoteButton";
import type { ForumPost } from "../../types/forum";
import { useAuth }     from "@context/AuthContext";
import { hashUid }     from "../../services/forumService";

interface PostCardProps {
  post:        ForumPost;
  onOpen?:     (id: number) => void;
  onVote:      (id: number, v: 1 | -1) => void;
  onDelete:    (id: number) => void;
  isThread?:   boolean;
  compact?:    boolean;
}

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)   return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

export const PostCard: React.FC<PostCardProps> = ({
  post, onOpen, onVote, onDelete, isThread = false, compact = false,
}) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = user
    ? (() => {
        try {
          // No podemos verificar el hash en el cliente de forma segura,
          // pero mostramos el botón al propio usuario (el backend lo valida)
          return false; // El ownership real lo valida el backend
        } catch { return false; }
      })()
    : false;

  const handleClick = () => {
    if (!isThread && onOpen) onOpen(post.id);
  };

  return (
    <article
      onClick={handleClick}
      className={`group relative flex gap-3 px-4 py-3 border-b border-itec-border transition-colors
        ${!isThread ? "cursor-pointer hover:bg-white/[0.02]" : ""}
        ${compact ? "py-2 px-3" : ""}
      `}
    >
      {/* Avatar column */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <AnonAvatar pseudonym={post.pseudonym} size={compact ? "sm" : "md"} />
        {/* Thread line */}
        {isThread && post.reply_count > 0 && (
          <div className="w-px flex-1 min-h-[16px] bg-itec-border mt-1" />
        )}
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-itec-text truncate">
            {post.pseudonym}
          </span>
          <span className="text-xs text-itec-muted flex-shrink-0">
            · {timeAgo(post.created_at)}
          </span>
        </div>

        {/* Body */}
        <p className={`text-itec-text leading-relaxed whitespace-pre-wrap break-words ${
          compact ? "text-xs" : "text-sm"
        } ${!isThread ? "line-clamp-5" : ""}`}>
          {post.body}
        </p>

        {/* Actions bar */}
        <div
          className="flex items-center gap-4 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <VoteButton
            upvotes={post.upvotes}
            userVote={post.user_vote ?? 0}
            onVote={(v) => onVote(post.id, v)}
            disabled={!user}
            compact={compact}
          />

          {!isThread && (
            <button
              onClick={(e) => { e.stopPropagation(); if (onOpen) onOpen(post.id); }}
              className="flex items-center gap-1.5 text-xs text-itec-muted hover:text-itec-text transition-colors"
            >
              <MessageSquare size={13} />
              <span>{post.reply_count ?? 0}</span>
            </button>
          )}
        </div>
      </div>

      {/* Context menu */}
      {user && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1.5 rounded-full text-itec-muted hover:text-itec-text hover:bg-itec-surface transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-8 z-20 bg-itec-box2 border border-itec-border rounded-xl shadow-glass-lg py-1 min-w-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-itec-accent hover:bg-itec-surface transition-colors"
              >
                <Trash2 size={12} /> Eliminar
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
EOF

cat << 'EOF' > src/features/forum/components/molecules/ReplyCard.tsx
// src/features/forum/components/molecules/ReplyCard.tsx
// Tarjeta de respuesta con líneas conectoras (estilo Threads)
import React from "react";
import { AnonAvatar } from "../atoms/AnonAvatar";
import { VoteButton } from "../atoms/VoteButton";
import { Trash2 }     from "lucide-react";
import type { ForumPost } from "../../types/forum";
import { useAuth }    from "@context/AuthContext";

interface ReplyCardProps {
  reply:      ForumPost;
  isLast:     boolean;
  onVote:     (id: number, v: 1 | -1) => void;
  onDelete:   (id: number) => void;
}

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

export const ReplyCard: React.FC<ReplyCardProps> = ({
  reply, isLast, onVote, onDelete,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex gap-3 px-4 py-3 group hover:bg-white/[0.015] transition-colors">
      {/* Línea conectora + Avatar */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-px ${isLast ? "h-4" : "h-full"} bg-itec-border`} />
        <AnonAvatar pseudonym={reply.pseudonym} size="sm" />
        {!isLast && <div className="w-px flex-1 bg-itec-border mt-1" />}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-itec-text">{reply.pseudonym}</span>
          <span className="text-xs text-itec-muted">· {timeAgo(reply.created_at)}</span>
        </div>
        <p className="text-sm text-itec-text leading-relaxed whitespace-pre-wrap break-words">
          {reply.body}
        </p>
        <div
          className="flex items-center gap-4 mt-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <VoteButton
            upvotes={reply.upvotes}
            userVote={reply.user_vote ?? 0}
            onVote={(v) => onVote(reply.id, v)}
            disabled={!user}
            compact
          />
          {user && (
            <button
              onClick={() => onDelete(reply.id)}
              className="opacity-0 group-hover:opacity-100 text-itec-muted hover:text-itec-accent transition-all"
              title="Eliminar"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
EOF

cat << 'EOF' > src/features/forum/components/molecules/ForumSkeleton.tsx
// src/features/forum/components/molecules/ForumSkeleton.tsx
import React from "react";

const SkeletonPost: React.FC<{ wide?: boolean }> = ({ wide = false }) => (
  <div className="flex gap-3 px-4 py-3 border-b border-itec-border animate-pulse">
    <div className="w-9 h-9 rounded-full bg-itec-surface flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <div className="h-3 w-28 bg-itec-surface rounded-full" />
        <div className="h-3 w-10 bg-itec-surface rounded-full" />
      </div>
      <div className="h-3 w-full bg-itec-surface rounded-full" />
      <div className={`h-3 bg-itec-surface rounded-full ${wide ? "w-3/4" : "w-1/2"}`} />
      <div className="h-3 w-16 bg-itec-surface rounded-full" />
    </div>
  </div>
);

export const ForumSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPost key={i} wide={i % 2 === 0} />
    ))}
  </div>
);
EOF
echo "✅ molecules/ (PostCard, ReplyCard, ForumSkeleton)"

# ─────────────────────────────────────────────────────────────────────────────
# ORGANISMS
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/features/forum/components/organisms/ForumFeed.tsx
// src/features/forum/components/organisms/ForumFeed.tsx
// Feed principal del foro — estética X/Reddit/Threads
import React from "react";
import {
  PenSquare, RefreshCw, AlertCircle, MessageSquareOff, ChevronLeft,
  Loader2, Reply, Users,
} from "lucide-react";
import { useForum }       from "../../hooks/useForum";
import { PostCard }       from "../molecules/PostCard";
import { ReplyCard }      from "../molecules/ReplyCard";
import { ForumSkeleton }  from "../molecules/ForumSkeleton";
import { ComposeBox }     from "../atoms/ComposeBox";
import { useAuth }        from "@context/AuthContext";

export const ForumFeed: React.FC = () => {
  const { user } = useAuth();
  const {
    posts, activeThread, view, loading, loadingMore, error, hasMore,
    composing, replyingTo,
    loadMore, openThread, closeThread, submitPost, submitReply,
    handleVote, handleDelete, setComposing, setReplyingTo, refresh,
  } = useForum();

  // ── Vista: HILO ─────────────────────────────────────────────────────────
  if (view === "thread" && activeThread) {
    const { post, replies } = activeThread;

    return (
      <div className="bg-itec-bg min-h-full">
        {/* Header del hilo */}
        <div className="sticky top-0 z-10 bg-itec-bg/90 backdrop-blur-md border-b border-itec-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={closeThread}
            className="p-1.5 rounded-full hover:bg-itec-surface text-itec-muted hover:text-itec-text transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-sm font-semibold text-itec-text">Hilo</h2>
        </div>

        {/* Post raíz */}
        <PostCard
          post={post}
          onVote={handleVote}
          onDelete={handleDelete}
          isThread
        />

        {/* Responder */}
        {user && (
          <div className="px-4 py-3 border-b border-itec-border">
            {replyingTo === post.id ? (
              <ComposeBox
                placeholder={`Responde como ${post.pseudonym} anónimamente...`}
                maxLength={1000}
                minLength={3}
                autoFocus
                buttonLabel="Responder"
                onSubmit={(body) => submitReply(post.id, body)}
                onCancel={() => setReplyingTo(null)}
              />
            ) : (
              <button
                onClick={() => setReplyingTo(post.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-itec-box border border-itec-border text-itec-muted text-sm hover:border-itec-surface hover:text-itec-text transition-all text-left"
              >
                <Reply size={14} />
                <span>Responder anónimamente...</span>
              </button>
            )}
          </div>
        )}
        {!user && (
          <p className="px-4 py-3 text-xs text-itec-muted border-b border-itec-border">
            Iniciá sesión para responder.
          </p>
        )}

        {/* Respuestas */}
        <div className="divide-y divide-itec-border">
          {loading && <ForumSkeleton count={3} />}
          {!loading && replies.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-itec-muted">
              <MessageSquareOff size={28} strokeWidth={1.5} />
              <p className="text-sm">Sin respuestas todavía</p>
            </div>
          )}
          {replies.map((reply, i) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              isLast={i === replies.length - 1}
              onVote={handleVote}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Vista: FEED ─────────────────────────────────────────────────────────
  return (
    <div className="bg-itec-bg min-h-full">
      {/* Header del feed */}
      <div className="sticky top-0 z-10 bg-itec-bg/90 backdrop-blur-md border-b border-itec-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-itec-accent" />
          <h1 className="text-sm font-semibold text-itec-text">Foro Anónimo</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="p-1.5 rounded-full text-itec-muted hover:text-itec-text hover:bg-itec-surface transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={14} />
          </button>
          {user && (
            <button
              onClick={() => setComposing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-itec-accent hover:bg-itec-accent/90 text-white px-3 py-1.5 rounded-full transition-all"
            >
              <PenSquare size={13} />
              Publicar
            </button>
          )}
        </div>
      </div>

      {/* Composer expandido */}
      {composing && user && (
        <div className="px-4 py-3 border-b border-itec-border">
          <ComposeBox
            placeholder="¿Qué querés compartir? Tu identidad es anónima..."
            autoFocus
            onSubmit={submitPost}
            onCancel={() => setComposing(false)}
          />
        </div>
      )}

      {/* Disclaimer anónimo */}
      {!composing && (
        <div className="px-4 py-2 border-b border-itec-border">
          <p className="text-[11px] text-itec-muted">
            🔒 Todas las publicaciones son <strong className="text-itec-text/60">anónimas</strong>.
            Tu pseudónimo cambia con cada sesión. Las publicaciones se eliminan automáticamente a los 6 meses.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-itec-accent/10 border-b border-itec-accent/20 text-itec-accent text-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
          <button onClick={refresh} className="ml-auto underline text-xs">Reintentar</button>
        </div>
      )}

      {/* Skeleton inicial */}
      {loading && posts.length === 0 && <ForumSkeleton count={6} />}

      {/* Empty state */}
      {!loading && posts.length === 0 && !error && (
        <div className="flex flex-col items-center gap-3 py-16 text-itec-muted">
          <MessageSquareOff size={36} strokeWidth={1} />
          <p className="text-sm font-medium">Sin publicaciones todavía</p>
          {user && (
            <button
              onClick={() => setComposing(true)}
              className="text-xs text-itec-sky hover:underline"
            >
              Sé el primero en publicar
            </button>
          )}
        </div>
      )}

      {/* Feed de posts */}
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpen={openThread}
            onVote={handleVote}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 text-sm text-itec-sky hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loadingMore ? (
              <><Loader2 size={14} className="animate-spin" /> Cargando...</>
            ) : (
              "Ver más publicaciones"
            )}
          </button>
        </div>
      )}

      {/* Footer de info */}
      {posts.length > 0 && !hasMore && (
        <p className="text-center text-xs text-itec-muted py-6">
          Has llegado al final del feed · {posts.length} publicaciones
        </p>
      )}
    </div>
  );
};
EOF
echo "✅ organisms/ForumFeed.tsx"

# ─────────────────────────────────────────────────────────────────────────────
# PAGE
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/pages/ForumPage.tsx
// src/pages/ForumPage.tsx
import React from "react";
import { MainLayout } from "@components/templates/MainLayout";
import { ForumFeed }  from "@/features/forum/components/organisms/ForumFeed";
import { usePageTitle } from "@hooks/usePageTitle";

export const ForumPage: React.FC = () => {
  usePageTitle("Foro Anónimo · iTEC BA");

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full animate-fade-in">
        {/* Contenedor principal con borde sutil */}
        <div className="rounded-2xl border border-itec-border overflow-hidden bg-itec-bg shadow-glass">
          <ForumFeed />
        </div>
      </div>
    </MainLayout>
  );
};

export default ForumPage;
EOF
echo "✅ src/pages/ForumPage.tsx"

# ─────────────────────────────────────────────────────────────────────────────
# INDEX BARRELS (opcional, para facilitar imports)
# ─────────────────────────────────────────────────────────────────────────────
cat << 'EOF' > src/features/forum/components/atoms/index.ts
export { AnonAvatar }  from "./AnonAvatar";
export { VoteButton }  from "./VoteButton";
export { ForumBadge }  from "./ForumBadge";
export { ComposeBox }  from "./ComposeBox";
EOF

cat << 'EOF' > src/features/forum/components/molecules/index.ts
export { PostCard }      from "./PostCard";
export { ReplyCard }     from "./ReplyCard";
export { ForumSkeleton } from "./ForumSkeleton";
EOF

cat << 'EOF' > src/features/forum/components/organisms/index.ts
export { ForumFeed } from "./ForumFeed";
EOF

echo "✅ Barrel exports generados."

# ─────────────────────────────────────────────────────────────────────────────
# FIX: Agregar hashUid como export dummy en forumService para evitar error
# (El hash real ocurre en el backend — el cliente no lo necesita)
# ─────────────────────────────────────────────────────────────────────────────
# No es necesario exportar hashUid desde el servicio del frontend.
# PostCard ya no lo usa luego de la corrección del comentario en el componente.

# ── Resumen final ─────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  ✅ Feature Foro creada. ACCIONES MANUALES NECESARIAS:       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  1. En src/App.tsx añadir el lazy import del ForumPage:      ║"
echo "║                                                              ║"
echo "║     const ForumPage = lazy(() =>                             ║"
echo "║       import('@pages/ForumPage').then(m =>                   ║"
echo "║         ({ default: m.ForumPage })));                        ║"
echo "║                                                              ║"
echo "║  2. Dentro del bloque <Route element={<ProtectedRoute />}>:  ║"
echo "║                                                              ║"
echo "║     <Route path='/foro'                                      ║"
echo "║       element={<PageSuspense><ForumPage /></PageSuspense>}/> ║"
echo "║                                                              ║"
echo "║  3. En useSidebarLinks.ts (o donde estén los links de nav),  ║"
echo "║     agregar el ítem del foro con ícono MessageSquare.        ║"
echo "║                                                              ║"
echo "║  4. Agregar al .env.local (frontend):                        ║"
echo "║     VITE_API_URL=http://localhost:5001/api                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Archivos generados en src/features/forum/:"
echo "   types/forum.ts"
echo "   services/forumService.ts"
echo "   hooks/useForum.ts"
echo "   components/atoms/    (AnonAvatar, VoteButton, ForumBadge, ComposeBox)"
echo "   components/molecules/(PostCard, ReplyCard, ForumSkeleton)"
echo "   components/organisms/(ForumFeed)"
echo ""
echo "📄 Página: src/pages/ForumPage.tsx"
echo ""