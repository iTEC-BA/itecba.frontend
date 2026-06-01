import { useEffect } from "react";
import { ProfileTarjetecSmall } from "@features/profile/components/atoms/ProfileTarjetecSmall";
import { useAuth } from "@context/AuthContext";
import { useSidebarLinks } from "@hooks/useSidebarLinks";
import { SidebarItem } from "@components/molecules/SidebarItem";
import { SidebarLabel, SidebarDivider, SidebarProtect } from "@components/atoms/SidebarState";
import { useSidebarMobile } from "@hooks/useSidebarMobile";
 
export const Sidebar = () => {
  const { user, isAuthenticated } = useAuth();
  const { sections, footerLinks } = useSidebarLinks();
  const { isOpen, close } = useSidebarMobile();
 
  // Bloquear scroll del body cuando el drawer mobile está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
 
  const getSidebarMeta = (link: any) => ({
    requireAuth: typeof link.requireAuth === "boolean" ? link.requireAuth : undefined,
    requireAdmin: typeof link.requireAdmin === "boolean" ? link.requireAdmin : undefined,
    badge: typeof link.badge === "string" ? link.badge : undefined,
    tag:
      link.tag && typeof link.tag === "object" && "text" in link.tag
        ? (link.tag as { text: string | number; color: "green" | "gold" })
        : undefined,
  });
 
  const SidebarContent = () => (
    <aside className="w-55 h-full flex flex-col bg-itec-sidebar border-r border-white/5 overflow-y-auto py-4 custom-scrollbar">
      {/* TarjeTEC solo visible si está autenticado */}
      <nav className="px-2.5 mb-3.5">
        {isAuthenticated && user && (
          <ProfileTarjetecSmall user={user} />
        )}
      </nav>
 
      <nav className="flex flex-col flex-1">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col mb-1">
            <SidebarLabel>{section.title}</SidebarLabel>
            {section.links.map((link: any) => {
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
                    icon={link.icon} // <-- Actualizado
                    badge={badge}
                    tag={tag}
                  />
                </SidebarProtect>
              );
            })}
          </div>
        ))}
 
        <SidebarDivider />
 
        <div className="flex flex-col">
          {footerLinks.map((link: any) => {
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
                  icon={link.icon} // <-- Actualizado
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
 
  return (
    <>
      {/* ── Desktop: sidebar fijo, siempre visible ── */}
      <div className="hidden md:flex h-full">
        <SidebarContent />
      </div>
 
      {/* ── Mobile: overlay + drawer deslizable ── */}
      {/* Overlay oscuro */}
      <div
        className={`md:hidden fixed inset-0 z-[200] bg-black/60  transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />
 
      {/* Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 z-[201] h-full w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <SidebarContent />
      </div>
    </>
  );
};