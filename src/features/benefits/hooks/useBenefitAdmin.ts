import { useState, useCallback } from "react";
import { getAuth } from "firebase/auth";
import { benefitsService } from "../services/benefitsService";
import type { Benefit, BenefitFormData } from "../types/benefits";

const getToken = async (): Promise<string> => {
  const authUser = getAuth().currentUser;
  if (!authUser) throw new Error("No autenticado");
  return authUser.getIdToken();
};

export const useBenefitAdmin = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveBenefit = useCallback(
    async (data: BenefitFormData, editId: string | null): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const token = await getToken();
        await benefitsService.saveBenefit(data, editId, token);
        onSuccess?.();
        return true;
      } catch (err) {
        console.error("Error al guardar:", err);
        setError(err instanceof Error ? err.message : "No se pudo guardar el beneficio");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  const deleteBenefit = useCallback(
    async (benefit: Benefit): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const token = await getToken();
        const id = benefit._id || benefit.id!;
        await benefitsService.deleteBenefit(id, token);
        onSuccess?.();
        return true;
      } catch (err) {
        console.error("Error al desactivar:", err);
        setError("No se pudo desactivar el beneficio");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return { saveBenefit, deleteBenefit, isSubmitting, error };
};
