import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import { PointsRing } from "../atoms/PointsRing";
import { useAuth } from "@context/AuthContext";

const getLevelInfo = (pts: number) => {
  if (pts >= 1000) return { label: "Platino", emoji: "💎", next: null, nextPts: 0 };
  if (pts >= 500) return { label: "Oro", emoji: "🥇", next: "Platino", nextPts: 1000 };
  if (pts >= 200) return { label: "Plata", emoji: "🥈", next: "Oro", nextPts: 500 };
  return { label: "Bronce", emoji: "🥉", next: "Plata", nextPts: 200 };
};

const getMotivationalText = (pts: number): string => {
  if (pts === 0) return "Participá en actividades de ITEC para sumar puntos";
  if (pts < 100) return "¡Buen comienzo! Seguí acumulando puntos";
  if (pts < 200) return "Ya podés canjear algunos beneficios";
  if (pts < 500) return "¡Vas muy bien! Cerca de nivel Oro";
  if (pts < 1000) return "¡Estás en Oro! Alcanzá el nivel Platino";
  return "¡Nivel máximo! Sos parte de la élite de ITEC";
};

export const PointsHeader: React.FC = () => {
  const { user } = useAuth();
  const pts = user?.points ?? 0;
  const level = getLevelInfo(pts);
  const motivational = getMotivationalText(pts);
  const ringMax = level.nextPts > 0 ? level.nextPts : 1000;
  const ringBase = level.label === "Plata" ? 200 : level.label === "Oro" ? 500 : level.label === "Platino" ? 0 : 0;
  const ringPts = pts - ringBase;
  const ringMaxRelative = ringMax - ringBase;

  return (
    <div className="relative overflow-hidden rounded-xl border border-itec-rewards/12 bg-itec-box p-5 sm:p-7">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex items-center gap-4 sm:gap-0">
          <PointsRing
            points={Math.max(0, ringPts)}
            maxPoints={Math.max(1, ringMaxRelative)}
            size={88}
            label="pts"
          />
          <div className="sm:hidden flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-itec-rewards/70 mb-0.5">
              Tu saldo
            </p>
            <p className="text-3xl font-bold text-itec-text tracking-tight tabular-nums leading-none">
              {pts.toLocaleString()}
              <span className="text-sm font-bold text-itec-rewards/60 ml-1.5">PTS</span>
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-itec-rewards/70 mb-0.5">
              Tu saldo de puntos
            </p>
            <p className="text-4xl font-bold text-itec-text tracking-tight tabular-nums leading-none">
              {pts.toLocaleString()}
              <span className="text-lg font-bold text-itec-rewards/60 ml-2">PTS</span>
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-3">
            <span className="text-base">{level.emoji}</span>
            <span className="text-sm font-bold text-itec-text/80">{level.label}</span>
            {level.next && (
              <>
                <span className="text-xs text-itec-text/40">→ {level.next}: {level.nextPts.toLocaleString()} pts</span>
              </>
            )}
          </div>

          <p className="text-xs text-itec-text/40 mt-1.5 leading-relaxed">{motivational}</p>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-2 bg-itec-box border border-itec-rewards/15 rounded-xl px-4 py-2.5">
            <Icons type="star" className="size-5 text-itec-rewards" />
            <div>
              <p className="text-[10px] text-itec-rewards/70 font-bold uppercase tracking-wider leading-none mb-0.5">
                Disponibles
              </p>
              <p className="text-xl font-bold text-itec-text tabular-nums leading-none">
                {pts.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
