import React from "react";
import { useAuth } from "@context/AuthContext";
import { Star } from "lucide-react";

export const RewardsWidgetPoints: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <div className="inline-flex items-center gap-1 font-bold text-itec-rewards text-xs tracking-tight">
      <Star size="12" />
      <p className="text-xs">{(user?.points ?? 0)}</p>
      <p className="text-xs">pts</p>
    </div>
  );
};
