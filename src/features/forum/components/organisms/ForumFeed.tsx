import React, { useEffect, useRef } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useForum } from "../../hooks/useForum";
import { PostCard } from "../molecules/PostCard";
import { ForumSkeleton } from "../molecules/ForumSkeleton";
import { ActivityPanel } from "./ActivityPanel";
import { MentionsPanel } from "./MentionsPanel";
import { TrendingBanner } from "../atoms/TrendingBanner";
import { ThreadView } from "./ThreadView";
import { ComposeModal } from "../molecules/ComposeModal";
import type { ForumTab } from "../../types/forum";
import { useAuth } from "@/context/AuthContext";

const TABS: { id: ForumTab; label: string }[] = [
  { id: "para-ti", label: "Para ti" },
  { id: "siguiendo", label: "Siguiendo" },
  { id: "utn-ba", label: "UTN BA" },
  { id: "tendencias", label: "🔥 Tendencias" },
];

export const ForumFeed: React.FC = () => {
  const {
    posts,
    activeThread,
    view,
    loading,
    loadingMore,
    error,
    hasMore,
    activeTab,
    composing,
    loadMore,
    openThread,
    closeThread,
    setActiveTab,
    submitPost,
    submitReply,
    handleVote,
    handleRepost,
    handleDelete,
    setComposing,
    refresh,
  } = useForum();

  const { isAuthenticated } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore) loadMore();
      },
      { threshold: 0.1 },
    );
    if (bottomRef.current) obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  // Thread view
  if (view === "thread" && activeThread) {
    return (
      <ThreadView
        post={activeThread.post}
        replies={activeThread.replies}
        loading={loading}
        onClose={closeThread}
        onVote={handleVote}
        onRepost={handleRepost}
        onDelete={handleDelete}
        onReply={submitReply}
      />
    );
  }

  return (
    <div className="flex flex-col bg-itec-bg min-h-full relative">
      {/* Header fijo */}
      <header className="sticky top-0 z-20 bg-itec-bg/85 backdrop-blur-md border-b border-itec-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-itec-text">Foro Anónimo</h1>
          <button
            onClick={refresh}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-itec-muted hover:text-itec-text transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Tabs en píldoras — estilo prototipo */}
        <nav
          className="flex gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-none"
          role="tablist"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ${
                activeTab === t.id
                  ? "bg-itec-red border-itec-red-skye  text-white shadow-sm shadow-purple-900/30"
                  : "border-itec-border text-itec-muted hover:border-itec-red/40 hover:text-itec-red-skye bg-transparent"
              }`}
            >
              {activeTab === t.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Contenido principal */}
      {activeTab === "tendencias" ? (
        /* Panel Actividad */
        <ActivityPanel />
      ) : activeTab === "siguiendo" ? (
        /* Panel Menciones/Siguiendo */
        <MentionsPanel />
      ) : (
        <>
          {/* Trending banner */}
          {activeTab === "para-ti" && <TrendingBanner />}

          {/* Error */}
          {error && (
            <div className="mx-4 my-3 p-3 rounded-xl bg-itec-accent/10 border border-itec-accent/20 text-sm text-itec-accent">
              {error} —{" "}
              <button
                onClick={refresh}
                className="underline hover:no-underline"
              >
                reintentar
              </button>
            </div>
          )}

          {/* Feed */}
          {loading ? (
            <ForumSkeleton count={6} />
          ) : posts.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 px-4 text-center text-xs">
              <span className="text-4xl opacity-30">💬</span>
              <p className="font-bold text-itec-text">Sin publicaciones</p>
              <p className="text-itec-muted">Sé el primero en publicar algo.</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  onRepost={handleRepost}
                  onDelete={handleDelete}
                  onClick={openThread}
                />
              ))}

              {/* Infinite scroll trigger */}
              <div ref={bottomRef} className="h-4" />

              {loadingMore && (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-itec-border border-t-purple-500 rounded-full animate-spin" />
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-8">
                  <div className="flex-1 h-px bg-itec-border" />
                  <span className="text-xs text-itec-muted font-mono">
                    fin del feed
                  </span>
                  <div className="flex-1 h-px bg-itec-border" />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* FAB: botón flotante de composición */}
      {isAuthenticated && (
        <>
          <button
            onClick={() => setComposing(true)}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-12 h-12 rounded-2xl bg-itec-red hover:bg-itec-red/80 text-white flex items-center justify-center shadow-xl shadow-itec-red-33 transition-all active:scale-95 z-30"
            title="Nueva publicación"
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>

          {/* Compose modal */}
          <ComposeModal
            isOpen={composing}
            onClose={() => setComposing(false)}
            onSubmit={submitPost}
          />
        </>
      )}

    </div>
  );
};
