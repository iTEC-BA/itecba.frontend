import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { AvatarRing } from "@features/profile/components/atoms/AvatarRing";
import { PointsBadgeProfile } from "@features/profile/components/atoms/PointsBadgeProfile";
import { CareerChip } from "@features/profile/components/atoms/CareerChip";
import { EditProfileModal } from "@features/profile/components/molecules/EditProfileModal";
import { Button } from "@components/ui/Button";
import { Edit3, LogOut, BookOpen } from "lucide-react";
import { Icons } from "@/components/ui/icons/Icons";

export const ProfileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { careers, isDoubleMajor, startYear } = useMultiCareer();
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  const currentYear = new Date().getFullYear();
  const yearsIn = startYear ? currentYear - startYear + 1 : null;
  const bio = (user as any).bio;
  const github = (user as any).github;

  return (
    <>
      <section className="relative overflow-hidden rounded-[2rem] bg-itec-box border border-itec-border p-6 sm:p-10">
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
            <AvatarRing
              src={user.photoURL ?? undefined}
              name={user.name ?? user.email ?? "U"}
              size="2xl"
              glow={false}
              ring="border border-itec-border bg-itec-surface"
              className="shrink-0"
            />

            <div className="flex flex-col flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1">
                {user.name ?? "Estudiante ITEC"}
              </h1>
              <p className="text-sm font-medium text-itec-muted mb-4 flex items-center gap-2">
                {user.email}
                <span className="w-1.5 h-1.5 rounded-full bg-itec-emerald" />
              </p>

              {bio && (
                <p className="text-sm text-itec-text/70 mb-5 max-w-lg leading-relaxed border-l-2 border-itec-border pl-3">
                  "{bio}"
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <PointsBadgeProfile points={user.points ?? 0} size="sm" />
                <span className="rounded-xl border border-itec-border bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-itec-muted">
                  Perfil ITEC
                </span>
                {isDoubleMajor && (
                  <span className="rounded-xl border border-itec-purple/30 bg-itec-purple/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-itec-purple">
                    Doble carrera
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {careers.length > 0 ? (
                  careers.map((career, index) => (
                    <CareerChip
                      key={`${career.code}-${index}`}
                      label={career.name}
                      code={career.code}
                      colorClass={
                        index === 0
                          ? "bg-itec-blue-skye/10 border-itec-blue-skye/30 text-itec-blue-skye"
                          : "bg-itec-purple/10 border-itec-purple/30 text-itec-purple"
                      }
                    />
                  ))
                ) : (
                  <CareerChip label="Carrera pendiente" active={false} colorClass="bg-white/5 border-itec-border text-itec-muted" />
                )}
                
                {yearsIn && (
                  <span className="rounded-xl border border-itec-border bg-white/5 px-3 py-1.5 text-xs font-semibold text-itec-muted flex items-center gap-1.5">
                    <BookOpen size={12} className="text-itec-gray"/>
                    {yearsIn}° año
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-auto gap-3 shrink-0">
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button variant="slate" hierarchy="solid" fullWidth className="w-full py-2.5">
                  <div className="w-4 h-4"><Icons type="document" /></div> GitHub
                </Button>
              </a>
            )}
            <Button variant="secondary" hierarchy="outline" onClick={() => setEditing(true)} className="w-full sm:w-auto py-2.5">
              <Edit3 size={16} aria-hidden="true" /> Editar perfil
            </Button>
            <Button variant="danger" hierarchy="ghost" onClick={logout} className="w-full sm:w-auto py-2.5">
              <LogOut size={16} aria-hidden="true" /> Cerrar sesión
            </Button>
          </div>
          
        </div>
      </section>

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </>
  );
};
