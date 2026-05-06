import { Icons } from "@/components/ui/icons/Icons";
import { useRewards } from "../../hooks/useRewards";

export default function RewardsPointsItem({ children }: { children: React.ReactNode }) {
  const { pointsBalance } = useRewards();
  return (
    <div className="flex justify-center items-center gap-2 w-fit">
      <Icons type="star" className="size-4 text-yellow-500" />
      <span className="text-itec-text leading-none">
        {pointsBalance}
      </span>
      {children ?<span className="text-sm">{children}</span> :<></> }
    </div>
  );
}
