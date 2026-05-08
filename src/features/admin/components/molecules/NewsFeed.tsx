import React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons/Icons";
import type { AnnouncementData } from "../../services/adminService";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { Button } from "@components/ui/Button";

interface Props {
  announcements: AnnouncementData[];
  isLoading: boolean;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}

export const NewsFeed: React.FC<Props> = ({ announcements, isLoading, deleteMutation }) => {
  if (isLoading) return <div className="p-4 text-sm text-itec-muted animate-pulse">Cargando...</div>;

  if (announcements.length === 0) {
    return (
      <GlassCard className="flex min-h-[280px] flex-col items-center justify-center p-10 text-center" variant="default">
        <span className="text-4xl">📭</span>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-itec-muted">Bandeja vacía</p>
        <p className="mt-1 text-sm text-itec-muted">No hay avisos activos por ahora.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => (
        <GlassCard key={a.id} className="p-5" variant="elevated">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-itec-amber shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                <h4 className="truncate text-sm font-bold text-itec-text">{a.title}</h4>
              </div>
              <p className="text-sm leading-relaxed text-itec-muted">{a.message}</p>
            </div>

            <Button
              variant="danger"
              hierarchy="ghost"
              onClick={() => deleteMutation.mutate(a.id)}
              disabled={deleteMutation.isPending}
              aria-label="Quitar aviso"
            >
              <Icons type="close" />
            </Button>
          </div>

          <div className="mt-4">
            <span className="inline-flex rounded-full border border-itec-border bg-itec-surface px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-itec-muted">
              Vence: {a.expiresAt.toDate().toLocaleDateString()}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
