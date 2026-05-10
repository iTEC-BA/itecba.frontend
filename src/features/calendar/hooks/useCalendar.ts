import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { CalendarEvent } from '../types/calendar';

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await calendarService.getAll();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  return { events, loading, refresh: fetchEvents };
};
