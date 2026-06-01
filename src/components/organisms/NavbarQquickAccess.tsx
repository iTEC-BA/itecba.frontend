import { lazy, Suspense } from "react";
import { Calendar, ExternalLink } from "lucide-react";

const RewardsWidget = lazy(() =>
  import("@/features/rewards/components/organisms/RewardsWidget").then((m) => ({
    default: m.RewardsWidget,
  })),
);

const WidgetSkeleton = () => (
  <div className="space-y-3 pt-2 animate-pulse">
    <div className="h-24 rounded-xl bg-white/5 border border-itec-border" />
    <div className="h-16 rounded-xl bg-white/5 border border-itec-border" />
    <div className="h-16 rounded-xl bg-white/5 border border-itec-border" />
  </div>
);

export const NavbarQquickAccess = () => {
  return (
    <>
      {/* Columna Derecha — solo desktop */}
      <aside className="w-62 w-max-56 h-full hidden lg:block p-4 overflow-y-auto bg-itec-sidebar">
        <Suspense fallback={<WidgetSkeleton />}>
          <RewardsWidget />

          {/* Separador sutil */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 2. Accesos Rápidos (Links Externos) */}
          <section className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-itec-muted pl-1">
              Accesos Rápidos
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://guarani.frba.utn.edu.ar/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
              >
                <span className="text-xs font-medium text-itec-text group-hover:text-itec-blue-skye transition-colors">
                  SIU Guaraní
                </span>
                <ExternalLink
                  size={14}
                  className="text-itec-muted group-hover:text-itec-blue-skye transition-colors"
                />
              </a>
              <a
                href="https://aulasvirtuales.frba.utn.edu.ar/login/index.php"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
              >
                <span className="text-xs font-medium text-itec-text group-hover:text-itec-blue-skye transition-colors">
                  Campus Virtual
                </span>
                <ExternalLink
                  size={14}
                  className="text-itec-muted group-hover:text-itec-blue-skye transition-colors"
                />
              </a>
            </div>
          </section>

          {/* 3. Próximas Fechas (Mini Widget) */}
          <section className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-itec-muted pl-1 flex items-center gap-1.5">
              <Calendar size={12} /> Agenda ITEC
            </h3>
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-itec-card border border-white/5 shadow-glass">
              {/* Ítem de ejemplo */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-itec-red/10 border border-itec-red/20 shrink-0">
                  <span className="text-[9px] font-bold text-itec-red uppercase leading-none">
                    May
                  </span>
                  <span className="text-sm font-black text-white leading-none mt-1">
                    19
                  </span>
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-xs font-bold text-white leading-tight">
                    Turno final MAYO
                  </span>
                  <span className="text-[10px] text-itec-muted mt-0.5">
                    No se dictarán clases
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer sutil de la columna */}
          <div className="mt-auto pt-4 pb-2 text-center">
            <p className="text-[10px] text-itec-muted opacity-50">
              iTEC BA © {new Date().getFullYear()}
            </p>
          </div>
        </Suspense>
      </aside>
    </>
  );
};
