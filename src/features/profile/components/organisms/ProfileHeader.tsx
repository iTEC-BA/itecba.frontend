import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { AvatarRing } from "@features/profile/components/atoms/AvatarRing";
import { PointsBadgeProfile } from "@features/profile/components/atoms/PointsBadgeProfile";
import { CareerChip } from "@features/profile/components/atoms/CareerChip";
import { EditProfileModal } from "@features/profile/components/molecules/EditProfileModal";
import { Button } from "@components/ui/Button";
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
      <section className={cn(
        "relative overflow-hidden rounded-[2rem] border border-itec-border",
        "bg-gradient-to-br from-itec-box via-itec-box2 to-itec-bg",
        "shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.05]" />
        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <AvatarRing
                src={user.photoURL ?? undefined}
                name={user.name ?? user.email ?? "U"}
                size="2xl"
                glow
                ring="border-4 border-itec-box bg-itec-surface"
                className="shrink-0"
              />

              <div className="max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <PointsBadgeProfile points={user.points ?? 0} size="sm" />
                  <span className="rounded-full border border-itec-border bg-itec-surface px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-itec-muted">
                    Perfil ITEC
                  </span>
                  {isDoubleMajor && (
                    <span className="rounded-full border border-itec-purple/20 bg-itec-purple/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-itec-purple">
                      Doble carrera
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-black tracking-tight text-itec-text sm:text-4xl">
                  {user.name ?? "Estudiante ITEC"}
                </h1>
                <p className="mt-1 text-sm text-itec-muted sm:text-base">
                  {user.email}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {careers.length > 0 ? (
                    careers.map((career, index) => (
                      <CareerChip
                        key={`${career.code}-${index}`}
                        label={career.name}
                        code={career.code}
                        colorClass={index === 0 ? "bg-itec-sky/10 border-itec-sky/25 text-itec-sky" : "bg-itec-purple/10 border-itec-purple/25 text-itec-purple"}
                      />
                    ))
                  ) : (
                    <CareerChip label="Carrera pendiente" active={false} />
                  )}
                  {yearsIn && (
                    <span className="rounded-2xl border border-itec-border bg-itec-surface px-2.5 py-1 text-xs font-bold text-itec-text">
                      {yearsIn}° año aprox.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" hierarchy="outline" icon="✎" onClick={() => setEditing(true)}>
                Editar perfil
              </Button>
            </div>
          </div>
        </div>
      </section>

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </>
  );
};
