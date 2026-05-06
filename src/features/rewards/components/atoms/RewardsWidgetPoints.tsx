import { Icons } from "@/components/ui/icons/Icons";
import { useRewards } from "../../hooks/useRewards";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

type RewardsWidgetPointsProps = {
  children?: ReactNode;
};

export function RewardsWidgetPoints({ children }: RewardsWidgetPointsProps) {
  const { pointsBalance } = useRewards();
  const { isAuthenticated } = useAuth();
  return (
    isAuthenticated ? (
      <div className="flex justify-center items-center gap-2 w-fit">
        <Icons type="star" className="size-4 text-yellow-500" />
        <span className="text-itec-text leading-none">{pointsBalance}</span>
        {children ? <span className="text-sm">{children}</span> : null}
      </div>
    ) : null
  );
}
