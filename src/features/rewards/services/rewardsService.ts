import type { Reward, RedemptionPayload, RewardFormData } from "../types/rewards";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const rewardsService = {
  getAvailableRewards: async (token: string): Promise<Reward[]> => {
    const response = await fetch(`${API_URL}/rewards/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error fetching rewards");
    return response.json();
  },

  getAllRewards: async (token: string): Promise<Reward[]> => {
    const response = await fetch(`${API_URL}/rewards/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error fetching all rewards");
    return response.json();
  },

  redeemReward: async (payload: RedemptionPayload, rewardId: string, token: string) => {
    const response = await fetch(`${API_URL}/rewards/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rewardId, payload }),
    });
    if (!response.ok) throw new Error("Error al canjear");
    return response.json();
  },

  createReward: async (data: RewardFormData, token: string): Promise<Reward> => {
    const response = await fetch(`${API_URL}/rewards/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear beneficio");
    return response.json();
  },

  updateReward: async (id: string, data: Partial<RewardFormData>, token: string): Promise<Reward> => {
    const response = await fetch(`${API_URL}/rewards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar beneficio");
    return response.json();
  },

  deleteReward: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/rewards/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al eliminar beneficio");
  },
};
