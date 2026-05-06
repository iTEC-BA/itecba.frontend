import { NavLink } from "react-router-dom";
import { Icons } from "../ui/icons/Icons";

interface SidebarItemProps {
  path: string;
  label: string;
  iconName: string;
  iconColor: string;
}

export const SidebarItem = ({
  path,
  label,
  iconName,
  iconColor,
}: SidebarItemProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg transition-colors duration-200 cursor-pointer group ${
          isActive
            ? "bg-itec-primary/10 text-itec-primary font-semibold"
            : "text-itec-text-reverse hover:bg-itec-surface"
        }`
      }
    >
      <div className="flex items-center justify-center rounded-full size-7 overflow-hidden bg-itec-surface text-itec-text-reverse group-hover:bg-itec-surface/80 transition-colors">
        <Icons
          className={`size-5 text-itec-primary ${iconColor}`}
          type={iconName}
        />
      </div>
      <p>{label}</p>
    </NavLink>
  );
};
