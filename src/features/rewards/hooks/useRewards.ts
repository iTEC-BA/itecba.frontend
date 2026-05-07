import { useState, useEffect, useCallback } from "react";
import { rewardsService } from "../services/rewardsService";
import type { Reward, RedemptionPayload } from "../types/rewards";
import { useAuth } from "@context/AuthContext";
import { getAuth } from "firebase/auth";

export const useRewards = () => {
  const { user, isAuthenticated, addPoints } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointsBalance, setPointsBalance] = useState<number>(user?.points ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPointsBalance(user?.points ?? 0);
  }, [user?.points]);

  const fetchRewards = useCallback(async () => {
    if (!isAuthenticated) {
      setRewards([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) return;
      const token = await authUser.getIdToken();
      const data = await rewardsService.getAvailableRewards(token);
      setRewards(data);
    } catch (err) {
      console.error("Error al cargar beneficios:", err);
      setError("No se pudieron cargar los beneficios");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleRedeem = async (
    payload: RedemptionPayload,
    rewardId: string,
    cost: number
  ): Promise<boolean> => {
    if (pointsBalance < cost) return false;
    setIsRedeeming(true);
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) throw new Error("No autenticado");
      const token = await authUser.getIdToken();
      const response = await rewardsService.redeemReward(payload, rewardId, token);
      if (response.success) {
        await addPoints(-cost);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error en canje:", err);
      return false;
    } finally {
      setIsRedeeming(false);
    }
  };

  const affordableRewards = rewards.filter((r) => pointsBalance >= r.pointsCost);
  const lockedRewards = rewards.filter((r) => pointsBalance < r.pointsCost);

  return {
    rewards,
    affordableRewards,
    lockedRewards,
    pointsBalance,
    isLoading,
    isRedeeming,
    error,
    handleRedeem,
    refreshRewards: fetchRewards,
  };
};
