import { auth } from '@/lib/firebase';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = async () => {
  await auth.authStateReady(); // Espera a que Firebase inicialice
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('No autenticado');
  return { Authorization: `Bearer ${token}` };
};

export const inboxService = {
  getMyMessages: async () => {
    const res = await fetch(`${API_URL}/messages/my-messages`, { headers: await getAuthHeaders() });
    if (!res.ok) throw new Error('Error al cargar mensajes');
    return res.json();
  },
  markAsRead: async (id: string) => {
    const res = await fetch(`${API_URL}/messages/${id}/read`, { method: 'PATCH', headers: await getAuthHeaders() });
    if (!res.ok) throw new Error('Error al marcar como leído');
    return res.json();
  }
};
