import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { AvatarRing } from "@features/profile/components/atoms/AvatarRing";
import { PointsBadgeProfile } from "@features/profile/components/atoms/PointsBadgeProfile";
import { CareerChip } from "@features/profile/components/atoms/CareerChip";
import { EditProfileModal } from "@features/profile/components/molecules/EditProfileModal";
import { Button } from "@components/ui/Button";
import { Edit3, LogOut } from "lucide-react";

export const ProfileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { careers, isDoubleMajor, startYear } = useMultiCareer();
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  const currentYear = new Date().getFullYear();
  const yearsIn = startYear ? currentYear - startYear + 1 : null;

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-itec-box border border-itec-border p-6 sm:p-8 shadow-glass transition-all">

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          
          {/* Lado Izquierdo: Avatar e Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <AvatarRing
              src={user.photoURL ?? undefined}
              name={user.name ?? user.email ?? "U"}
              size="2xl"
              glow
              ring="border-2 border-itec-border bg-itec-bg"
              className="shrink-0"
            />

            <div className="max-w-2xl">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
                {user.name ?? "Estudiante ITEC"}
              </h1>
              <p className="text-sm font-medium text-itec-muted mt-0.5">
                {user.email}
              </p>

              {/* Badges de perfil */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PointsBadgeProfile points={user.points ?? 0} size="sm" />
                <span className="rounded-full border border-itec-border bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-itec-muted">
                  Perfil ITEC
                </span>
                {isDoubleMajor && (
                  <span className="rounded-full border border-itec-purple/20 bg-itec-purple/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-itec-purple">
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
                          ? "bg-itec-blue/20 border-itec-blue-skye/30 text-itec-blue-skye"
                          : "bg-itec-purple/10 border-itec-purple/30 text-itec-purple"
                      }
                    />
                  ))
                ) : (
                  <CareerChip 
                    label="Carrera pendiente" 
                    active={false} 
                    colorClass="bg-white/5 border-itec-border text-itec-muted" 
                  />
                )}
                
                {yearsIn && (
                  <span className="rounded-xl border border-itec-border bg-white/5 px-3 py-1.5 text-xs font-semibold text-itec-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-itec-emerald animate-pulse" />
                    {yearsIn}° año aprox.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lado Derecho: Acciones */}
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 mt-2 lg:mt-0 shrink-0">
            <Button
              variant="slate"
              hierarchy="outline"
              onClick={() => setEditing(true)}
              className="w-full sm:w-auto"
            >
              <Edit3 size={16} aria-hidden="true" />
              Editar perfil
            </Button>
            <Button
              variant="danger"
              hierarchy="ghost"
              onClick={logout}
              className="w-full sm:w-auto"
            >
              <LogOut size={16} aria-hidden="true" />
              Cerrar sesión
            </Button>
          </div>
          
        </div>
      </section>

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </>
  );
};