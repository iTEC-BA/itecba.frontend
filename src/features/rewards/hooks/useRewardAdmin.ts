import { useState, useCallback } from "react";
import { rewardsService } from "../services/rewardsService";
import type { Reward, RewardFormData } from "../types/rewards";
import { getAuth } from "firebase/auth";

const getToken = async (): Promise<string> => {
  const authUser = getAuth().currentUser;
  if (!authUser) throw new Error("No autenticado");
  return authUser.getIdToken();
};

export const useRewardAdmin = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReward = useCallback(async (data: RewardFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      await rewardsService.createReward(data, token);
      onSuccess?.();
      return true;
    } catch (err) {
      console.error("Error al crear:", err);
      setError("No se pudo crear el beneficio");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess]);

  const updateReward = useCallback(async (id: string, data: Partial<RewardFormData>): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      await rewardsService.updateReward(id, data, token);
      onSuccess?.();
      return true;
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError("No se pudo actualizar el beneficio");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess]);

  const deleteReward = useCallback(async (reward: Reward): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      const id = reward._id || reward.id;
      await rewardsService.deleteReward(id, token);
      onSuccess?.();
      return true;
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError("No se pudo eliminar el beneficio");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess]);

  return { createReward, updateReward, deleteReward, isSubmitting, error };
};
