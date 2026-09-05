import { usePointsStore } from '@/stores/pointsStore';
import { useState, useEffect, useCallback } from "react";
import { getAuth } from "firebase/auth";
import { benefitsService } from "../services/benefitsService";
import type { Benefit, BenefitFilter, RedemptionPayload } from "../types/benefits";
import { isFreeBenefit } from "../types/benefits";
import { useAuthStore } from '@/stores/authStore';

export const useBenefits = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addPoints } = usePointsStore();;
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [pointsBalance, setPointsBalance] = useState<number>(user?.points ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BenefitFilter>("all");

  useEffect(() => {
    setPointsBalance(user?.points ?? 0);
  }, [user?.points]);

  const fetchBenefits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authUser = getAuth().currentUser;
      const token = authUser ? await authUser.getIdToken() : undefined;
      const data = await benefitsService.getBenefits(token);
      setBenefits(data);
    } catch (err) {
      console.error("Error al cargar beneficios:", err);
      setError("No se pudieron cargar los beneficios");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  const handleRedeem = async (
    payload: RedemptionPayload,
    benefitId: string,
    cost: number,
  ): Promise<boolean> => {
    if (!isAuthenticated) return false;
    if (pointsBalance < cost) return false;
    setIsRedeeming(true);
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) throw new Error("No autenticado");
      const token = await authUser.getIdToken();
      const response = await benefitsService.redeemBenefit(payload, benefitId, token);
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

  const filteredBenefits = benefits.filter((b) => {
    if (filter === "free") return isFreeBenefit(b);
    if (filter === "points") return !isFreeBenefit(b);
    return true;
  });

  return {
    benefits,
    filteredBenefits,
    filter,
    setFilter,
    pointsBalance,
    isLoading,
    isRedeeming,
    error,
    handleRedeem,
    refreshBenefits: fetchBenefits,
  };
};
