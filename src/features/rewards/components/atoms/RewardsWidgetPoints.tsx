import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import { useAuth } from "@context/AuthContext";

export const RewardsWidgetPoints: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <div className="inline-flex items-center gap-1.5 font-black text-itec-rewards text-sm tracking-tight">
      <Icons type="star" className="size-4 shrink-0" />
      <span className="tabular-nums">{(user?.points ?? 0).toLocaleString()}</span>
      <span className="text-[10px] font-bold text-itec-rewards/60">pts</span>
    </div>
  );
};
