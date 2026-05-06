import { Link, useLocation } from "react-router-dom";
import { Icons } from "../ui/icons/Icons";
import { SidebarBadge,SidebarTag } from "../atoms/SidebarState";

export interface SidebarItemProps {
  path: string;
  label: string;
  iconName: string;
  badge?: string;
  tag?: { text?: string; color: "gold" | "green" };
  onClick?: () => void;
}

export const SidebarItem = ({ path, label, iconName, badge, tag, onClick }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-[9px] py-2 px-[14px] mx-1.5 rounded-[9px] cursor-pointer transition-colors text-[13px] ${
        isActive
          ? "bg-itec-red/15 text-[#e01540]"
          : "text-[#9aa3b0] hover:bg-[#1c2535]"
      }`}
    >
      <div className="w-[17px] h-[17px] flex items-center justify-center shrink-0">
        <Icons
          type={iconName}
          className={`w-full h-full ${isActive ? "text-[#e01540]" : "text-[#5a6475]"}`}
        />
      </div>
      <span className="truncate">{label}</span>

      {badge && <SidebarBadge>{badge}</SidebarBadge>}
      {tag && <SidebarTag color={tag.color}>{tag.text}</SidebarTag>}
    </Link>
  );
};