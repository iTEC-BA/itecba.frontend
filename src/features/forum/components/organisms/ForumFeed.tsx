import React from "react";
import { PenSquare, RefreshCw, AlertCircle, MessageSquareOff, ChevronLeft, Loader2, Reply, Users, Bell } from "lucide-react";
import { useForum }       from "../../hooks/useForum";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import { PostCard }       from "../molecules/PostCard";
import { ReplyCard }      from "../molecules/ReplyCard";
import { ForumSkeleton }  from "../molecules/ForumSkeleton";
import { ComposeBox }     from "../atoms/ComposeBox";
import { useAuth }        from "@context/AuthContext";

export const ForumFeed: React.FC = () => {
  const { user } = useAuth();
  const { posts, activeThread, view, loading, loadingMore, error, hasMore, composing, replyingTo, loadMore, openThread, closeThread, submitPost, submitReply, handleVote, handleDelete, setComposing, setReplyingTo, refresh } = useForum();
  const { isSupported, permission, isSubscribed, subscribeToPush } = usePushNotifications();

  if (view === "thread" && activeThread) {
    const { post, replies } = activeThread;
    return (
      <div className="bg-itec-bg min-h-full">
        <div className="sticky top-0 z-10 bg-itec-bg/90 backdrop-blur-md border-b border-itec-border px-4 py-3 flex items-center gap-3">
          <button onClick={closeThread} className="p-1.5 rounded-full hover:bg-itec-surface text-itec-muted hover:text-itec-text transition-colors"><ChevronLeft size={18} /></button>
          <h2 className="text-sm font-semibold text-itec-text">Hilo</h2>
        </div>
        <PostCard post={post} onVote={handleVote} onDelete={handleDelete} isThread />
        {user ? (
          <div className="px-4 py-3 border-b border-itec-border">
            {replyingTo === post.id ? (
              <ComposeBox placeholder={`Responde como ${post.pseudonym} anónimamente...`} maxLength={1000} minLength={3} autoFocus buttonLabel="Responder" onSubmit={(body) => submitReply(post.id, body)} onCancel={() => setReplyingTo(null)} />
            ) : (
              <button onClick={() => setReplyingTo(post.id)} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-itec-box border border-itec-border text-itec-muted text-sm hover:border-itec-surface hover:text-itec-text transition-all text-left"><Reply size={14} /><span>Responder anónimamente...</span></button>
            )}
          </div>
        ) : (<p className="px-4 py-3 text-xs text-itec-muted border-b border-itec-border">Iniciá sesión para responder.</p>)}
        <div className="divide-y divide-itec-border">
          {loading && <ForumSkeleton count={3} />}
          {!loading && replies.length === 0 && <div className="flex flex-col items-center gap-2 py-12 text-itec-muted"><MessageSquareOff size={28} strokeWidth={1.5} /><p className="text-sm">Sin respuestas todavía</p></div>}
          {replies.map((reply, i) => <ReplyCard key={reply.id} reply={reply} isLast={i === replies.length - 1} onVote={handleVote} onDelete={handleDelete} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-itec-bg min-h-full">
      <div className="sticky top-0 z-10 bg-itec-bg/90 backdrop-blur-md border-b border-itec-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><Users size={16} className="text-itec-accent" /><h1 className="text-sm font-semibold text-itec-text">Foro Anónimo</h1></div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="p-1.5 rounded-full text-itec-muted hover:text-itec-text hover:bg-itec-surface transition-colors" title="Actualizar"><RefreshCw size={14} /></button>
          {user && <button onClick={() => setComposing(true)} className="flex items-center gap-1.5 text-xs font-semibold bg-itec-accent hover:bg-itec-accent/90 text-white px-3 py-1.5 rounded-full transition-all"><PenSquare size={13} /> Publicar</button>}
        </div>
      </div>

      {/* BANNER UI NOTIFICACIONES PUSH */}
      {isSupported && permission !== 'denied' && !isSubscribed && user && (
        <div className="bg-itec-box border border-itec-accent/20 m-4 p-4 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <Bell className="text-itec-accent mt-0.5" size={18} />
            <div>
              <h3 className="text-sm font-bold text-itec-text">Recibí respuestas</h3>
              <p className="text-xs text-itec-muted mt-0.5 max-w-[200px]">Activá las alertas para saber cuándo comentan tus posts anónimos.</p>
            </div>
          </div>
          <button onClick={subscribeToPush} className="bg-itec-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-itec-accent/90 transition-colors whitespace-nowrap">
            Activar
          </button>
        </div>
      )}

      {composing && user && <div className="px-4 py-3 border-b border-itec-border"><ComposeBox placeholder="¿Qué querés compartir? Tu identidad es anónima..." autoFocus onSubmit={submitPost} onCancel={() => setComposing(false)} /></div>}
      {!composing && <div className="px-4 py-2 border-b border-itec-border"><p className="text-[11px] text-itec-muted">🔒 Todas las publicaciones son <strong className="text-itec-text/60">anónimas</strong>.</p></div>}
      
      {error && <div className="flex items-center gap-2 px-4 py-3 bg-itec-accent/10 border-b border-itec-accent/20 text-itec-accent text-sm"><AlertCircle size={14} /><span>{error}</span><button onClick={refresh} className="ml-auto underline text-xs">Reintentar</button></div>}
      {loading && posts.length === 0 && <ForumSkeleton count={6} />}
      {!loading && posts.length === 0 && !error && <div className="flex flex-col items-center gap-3 py-16 text-itec-muted"><MessageSquareOff size={36} strokeWidth={1} /><p className="text-sm font-medium">Sin publicaciones</p></div>}
      
      <div>{posts.map((post) => <PostCard key={post.id} post={post} onOpen={openThread} onVote={handleVote} onDelete={handleDelete} />)}</div>
      
      {hasMore && <div className="flex justify-center py-6"><button onClick={loadMore} disabled={loadingMore} className="flex items-center gap-2 text-sm text-itec-sky hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">{loadingMore ? <><Loader2 size={14} className="animate-spin" /> Cargando...</> : "Ver más publicaciones"}</button></div>}
    </div>
  );
};
