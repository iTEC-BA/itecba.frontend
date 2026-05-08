// @ts-nocheck
import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import type { RewardType } from "../../types/rewards";
import { REWARD_TYPE_CONFIG } from "../../types/rewards";

interface Tab {
  key: string;
  label: string;
  icon: string;
  count?: number;
}

interface Props {
  activeFilter: string;
  onFilter: (f: string) => void;
  counts?: Partial<Record<string, number>>;
}

const TABS: Tab[] = [
  { key: "all", label: "Todos", icon: "star" },
  ...Object.entries(REWARD_TYPE_CONFIG).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    icon: cfg.icon,
  })),
];

export const RewardFilterTabs: React.FC<Props> = ({ activeFilter, onFilter, counts }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
      {TABS.map((tab) => {
        const isActive = activeFilter === tab.key;
        const count = counts?.[tab.key];
        return (
          <button
            key={tab.key}
            onClick={() => onFilter(tab.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 active:scale-[0.96] ${
              isActive
                ? "bg-itec-rewards/15 border border-itec-rewards/30 text-itec-rewards"
                : "bg-white/3 border border-white/8 text-itec-text/50 hover:text-itec-text hover:border-white/15"
            }`}
          >
            <Icons type={tab.icon} className="size-3 shrink-0" />
            {tab.label}
            {count !== undefined && count > 0 && (
              <span
                className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none ${
                  isActive
                    ? "bg-itec-rewards/20 text-itec-rewards"
                    : "bg-white/8 text-itec-text/40"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
