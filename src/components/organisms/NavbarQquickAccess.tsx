import { lazy, Suspense } from "react";
import { Calendar, ExternalLink } from "lucide-react";

const BenefitsWidget = lazy(() =>
  import("@/features/benefits/components/organisms/BenefitsWidget").then((m) => ({
    default: m.BenefitsWidget,
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
          <BenefitsWidget />

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
              {/*
                TODO: Conectar con el endpoint real de fechas académicas
                (p. ej. adminService.getUpcomingDates()) y renderizar aquí
                los próximos eventos devueltos por el backend.
                Se elimina el dato quemado "Turno final MAYO — 19 de Mayo".
              */}
              <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                <Calendar size={18} className="text-itec-muted/60" />
                <p className="text-[11px] text-itec-muted">
                  No hay fechas próximas programadas.
                </p>
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
