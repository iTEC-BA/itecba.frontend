import { InboxMessage } from '../types/rewards';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const inboxService = {
  getMyMessages: async (token: string): Promise<InboxMessage[]> => {
    const res = await fetch(`${API_URL}/messages/my-messages`, { headers: { Authorization: `Bearer ${token}` } });
    return res.json();
  },
  markAsRead: async (id: string, token: string) => {
    await fetch(`${API_URL}/messages/${id}/read`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
  }
};