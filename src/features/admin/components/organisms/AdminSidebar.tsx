import React from "react";
import { useAuth } from "@context/AuthContext";
import { SIDEBAR_LINKS, type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  active: AdminSection;
  onNavigate: (s: AdminSection) => void;
  mobileOpen: boolean;
  onClose: () => void;
}

const SidebarNavItem: React.FC<{
  link: (typeof SIDEBAR_LINKS)[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ link, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={link.description}
    className={cn(
      "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all duration-200 outline-none",
      "focus:ring-2 focus:ring-itec-sky/30",
      isActive
        ? "border border-itec-sky/25 bg-itec-sky/12 text-itec-sky shadow-[0_10px_24px_rgba(56,189,248,0.08)]"
        : "border border-transparent text-itec-muted hover:border-itec-border hover:bg-itec-surface/70 hover:text-itec-text"
    )}
  >
    <span className="shrink-0 text-base transition-transform group-hover:scale-110">{link.emoji}</span>
    <span className="flex-1 truncate">{link.label}</span>
    {link.badge !== undefined && (
      <span className="shrink-0 rounded-full bg-itec-accent/15 px-2 py-0.5 text-[10px] font-black text-itec-accent">
        {link.badge}
      </span>
    )}
    {isActive && <span className="h-2 w-2 shrink-0 rounded-full bg-itec-sky" />}
  </button>
);

const SidebarContent: React.FC<Omit<AdminSidebarProps, "mobileOpen">> = ({
  active,
  onNavigate,
  onClose,
}) => {
  const { user } = useAuth();

  return (
    <aside className={cn(
      "flex h-full flex-col overflow-y-auto border-r border-itec-border",
      "bg-gradient-to-b from-itec-sidebar via-itec-box to-itec-bg"
    )}>
      <div className="shrink-0 border-b border-itec-border px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Panel de control</p>
            <h2 className="mt-1 text-base font-black text-itec-text">Admin ITEC</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:bg-itec-box2 hover:text-itec-text lg:hidden"
          >
            ✕
          </button>
        </div>

        {user && (
          <div className="mt-4 flex items-center gap-3 rounded-[1.2rem] border border-itec-border bg-itec-surface/60 px-3 py-3">
            <img
              src={user.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "A")}&background=1C1C1E&color=E5E6EA`}
              alt="admin"
              className="h-10 w-10 rounded-full border border-itec-border object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-itec-text">
                {user.name ?? user.email?.split("@")[0]}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-itec-accent">Administrador</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2 p-3">
        <p className="px-3 pb-1 text-[9px] font-black uppercase tracking-[0.25em] text-itec-muted">Secciones</p>
        {SIDEBAR_LINKS.map((link) => (
          <SidebarNavItem
            key={link.id}
            link={link}
            isActive={active === link.id}
            onClick={() => onNavigate(link.id)}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-itec-border p-4">
        <div className="rounded-[1.2rem] border border-itec-border bg-itec-surface/60 px-4 py-3 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">ITEC.BA</p>
          <p className="mt-1 text-xs font-bold text-itec-text">Dashboard administrativo</p>
        </div>
      </div>
    </aside>
  );
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  active,
  onNavigate,
  mobileOpen,
  onClose,
}) => (
  <>
    <div className="hidden h-full w-64 shrink-0 lg:flex">
      <SidebarContent active={active} onNavigate={onNavigate} onClose={onClose} />
    </div>

    {mobileOpen && (
      <>
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
        <div className="fixed left-0 top-0 z-50 h-full w-[86vw] max-w-sm lg:hidden">
          <SidebarContent active={active} onNavigate={onNavigate} onClose={onClose} />
        </div>
      </>
    )}
  </>
);
