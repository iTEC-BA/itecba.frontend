import React, { useMemo } from "react";
import { useAuthStore } from '@/stores/authStore';
import { SIDEBAR_LINKS, type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";
import logo from "@assets/logo.png";

interface AdminSidebarProps {
  active: AdminSection;
  onNavigate: (s: AdminSection) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ active, onNavigate, isOpen, onClose }) => {
  const { user } = useAuthStore();

  const groupedLinks = useMemo(() => {
    return SIDEBAR_LINKS.reduce((acc, link) => {
      if (!acc[link.category]) acc[link.category] = [];
      acc[link.category].push(link);
      return acc;
    }, {} as Record<string, typeof SIDEBAR_LINKS>);
  }, []);

  return (
    <>
      <div 
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/80 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/5 bg-itec-bg transition-transform duration-300 md:static md:translate-x-0 shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header Compacto */}
        <div className="flex h-14 shrink-0 items-center gap-3 px-5 border-b border-white/5 bg-white/[0.02]">
          <img src={logo} alt="iTEC" className="w-5 h-5 opacity-70 grayscale" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Panel Admin</span>
        </div>

        {/* Links Agrupados */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 custom-scrollbar">
          {Object.entries(groupedLinks).map(([category, links]) => (
            <div key={category} className="mb-6 last:mb-0">
              <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-itec-muted/60">
                {category}
              </p>
              <div className="flex flex-col gap-0.5">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors",
                      active === link.id 
                        ? "bg-white/10 text-white font-medium" 
                        : "text-itec-muted hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center opacity-80">
                      <Icons type={link.icon as any} className="w-full h-full" />
                    </div>
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Usuario */}
        {user && (
          <div className="shrink-0 border-t border-white/5 p-4 bg-white/[0.01]">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={user.photoURL ?? `https://ui-avatars.com/api/?name=${user.name}&background=171717&color=fff`} 
                className="h-7 w-7 rounded border border-white/10 bg-itec-box object-cover grayscale" 
                alt="avatar" 
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-white/90">{user.name}</p>
                <p className="truncate text-[9px] text-itec-muted font-mono">{user.email}</p>
              </div>
            </div>
            <a href="/" className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/5 py-2 text-[10px] font-bold uppercase tracking-widest text-itec-muted hover:bg-white/10 hover:text-white transition-colors">
              Volver a iTEC
            </a>
          </div>
        )}
      </aside>
    </>
  );
};
