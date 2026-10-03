import { auth } from "@/lib/firebase";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/calendar`;
let eventsRequest: Promise<CalendarEvent[]> | null = null;

const getHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

interface CalendarEvent {
  [key: string]: unknown;
}

export const calendarService = {
  getAll: async () => {
    if (!eventsRequest) {
      eventsRequest = (async () => {
        const res = await fetch(API_URL);
        if (!res.ok) {
          const detail = await res.json().catch(() => null) as { message?: string } | null;
          throw new Error(detail?.message || `Error obteniendo calendario (HTTP ${res.status})`);
        }
        return res.json() as Promise<CalendarEvent[]>;
      })().finally(() => {
        eventsRequest = null;
      });
    }
    return eventsRequest;
  },
  create: async (data: CalendarEvent) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error creando evento");
    return res.json();
  },
  update: async (id: string, data: CalendarEvent) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error actualizando evento");
    return res.json();
  },
  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: await getHeaders()
    });
    if (!res.ok) throw new Error("Error borrando evento");
  }
};