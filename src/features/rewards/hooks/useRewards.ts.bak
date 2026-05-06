// src/features/rewards/hooks/useRewards.ts
import { useState, useEffect, useCallback } from 'react';
import { rewardsService } from '../services/rewardsService';
import { Reward, RedemptionPayload } from '../types/rewards';
import { useAuth } from '@context/AuthContext';
import { getAuth } from 'firebase/auth';

export const useRewards = () => {
  const { user, addPoints } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointsBalance, setPointsBalance] = useState<number>(user?.points || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    setPointsBalance(user?.points || 0);
  }, [user?.points]);

  const fetchRewards = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) return;
      const token = await authUser.getIdToken();
      const data = await rewardsService.getAvailableRewards(token);
      setRewards(data);
    } catch (error) {
      console.error("Error al cargar beneficios:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleRedeem = async (payload: RedemptionPayload, rewardId: string, cost: number) => {
    if (pointsBalance < cost) return false;

    setIsRedeeming(true);
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) throw new Error("Usuario no autenticado en Firebase");

      const token = await authUser.getIdToken();
      
      console.log("Enviando canje al backend...", { rewardId, payload });
      const response = await rewardsService.redeemReward(payload, rewardId, token);
      
      if (response.success) {
        // Descuento visual inmediato sin tocar la DB de nuevo
        addPoints(-cost, false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Fallo en el proceso de canje:", error);
      return false;
    } finally {
      setIsRedeeming(false);
    }
  };

  return { rewards, pointsBalance, isLoading, isRedeeming, handleRedeem, refreshRewards: fetchRewards };
};