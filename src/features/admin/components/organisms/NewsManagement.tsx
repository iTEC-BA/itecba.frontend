import React from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import { NewsForm } from '../molecules/NewsForm';
import { NewsFeed } from '../molecules/NewsFeed';

export const NewsManagement: React.FC = () => {
  const { announcements, isLoadingAnnouncements, createAnnouncementMutation, deleteAnnouncementMutation } = useAdminData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6">
        <NewsForm createMutation={createAnnouncementMutation} />
      </div>
      <div className="lg:col-span-6">
        <div className="mb-4 pl-2 flex justify-between items-center">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">Feed de Avisos</h3>
          <span className="text-xs text-orange-400 font-bold">{announcements.length} Activos</span>
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