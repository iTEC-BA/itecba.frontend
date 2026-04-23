import { useState, useEffect } from 'react';
import { adminService, type AnnouncementData } from '../services/adminService';

export const useAnnouncements = (isAdmin: boolean) => {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAnnouncements = async () => {
    const data = await adminService.getActiveAnnouncements();
    setAnnouncements(data);
  };

  useEffect(() => {
    if (isAdmin) loadAnnouncements();
  }, [isAdmin]);

  const createAnnouncement = async (form: { title: string, message: string, hours: string }, onSuccess: () => void) => {
    if (!form.title || !form.message) return;
    setIsSubmitting(true);
    try {
      await adminService.createAnnouncement(form.title, form.message, parseInt(form.hours));
      await loadAnnouncements();
      onSuccess();
    } catch (error: any) {
      alert(error.message || "Error al publicar aviso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este aviso?")) return;
    try {
      await adminService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      alert("Error al borrar el aviso");
    }
  };

  return { announcements, isSubmitting, createAnnouncement, deleteAnnouncement };
};