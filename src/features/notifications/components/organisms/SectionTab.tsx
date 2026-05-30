import React from "react";
import { UnreadBadge } from "@features/rewards/components/atoms/UnreadBadge";

export type TabId = "notifications" | "inbox";

interface TabDef {
  id:     TabId;
  label:  string;
  icon:   React.ReactNode;
  count?: number;
}

interface Props {
  active:   TabId;
  tabs:     TabDef[];
  onChange: (id: TabId) => void;
}

export const SectionTab: React.FC<Props> = ({ active, tabs, onChange }) => (
  <div className="flex bg-white/3 border border-white/6 rounded-2xl p-1 gap-1">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`
          relative flex-1 flex items-center justify-center gap-2
          py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200
          ${active === tab.id
            ? "bg-itec-card border border-white/8 text-itec-text"
            : "text-itec-text/45 hover:text-itec-text/70"
          }
        `}
      >
        {tab.icon}
        <span>{tab.label}</span>
        {tab.count != null && tab.count > 0 && (
          <UnreadBadge count={tab.count} />
        )}
      </button>
    ))}
  </div>
);
