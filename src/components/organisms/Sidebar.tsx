import { ProfileTarjetecSmall } from "@/features/profile/components/atoms/ProfileTarjetecSmall";
import { useAuth } from "../../context/AuthContext";
import { useSidebarLinks } from "../../hooks/useSidebarLinks";
import { SidebarItem } from "../molecules/SidebarItem";
import { SidebarLabel, SidebarDivider, SidebarProtect } from "../atoms/SidebarState";

export const Sidebar = () => {
  const { user, isAuthenticated } = useAuth();
  const { sections, footerLinks } = useSidebarLinks();

  const getSidebarMeta = (link: {
    requireAuth?: unknown;
    requireAdmin?: unknown;
    badge?: unknown;
    tag?: unknown;
  }) => ({
    requireAuth: typeof link.requireAuth === "boolean" ? link.requireAuth : undefined,
    requireAdmin: typeof link.requireAdmin === "boolean" ? link.requireAdmin : undefined,
    badge: typeof link.badge === "string" ? link.badge : undefined,
    tag: link.tag && typeof link.tag === "object" && "text" in link.tag ? link.tag as { text?: string; color: "green" | "gold" } : undefined,
  });

  return (
    <aside className="w-55 h-full hidden md:flex flex-col bg-itec-sidebar border-r border-white/5 overflow-y-auto py-4 custom-scrollbar">
      
      {/* TarjeTEC solo visible si está autenticado */}
      <nav className="px-2.5 mb-3.5">
        {isAuthenticated && user && <ProfileTarjetecSmall user={user} />}
      </nav>

      <nav className="flex flex-col flex-1">
        {/* Secciones dinámicas */}
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col mb-1">
            <SidebarLabel>{section.title}</SidebarLabel>
            {section.links.map((link) => {
              const { requireAuth, requireAdmin, badge, tag } = getSidebarMeta(link);

              return (
                <SidebarProtect
                  key={link.path}
                  requireAuth={requireAuth}
                  requireAdmin={requireAdmin}
                >
                  <SidebarItem
                    path={link.path}
                    label={link.label}
                    iconName={link.iconName}
                    badge={badge}
                    tag={tag}
                  />
                </SidebarProtect>
              );
            })}
          </div>
        ))}

        <SidebarDivider />

        {/* Enlaces inferiores (con protecciones) */}
        <div className="flex flex-col">
          {footerLinks.map((link) => {
            const { requireAuth, requireAdmin, badge, tag } = getSidebarMeta(link);

            return (
              <SidebarProtect
                key={link.path}
                requireAuth={requireAuth}
                requireAdmin={requireAdmin}
              >
                <SidebarItem
                  path={link.path}
                  label={link.label}
                  iconName={link.iconName}
                  badge={badge}
                  tag={tag}
                />
              </SidebarProtect>
            );
          })}
        </div>
      </nav>
      
    </aside>
  );
};