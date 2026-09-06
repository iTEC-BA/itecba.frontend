import { Star } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export const PointsWidget = () => {
  const { user } = useAuthStore();
  const points = user?.points || 0;

  return (
    <div
      className="flex items-center gap-1 transition-all select-none text-itec-rewards"
      title="Puntos acumulados"
    >
      <Star className="size-4 fill-itec-rewards text-itec-rewards shrink-0" />
      <span className="text-[12px] font-bold font-mono tracking-wide mt-0.5">
        {points}
      </span>
    </div>
  );
};
