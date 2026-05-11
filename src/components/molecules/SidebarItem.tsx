// src/components/molecules/SidebarItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarBadge, SidebarTag } from "@components/atoms/SidebarState";

interface SidebarItemProps {
  path: string;
  label: string;
  icon: React.ElementType; // <-- Ahora recibe un componente
  badge?: string;
  tag?: { text: string | number; color: "green" | "gold" };
  /** Callback ejecutado al hacer clic — sirve para cerrar el drawer en mobile */
  onNavigate?: () => void;
}

export const SidebarItem = ({ path, label, icon: Icon, badge, tag, onNavigate }: SidebarItemProps) => {
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
      {/* Se renderiza el icono de lucide directamente */}
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
      {badge && <SidebarBadge>{badge}</SidebarBadge>}
      {tag && <SidebarTag color={tag.color}>{tag.text as string}</SidebarTag>}
    </NavLink>
  );
};