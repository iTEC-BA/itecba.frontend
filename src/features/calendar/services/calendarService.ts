import { auth } from "@/lib/firebase";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/calendar`;

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
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error obteniendo calendario");
    return res.json();
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