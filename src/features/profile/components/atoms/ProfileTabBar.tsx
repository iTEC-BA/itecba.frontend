import React from "react";
import { cn } from "@/lib/utils";

export interface ProfileTab {
  id: string;
  label: string;
}

interface ProfileTabBarProps {
  tabs: ProfileTab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Barra de pestañas del perfil (Todo / Datos / Progreso / Recompensas / Actividad)
 */
export const ProfileTabBar: React.FC<ProfileTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => (
  <div
    role="tablist"
    className={cn(
      "flex overflow-x-auto border-b border-itec-border scrollbar-none",
      className
    )}
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        onClick={() => onChange(tab.id)}
        className={cn(
          "shrink-0 whitespace-nowrap px-4 py-2.5 text-[13px] transition-colors",
          "border-b-2 -mb-px",
          activeTab === tab.id
            ? "border-itec-accent text-itec-accent font-semibold"
            : "border-transparent text-itec-muted hover:text-itec-text"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
