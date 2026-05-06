// src/components/molecules/SidebarItem.tsx
// Mejora: agrega prop `onNavigate` para cerrar el drawer mobile al hacer clic en un ítem.

import { NavLink } from "react-router-dom";
import { Icons } from "@components/ui/icons/Icons";
import { SidebarBadge, SidebarTag } from "@components/atoms/SidebarState";

interface SidebarItemProps {
  path: string;
  label: string;
  iconName: string;
  badge?: string;
  tag?: { text: string; color: "green" | "gold" };
  /** Callback ejecutado al hacer clic — sirve para cerrar el drawer en mobile */
  onNavigate?: () => void;
}

export const SidebarItem = ({ path, label, iconName, badge, tag, onNavigate }: SidebarItemProps) => {
  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
          isActive
            ? "bg-white/8 text-itec-text font-medium"
            : "text-[#8a93a2] hover:bg-white/5 hover:text-itec-text"
        }`
      }
    >
      <Icons type={iconName} className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
      {badge && <SidebarBadge>{badge}</SidebarBadge>}
      {tag && <SidebarTag color={tag.color}>{tag.text}</SidebarTag>}
    </NavLink>
  );
};