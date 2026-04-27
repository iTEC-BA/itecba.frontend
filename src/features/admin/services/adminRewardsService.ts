import { Reward } from '@features/rewards/types/rewards';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const adminRewardsService = {
  createReward: async (rewardData: Partial<Reward>, token: string): Promise<Reward> => {
    const response = await fetch(`${API_URL}/rewards/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rewardData),
    });
    
    if (!response.ok) throw new Error('Error al crear el beneficio');
    return response.json();
  }
};