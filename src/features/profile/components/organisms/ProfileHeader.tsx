import React, { useState } from "react";
import { useAuthStore } from '@/stores/authStore';
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { AvatarRing } from "@features/profile/components/atoms/AvatarRing";
import { PointsBadgeProfile } from "@features/profile/components/atoms/PointsBadgeProfile";
import { CareerChip } from "@features/profile/components/atoms/CareerChip";
import { EditProfileModal } from "@features/profile/components/molecules/EditProfileModal";
import { Button } from "@components/ui/Button";
import { Icons } from "@/components/ui/icons/Icons";
import { Edit3, LogOut, MapPin, Mail, Phone, ExternalLink, BookOpen } from "lucide-react";

export const ProfileHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { careers, isDoubleMajor, startYear } = useMultiCareer();
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  const currentYear = new Date().getFullYear();
  const yearsIn = startYear ? currentYear - startYear + 1 : null;
  const bio = (user as any).bio;
  const github = (user as any).github;
  const phone = (user as any).phone;

  return (
    <>
      <div className="w-full bg-itec-box border border-itec-border rounded-[2rem] mb-6 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-0 h-full">
          
          {/* Lado Izquierdo: Solo Avatar y Acciones */}
          <div className="md:w-1/3 flex flex-row items-center justify-center text-center gap-4 p-8 bg-itec-red/5 border-b md:border-b-0 md:border-r md:flex-col border-itec-red/10">
            <AvatarRing
              src={user.photoURL ?? undefined}
              name={user.name ?? user.email ?? "U"}
              size="2xl"
              glow={false}
              ring="border-4 border-itec-red-skye/30 bg-itec-surface"
              className="shrink-0 mb-6 transition-transform duration-300 hover:scale-105"
            />
            
            <div className="w-full flex flex-col gap-3">
              <Button variant="danger" hierarchy="solid" onClick={() => setEditing(true)} fullWidth className="py-2.5">
                <Edit3 className="w-4 h-4 mr-2" /> Editar perfil
              </Button>
              <Button variant="danger" hierarchy="ghost" onClick={logout} fullWidth className="py-2.5 hover:bg-itec-red/10">
                <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
              </Button>
            </div>
          </div>

          {/* Lado Derecho: Nombre, Puntos e Información Sin Bordes */}
          <div className="md:w-2/3 flex flex-col justify-center p-2 md:p-8">
            {/* Nombre y Puntos movidos acá */}
            <div className="flex flex-col justify-between mb-4 gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{user.name ?? "Estudiante ITEC"}</h1>
                <PointsBadgeProfile points={user.points ?? 0} size="sm" />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {careers.length > 0 ? (
                careers.map((career, index) => (
                  <CareerChip 
                    key={`${career.name}-${index}`} 
                    label={career.name} 
                    code={career.code} 
                    colorClass={index === 0 ? "bg-itec-purple/10 border-transparent text-itec-purple" : "bg-rose-500/10 border-transparent text-rose-400"} 
                  />
                ))
              ) : (
                <CareerChip label="Carrera pendiente" active={false} colorClass="bg-white/5 border-transparent text-itec-muted" />
              )}
              {isDoubleMajor && (
                <span className="rounded-xl bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-400">
                  Doble carrera
                </span>
              )}
              {yearsIn && (
                <span className="rounded-xl bg-white/5 px-3 py-1 text-xs font-semibold text-itec-text flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-itec-gray"/> {yearsIn}° año
                </span>
              )}
            </div>

            <h2 className="text-[10px] font-bold mb-2 uppercase tracking-widest">Sobre mí</h2>
            {/* Información SIN bordes */}
            <p className="text-sm text-itec-text/80 mb-6 leading-relaxed bg-itec-red/5 p-4 rounded-xl">
              {bio ? bio : <span className="italic opacity-50">Sin biografía disponible. ¡Editá tu perfil para contarnos sobre vos!</span>}
            </p>

            <h2 className="text-[10px] font-bold  mb-3 uppercase tracking-widest">Contacto e Información</h2>
            
            {/* Semántica de Colores en el Contacto (SIN BORDES) */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-itec-blue-skye shrink-0"/>
                <span className="text-white truncate">{user.email}</span>
              </li>
              
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-itec-emerald shrink-0"/>
                  <span className="text-white truncate">{phone}</span>
                </li>
              )}
              
              {github && (
                <li>
                  <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                  <Icons type="github" className="w-4 h-4 text-white shrink-0"/>
                  <span className="text-white truncate flex items-center gap-2">
                    {github.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3 opacity-50" />
                  </span>
                  </a>
                </li>
              )}
              
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0"/>
                <span className="text-white truncate">UTN FRBA</span>
              </li>
            </ul>

          </div>
        </div>
      </div>

      {editing && <EditProfileModal onClose={() => setEditing(false)} />}
    </>
  );
};
