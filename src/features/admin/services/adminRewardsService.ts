import type { Reward, RewardFormData } from '@features/rewards/types/rewards';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const adminRewardsService = {
  createReward: async (rewardData: Partial<RewardFormData>, token: string): Promise<Reward> => {
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
  },

  updateReward: async (id: string, rewardData: Partial<RewardFormData>, token: string): Promise<Reward> => {
    const response = await fetch(`${API_URL}/rewards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rewardData),
    });
    if (!response.ok) throw new Error('Error al actualizar el beneficio');
    return response.json();
  },

  deleteReward: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/rewards/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Error al eliminar el beneficio');
  },

  getAllRewards: async (token: string): Promise<Reward[]> => {
    const response = await fetch(`${API_URL}/rewards/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Error al cargar todos los beneficios');
    return response.json();
  },
};
