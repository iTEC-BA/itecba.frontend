import { useState, useEffect, useCallback } from "react";
import { calendarService } from "../services/calendarService";
import { useAuthStore } from '@/stores/authStore';

export type EventType = "examen" | "institucional" | "feriado" | "beca" | "actividad";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  date: string; // YYYY-MM-DD
  type: EventType;
}

export interface CalendarEventInput {
  title: string;
  description: string;
  subtitle?: string;
  date: string;
  type: EventType;
}

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar solo lo necesario desde AuthContext
  const { isAdmin } = useAuthStore();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calendarService.getAll();
      const today = new Date().toISOString().slice(0, 10);
      
      // Normalizar la fecha de Supabase a YYYY-MM-DD para evitar fallos de filtro
      const normalizedData = (data as CalendarEvent[]).map((e) => ({
        ...e,
        date: e.date.split("T")[0],
      }));

      setEvents(normalizedData.filter((e: CalendarEvent) => e.date >= today));
    } catch (err: unknown) {
      console.error("Error al cargar eventos", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const createEvent = useCallback(async (data: CalendarEventInput) => {
    if (!isAdmin) return;
    type CreateEventPayload = Parameters<typeof calendarService.create>[0];
    await calendarService.create(data as unknown as CreateEventPayload);
    await fetchEvents();
  }, [isAdmin, fetchEvents]);

  const updateEvent = useCallback(async (id: string, data: Partial<CalendarEventInput>) => {
    if (!isAdmin) return;
    await calendarService.update(id, data);
    await fetchEvents();
  }, [isAdmin, fetchEvents]);

  const deleteEvent = useCallback(async (id: string) => {
    if (!isAdmin) return;
    await calendarService.delete(id);
    await fetchEvents();
  }, [isAdmin, fetchEvents]);

  // Retorna: events (eventos del calendario), loading (estado de carga), error (mensaje de error),
  // createEvent (crear evento), updateEvent (actualizar evento), deleteEvent (eliminar evento)
  return { events, loading, error, createEvent, updateEvent, deleteEvent };
};