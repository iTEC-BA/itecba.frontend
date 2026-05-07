import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import type { RewardType } from "../../types/rewards";
import { REWARD_TYPE_CONFIG } from "../../types/rewards";

interface Props {
  type: RewardType;
  size?: "sm" | "md";
}

export const RewardTypeBadge: React.FC<Props> = ({ type, size = "sm" }) => {
  const config = REWARD_TYPE_CONFIG[type] ?? REWARD_TYPE_CONFIG.mentorship;
  const { label, icon, cls } = config;
  const sizeCls =
    size === "md"
      ? "gap-1.5 px-2.5 py-1 text-xs"
      : "gap-1 px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider border ${cls} ${sizeCls}`}
    >
      <Icons type={icon} className="size-2.5 shrink-0" />
      {label}
    </span>
  );
};
