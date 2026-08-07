import { RedemptionRecord } from '@features/rewards/types/rewards';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const adminRedemptionsService = {
  getAllRedemptions: async (token: string): Promise<RedemptionRecord[]> => {
    const res = await fetch(`${API_URL}/rewards/redemptions`, { headers: { Authorization: `Bearer ${token}` } });
    return res.json();
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
