import type { RedemptionRecord } from '@features/benefits/types/benefits';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const adminRedemptionsService = {
  getAllRedemptions: async (token: string): Promise<RedemptionRecord[]> => {
    const res = await fetch(`${API_URL}/benefits/redemptions`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return Array.isArray(data.redemptions) ? data.redemptions : [];
  },
  sendMessage: async (data: {userId: string, userEmail: string, subject: string, content: string}, token: string) => {
    const res = await fetch(`${API_URL}/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
