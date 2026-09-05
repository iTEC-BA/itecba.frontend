import { useMemo } from "react";
import { useAuthStore } from '@/stores/authStore';
import type { CareerOption } from "@features/profile/components/molecules/CareerSelector";

interface Career {
  code: string;
  name: string;
}

interface User {
  careers?: Career[];
  specialty?: string;
  startYear?: number;
}

interface MultiCareerReturn {
  careers:        CareerOption[];
  primaryCareer:  CareerOption | null;
  isDoubleMajor:  boolean;
  startYear?:     number;
}

export const useMultiCareer = (): MultiCareerReturn => {
  const { user } = useAuthStore() as { user: User | null };

  const careers = useMemo<CareerOption[]>(() => {
    if (Array.isArray(user?.careers) && user.careers.length > 0) {
      return user.careers.map((c: Career) => ({
        code: c.code, 
        name: c.name
      }));
    }
    if (user?.specialty) {
      return [{ 
        code: user.specialty.substring(0, 3).toUpperCase(), 
        name: user.specialty 
      }];
    }
    return [];
  }, [user]);

  return {
    careers,
    primaryCareer:  careers[0] ?? null,
    isDoubleMajor:  careers.length > 1,
    startYear:      user?.startYear,
  };
};