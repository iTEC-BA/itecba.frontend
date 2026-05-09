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
