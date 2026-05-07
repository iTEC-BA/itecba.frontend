import { useEffect, useState } from "react";
import { profileService, type Benefit } from "../services/profileService";

type Category = "medrano" | "campus" | "digital";

interface UseProfileBenefitsReturn {
  benefits:    Benefit[];
  loading:     boolean;
  error:       string | null;
  activeTab:   Category;
  setActiveTab:(cat: Category) => void;
  refetch:     () => void;
}

export const useProfileBenefits = (): UseProfileBenefitsReturn => {
  const [benefits,  setBenefits]  = useState<Benefit[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Category>("medrano");
  const [tick,      setTick]      = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    profileService
      .getBenefits(activeTab)
      .then((data) => { if (!cancelled) setBenefits(data); })
      .catch((e)   => { if (!cancelled) setError(e.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab, tick]);

  return { benefits, loading, error, activeTab, setActiveTab, refetch: () => setTick((t) => t + 1) };
};
