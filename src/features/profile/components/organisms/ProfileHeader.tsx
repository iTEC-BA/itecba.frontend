import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { AvatarRing } from "@features/profile/components/atoms/AvatarRing";
import { PointsBadgeProfile } from "@features/profile/components/atoms/PointsBadgeProfile";
import { CareerChip } from "@features/profile/components/atoms/CareerChip";
import { EditProfileModal } from "@features/profile/components/molecules/EditProfileModal";
import { cn } from "@/lib/utils";
export const ProfileHeader: React.FC = () => {
  const { user } = useAuth();
  const { careers, isDoubleMajor, startYear } = useMultiCareer();
  const [editing, setEditing] = useState(false);
  if (!user) return null;
  const currentYear = new Date().getFullYear();
  const yearsIn = startYear ? currentYear - startYear + 1 : null;
  return (
    <>
      <div className="relative mb-5">
        <div className="h-28 sm:h-36 rounded-3xl overflow-hidden bg-gradient-to-br from-itec-primary via-itec-box to-itec-bg border border-itec-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.08),transparent_60%)]" />
          <div className="absolute top-3 right-4">
            <button
              onClick={() => setEditing(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold",
                "bg-black/30 border border-white/15 text-white/80",
                "hover:bg-black/50 hover:text-white transition-all backdrop-blur-sm"
              )}
            >
              ✏️ Editar perfil
            </button>
          </div>
        </div>
        <div className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5 -mt-10 sm:-mt-12">
            <AvatarRing
              src={user.photoURL ?? undefined}
              name={user.name ?? user.email ?? "U"}
              size="xl"
              ring="border-4 border-itec-bg bg-itec-surface"
              className="shrink-0 z-10"
            />
            <div className="flex-1 min-w-0 pb-2 sm:pb-3">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-itec-text tracking-tight">
                  {user.name ?? "Sin nombre"}
                </h1>
                {user.role === "admin" && (
                  <span className="text-[9px] font-black px-2 py-0.5 bg-itec-accent/15 border border-itec-accent/30 text-itec-accent rounded-lg tracking-widest uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-itec-muted font-mono mb-2 truncate">
                {user.email}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {careers.length > 0 ? careers.map((c) => (
                  <CareerChip key={c.code} label={c.name} code={c.code} colorClass={c.colorClass} />
                )) : (
                  <CareerChip label="Sin carrera" active={false} />
                )}
                {isDoubleMajor && (
                  <span className="text-[9px] font-black bg-itec-amber/10 border border-itec-amber/20 text-itec-amber px-2 py-0.5 rounded-lg">
                    🎓 Doble Título
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-2 sm:pb-3 shrink-0">
              <PointsBadgeProfile points={user.points ?? 0} size="sm" />
              {user.legajo && (
                <span className="text-[10px] font-mono text-itec-muted bg-itec-surface border border-itec-border px-2.5 py-1 rounded-xl">
                  #{user.legajo}
                </span>
              )}
              {yearsIn && (
                <span className="text-[10px] text-itec-muted bg-itec-surface border border-itec-border px-2.5 py-1 rounded-xl">
                  🗓 {yearsIn}° año
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </>
  );
};
