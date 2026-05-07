// src/features/rewards/hooks/useRewards.ts
// FIX: Agregado guard de autenticación para evitar loop infinito de fetches.
// El hook ahora NO llama a la API si el usuario no está autenticado.
import { useState, useEffect, useCallback } from 'react';
import { rewardsService } from '../services/rewardsService';
import { Reward, RedemptionPayload } from '../types/rewards';
import { useAuth } from '@context/AuthContext';
import { getAuth } from 'firebase/auth';

export const useRewards = () => {
  const { user, isAuthenticated, addPoints } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointsBalance, setPointsBalance] = useState<number>(user?.points || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    setPointsBalance(user?.points || 0);
  }, [user?.points]);

  const fetchRewards = useCallback(async () => {
    // GUARD: no fetchear si el usuario no está autenticado
    if (!isAuthenticated) {
      setRewards([]);
      setIsLoading(false);
      return;
    }

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
  }, [isAuthenticated]); // DEPENDENCIA CORRECTA: solo re-ejecutar si cambia el estado de auth

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
      const response = await rewardsService.redeemReward(payload, rewardId, token);

      if (response.success) {
        addPoints(-cost);
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
