// src/features/admin/components/organisms/AdminSidebar.tsx
import React          from "react";
import { useAuth }    from "@context/AuthContext";
import { SIDEBAR_LINKS, type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { cn }         from "@/lib/utils";

interface AdminSidebarProps {
  active:       AdminSection;
  onNavigate:   (s: AdminSection) => void;
  mobileOpen:   boolean;
  onClose:      () => void;
}

// ── Ítem del sidebar ──────────────────────────────────────────────────────────
const SidebarNavItem: React.FC<{
  link:      (typeof SIDEBAR_LINKS)[0];
  isActive:  boolean;
  onClick:   () => void;
}> = ({ link, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={link.description}
    className={cn(
      "group w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl",
      "text-sm font-bold text-left transition-all duration-200 outline-none",
      "focus:ring-2 focus:ring-itec-sky/30",
      isActive
        ? "bg-itec-sky/15 text-itec-sky border border-itec-sky/25 shadow-sky/5"
        : "text-itec-muted hover:text-itec-text hover:bg-itec-surface/70"
    )}
  >
    <span className={cn(
      "text-base shrink-0 transition-transform duration-200",
      "group-hover:scale-110"
    )}>
      {link.emoji}
    </span>
    <span className="flex-1 truncate">{link.label}</span>
    {link.badge !== undefined && (
      <span className="ml-auto shrink-0 text-[10px] font-black bg-itec-accent/20 text-itec-accent px-1.5 py-0.5 rounded-md">
        {link.badge}
      </span>
    )}
    {isActive && (
      <span className="shrink-0 w-1 h-1 rounded-full bg-itec-sky" />
    )}
  </button>
);

// ── Contenido del sidebar ─────────────────────────────────────────────────────
const SidebarContent: React.FC<Omit<AdminSidebarProps, "mobileOpen">> = ({
  active, onNavigate, onClose,
}) => {
  const { user } = useAuth();
  return (
    <aside className={cn(
      "flex flex-col h-full",
      "bg-itec-sidebar border-r border-itec-border",
      "overflow-y-auto custom-scrollbar"
    )}>
      {/* Logo / Header */}
      <div className="px-4 py-5 border-b border-itec-border shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-itec-muted uppercase tracking-widest mb-0.5">
              Panel de Control
            </p>
            <h2 className="text-sm font-black text-itec-text flex items-center gap-1.5">
              🔧 Admin ITEC
            </h2>
          </div>
          {/* Cerrar en mobile */}
          <button
            onClick={onClose}
            aria-label="Cerrar sidebar"
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-itec-muted hover:text-itec-text hover:bg-itec-surface transition-all"
          >
            ✕
          </button>
        </div>
        {user && (
          <div className="mt-3 flex items-center gap-2">
            <img
              src={user.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "A")}&background=1C1C1E&color=E5E6EA`}
              alt="admin"
              className="w-7 h-7 rounded-full border border-itec-border"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-itec-text truncate">
                {user.name ?? user.email?.split("@")[0]}
              </p>
              <p className="text-[10px] text-itec-accent font-bold">⚡ Administrador</p>
            </div>
          </div>
        )}
      </div>

      {/* Links */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[9px] font-black text-itec-border uppercase tracking-widest px-4 py-2">
          Secciones
        </p>
        {SIDEBAR_LINKS.map((link) => (
          <SidebarNavItem
            key={link.id}
            link={link}
            isActive={active === link.id}
            onClick={() => onNavigate(link.id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-itec-border shrink-0">
        <p className="text-[10px] text-itec-border text-center">
          ITEC.BA · Panel Admin
        </p>
      </div>
    </aside>
  );
};

// ── Export principal ──────────────────────────────────────────────────────────
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  active, onNavigate, mobileOpen, onClose,
}) => (
  <>
    {/* ── Desktop: sidebar fijo ── */}
    <div className="hidden lg:flex w-56 shrink-0 h-full">
      <SidebarContent active={active} onNavigate={onNavigate} onClose={onClose} />
    </div>

    {/* ── Mobile: overlay + drawer animado ── */}
    {mobileOpen && (
      <>
        {/* Backdrop */}
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden animate-fade-in"
        />
        {/* Drawer */}
        <div className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 lg:hidden",
          "animate-slide-in-left"
        )}>
          <SidebarContent active={active} onNavigate={onNavigate} onClose={onClose} />
        </div>
      </>
    )}
  </>
);
