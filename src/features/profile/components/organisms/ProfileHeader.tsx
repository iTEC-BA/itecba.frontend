import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { AvatarRing } from "@features/profile/components/atoms/AvatarRing";
import { PointsBadgeProfile } from "@features/profile/components/atoms/PointsBadgeProfile";
import { CareerChip } from "@features/profile/components/atoms/CareerChip";
import { EditProfileModal } from "@features/profile/components/molecules/EditProfileModal";
import { Button } from "@components/ui/Button";

export const ProfileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { careers, isDoubleMajor, startYear } = useMultiCareer();
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  const currentYear = new Date().getFullYear();
  const yearsIn = startYear ? currentYear - startYear + 1 : null;

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-itex-box p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col gap-6 lg:items-center lg:justify-between">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <AvatarRing
              src={user.photoURL ?? undefined}
              name={user.name ?? user.email ?? "U"}
              size="2xl"
              glow
              ring="border-2 border-itec-border bg-transparent"
              className="shrink-0"
            />

            <div className="max-w-2xl">
              <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
                {user.name ?? "Estudiante ITEC"}
              </h1>
              <p className="text-sm text-itec-muted">
                {user.email}
              </p>

             
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PointsBadgeProfile points={user.points ?? 0} size="sm" />
                <span className="rounded-full border border-itec-border bg-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-itec-muted">
                  Perfil ITEC
                </span>
                {isDoubleMajor && (
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-purple-400">
                    Doble carrera
                  </span>
                )}
              </div>

              {/* Chips de Carreras */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {careers.length > 0 ? (
                  careers.map((career, index) => (
                    <CareerChip
                      key={`${career.code}-${index}`}
                      label={career.name}
                      code={career.code}
                      colorClass={
                        index === 0
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                      }
                    />
                  ))
                ) : (
                  <CareerChip label="Carrera pendiente" active={false} />
                )}
                {yearsIn && (
                  <span className="rounded-xl border border-itec-border bg-transparent px-3 py-1.5 text-xs font-medium text-itec-muted">
                    {yearsIn}° año aprox.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Acciones */}
          <div className="flex flex-col sm:flex-row w-full gap-3 mt-2 lg:mt-0">
            <Button
              variant="slate"
              hierarchy="outline"
              icon="I"
              onClick={() => setEditing(true)}
              fullWidth
            >
              Editar perfil
            </Button>
            <Button
              variant="danger"
              hierarchy="ghost"
              icon="X"
              onClick={logout}
              fullWidth
            >
              Cerrar sesión
            </Button>
          </div>
          
        </div>
      </section>

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </>
  );
};