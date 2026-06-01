// src/features/admin/components/organisms/AdminSidebar.tsx
import React, { useEffect } from "react";
import { useAuth } from "@context/AuthContext";
import { SIDEBAR_LINKS, type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  active: AdminSection;
  onNavigate: (s: AdminSection) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ active, onNavigate, isOpen, onClose }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Fondo oscuro con blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-150 bg-black/60  animate-in fade-in duration-300"
      />

      {/* Panel lateral - Siempre sale de derecha a izquierda */}
      <aside className="fixed right-0 top-0 z-[160] h-full w-[85vw] max-w-xs border-l border-itec-border bg-itec-box shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex h-full flex-col">
          
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between border-b border-itec-border px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Admin</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Panel de control</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-itec-muted transition-colors">
              <Icons type="close" className="w-4 h-4" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {SIDEBAR_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  active === link.id ? "bg-white/10 text-white" : "text-itec-muted hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn("w-5 h-5 shrink-0", active === link.id ? "text-white" : "text-itec-muted")}>
                  <Icons type={link.icon as React.ComponentProps<typeof Icons>["type"]} />
                </div>
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer del Sidebar con Usuario */}
          {user && (
            <div className="border-t border-itec-border p-5 bg-black/10">
              <div className="flex items-center gap-3">
                <img 
                  src={user.photoURL ?? `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                  className="h-8 w-8 rounded-full border border-itec-border" 
                  alt="avatar" 
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-itec-muted uppercase">Administrador</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};