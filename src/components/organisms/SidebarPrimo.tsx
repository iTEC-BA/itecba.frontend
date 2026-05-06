import { ProfileTarjetecSmall } from "@/features/profile/components/atoms/ProfileTarjetecSmall";
import { useAuth } from "../../context/AuthContext";
import { useSidebarLinks } from "../../hooks/useSidebarLinks";
import { SidebarItem } from "../molecules/SidebarItem";
import { Icons } from "../ui/icons/Icons";

export const SidebarPrimo = () => {
  const { user } = useAuth();
  const { visibleLinks, isExpanded, toggleExpand, totalLinks } =
    useSidebarLinks();

  const ChevronIcon = isExpanded ? "chevronUp" : "chevronDown";

  return (
    <aside className="w-45 xl:w-50 h-full hidden md:flex flex-col bg-itec-sidebar overflow-y-auto hover:scrollbar-thin scrollbar-thumb-itec-surface">
      <nav className="p-2">
        {user && <ProfileTarjetecSmall user={user} />}
      </nav>
      <nav className="flex flex-col gap-3 p-2">
        {visibleLinks.map(({ path, label, iconName, iconColor }) => (
          <SidebarItem
            key={path}
            path={path}
            label={label}
            iconName={iconName}
            iconColor={iconColor}
          />
        ))}

        {totalLinks > 5 && (
          <button
            onClick={toggleExpand}
            className="flex items-center gap-2 mt-1 rounded-lg transition-colors duration-200 cursor-pointer text-itec-text-reverse hover:bg-itec-surface w-full text-left group"
          >
            <div className="flex items-center justify-center rounded-full bg-itec-surface group-hover:bg-itec-surface/80 transition-colors size-7">
              {ChevronIcon && (
                <Icons
                  type={ChevronIcon}
                  className="w-5 h-5 text-itec-text-reverse"
                />
              )}
            </div>
            <p className="font-medium text-base">
              {isExpanded ? "Ver menos" : "Ver más"}
            </p>
          </button>
        )}
      </nav>
    </aside>
  );
};
