import React from "react";
import { useAdminData } from "../hooks/useAdminData";
import { NewsForm } from "../components/molecules/NewsForm";
import { NewsFeed } from "../components/molecules/NewsFeed";
import { Megaphone } from "lucide-react";

export const NewsManagement: React.FC = () => {
  const { announcements, isLoadingAnnouncements, createAnnouncementMutation, deleteAnnouncementMutation } = useAdminData();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted mb-1">
          Comunicación Global
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-itec-text flex items-center gap-2">
          <Megaphone className="w-6 h-6" />
          Avisos
        </h2>
        <p className="text-xs text-itec-muted mt-1">
          Publicá novedades, alertas o información importante para toda la comunidad estudiantil.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] items-start">
        <NewsForm createMutation={createAnnouncementMutation} />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-itec-text">Feed de comunicados</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Visibles en la plataforma</p>
            </div>
            <span className="rounded-full border border-white/20 bg-transparent px-3 py-1 text-[10px] font-bold text-white tracking-widest uppercase">
              {announcements.length} activos
            </span>
          </div>
          <NewsFeed
            announcements={announcements}
            isLoading={isLoadingAnnouncements}
            deleteMutation={deleteAnnouncementMutation}
          />
        </div>
      </div>
    </div>
  );
};
