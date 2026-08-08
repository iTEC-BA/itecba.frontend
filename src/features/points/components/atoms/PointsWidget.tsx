import React from "react";
import { useAuth } from "@context/AuthContext";

export const PointsWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <div className="inline-flex items-center gap-1 font-bold text-itec-rewards text-xs tracking-tight">
      <p className="text-xs">{(user?.points ?? 0)}</p>
      <p className="text-xs">pts</p>
    </div>
  );
};
