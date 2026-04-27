import { Reward, RedemptionPayload } from '../types/rewards';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const rewardsService = {
  getAvailableRewards: async (token: string): Promise<Reward[]> => {
    const response = await fetch(`${API_URL}/rewards/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error fetching rewards');
    return response.json();
  },

  redeemReward: async (payload: RedemptionPayload, rewardId: string, token: string) => {
    const response = await fetch(`${API_URL}/rewards/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      // ENVIAMOS rewardId y payload en la raíz del body
      body: JSON.stringify({ rewardId, payload })
    });
    
    if (!response.ok) throw new Error('Error al canjear el beneficio');
    return response.json();
  }
};