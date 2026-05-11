// src/features/trueketec/components/organisms/TrueketecFeed.tsx
import React from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { TrueketecCard } from "../molecules/TrueketecCard";
import type { TrueketecPost } from "../../types/trueketec.types";

interface Props {
  posts:       TrueketecPost[];
  myUid:       string;
  myPosts:     TrueketecPost[];
  total:       number;
  totalPages:  number;
  currentPage: number;
  loading:     boolean;
  onDelete:    (id: string) => void;
  onAccept:    (myPostId: string, targetPostId: string) => Promise<{ theirEmail: string }>;
  onPage:      (page: number) => void;
}

export const TrueketecFeed: React.FC<Props> = ({
  posts, myUid, myPosts, total, totalPages, currentPage,
  loading, onDelete, onAccept, onPage,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 rounded-3xl border border-itec-border bg-itec-box animate-pulse" />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-itec-muted">
        <Inbox size={40} className="opacity-30" />
        <p className="text-sm font-medium">No hay solicitudes activas con esos filtros.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-itec-muted">
        {total} solicitud{total !== 1 ? "es" : ""} activa{total !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {posts.map((post) => {
          const isOwn = post.userId === myUid;
          const myMatchPost = myPosts.find(
            (mp) =>
              mp.materia === post.materia &&
              (mp.comision_actual === post.comision_deseada || post.comision_deseada === "Cualquiera") &&
              (mp.comision_deseada === post.comision_actual || mp.comision_deseada === "Cualquiera")
          );
          return (
            <TrueketecCard
              key={post._id}
              post={post}
              isOwn={isOwn}
              myPostId={myMatchPost?._id}
              onDelete={isOwn ? onDelete : undefined}
              onAccept={post.isMatch && myMatchPost ? onAccept : undefined}
            />
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 rounded-2xl border border-itec-border px-3 py-2 text-sm text-itec-muted transition-colors hover:bg-itec-surface disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <span className="text-xs text-itec-muted px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 rounded-2xl border border-itec-border px-3 py-2 text-sm text-itec-muted transition-colors hover:bg-itec-surface disabled:opacity-30"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
