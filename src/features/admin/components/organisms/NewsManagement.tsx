import React from "react";
import { useAdminData } from "../../hooks/useAdminData";
import { NewsForm } from "../molecules/NewsForm";
import { NewsFeed } from "../molecules/NewsFeed";

export const NewsManagement: React.FC = () => {
  const { announcements, isLoadingAnnouncements, createAnnouncementMutation, deleteAnnouncementMutation } = useAdminData();

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <NewsForm createMutation={createAnnouncementMutation} />
      <div className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Avisos</p>
            <h3 className="mt-1 text-sm font-black text-itec-text">Feed de comunicados</h3>
          </div>
          <span className="rounded-full border border-itec-amber/20 bg-itec-amber/10 px-3 py-1 text-xs font-black text-itec-amber">
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
  );
};
