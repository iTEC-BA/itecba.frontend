import React from "react";
import { LayoutGrid, Ticket, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BenefitFilter } from "@features/benefits/types/benefits";

interface Props {
  active: BenefitFilter;
  onChange: (f: BenefitFilter) => void;
  counts?: Partial<Record<BenefitFilter, number>>;
}

const TABS: { key: BenefitFilter; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "Todos", icon: LayoutGrid },
  { key: "free", label: "Gratis", icon: Gift },
  { key: "points", label: "Canje", icon: Ticket },
];

export const BenefitFilterTabs: React.FC<Props> = ({ active, onChange, counts }) => {
  return (
    <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 no-scrollbar">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        const count = counts?.[tab.key];
        
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-colors",
              isActive
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
            {count !== undefined && (
              <span
                className={cn(
                  "ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] leading-none",
                  isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/50"
                )}
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
