import { useState, useEffect, useCallback } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, query, orderBy, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@context/AuthContext";

export type EventType =
  | "examen"
  | "institucional"
  | "feriado"
  | "beca"
  | "actividad";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  createdAt?: Timestamp;
}

export interface CalendarEventInput {
  title: string;
  description: string;
  subtitle?: string;
  date: string;
  type: EventType;
}

/** Retorna solo eventos cuya fecha >= hoy (cliente filtra expirados) */
export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, "calendar_events"),
      orderBy("date", "asc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const today = new Date().toISOString().slice(0, 10);
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as CalendarEvent))
        .filter((e) => e.date >= today);
      setEvents(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const createEvent = useCallback(
    async (data: CalendarEventInput) => {
      if (user?.role !== "admin") return;
      await addDoc(collection(db, "calendar_events"), {
        ...data,
        createdAt: Timestamp.now(),
      });
    },
    [user],
  );

  const updateEvent = useCallback(
    async (id: string, data: Partial<CalendarEventInput>) => {
      if (user?.role !== "admin") return;
      await updateDoc(doc(db, "calendar_events", id), data);
    },
    [user],
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      if (user?.role !== "admin") return;
      await deleteDoc(doc(db, "calendar_events", id));
    },
    [user],
  );

  return { events, loading, createEvent, updateEvent, deleteEvent };
};
