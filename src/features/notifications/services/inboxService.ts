const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const inboxService = {
  getMyMessages: async (token: string) => {
    const res = await fetch(`${API_URL}/messages/my-messages`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al cargar mensajes');
    return res.json();
  },
  markAsRead: async (id: string, token: string) => {
    const res = await fetch(`${API_URL}/messages/${id}/read`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al marcar como leído');
    return res.json();
  }
};
