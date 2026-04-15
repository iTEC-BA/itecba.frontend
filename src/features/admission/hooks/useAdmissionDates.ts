import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export interface AdmissionEvent {
  id?: string;
  eventName: string;
  targetDate: string; // Formato ISO: "2026-04-15T09:00"
}

export const useAdmissionDates = () => {
  const [events, setEvents] = useState<AdmissionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Traemos las fechas ordenadas
      const q = query(collection(db, 'admission_dates'), orderBy('targetDate', 'asc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as AdmissionEvent));
      setEvents(data);
    } catch (error) {
      console.error("Error cargando fechas de ingreso:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (event: Omit<AdmissionEvent, 'id'>) => {
    try {
      await addDoc(collection(db, 'admission_dates'), event);
      await fetchEvents(); // Refrescamos la lista
      return true;
    } catch (error) {
      console.error("Error agregando fecha:", error);
      return false;
    }
  };

  const removeEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'admission_dates', id));
      await fetchEvents();
    } catch (error) {
      console.error("Error borrando fecha:", error);
    }
  };

  return { events, isLoading, addEvent, removeEvent };
};