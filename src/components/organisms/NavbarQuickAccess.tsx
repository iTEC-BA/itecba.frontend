import { lazy, Suspense } from "react";
import { CalendarWidget } from "@/features/calendar/components/CalendarWidget";
import { QuickLinksWidget } from "@/features/home/components/atoms/QuickLinksWidget";

// Carga perezosa del widget de beneficios para no bloquear el render inicial
const BenefitsWidget = lazy(() =>
  import("@/features/benefits/components/organisms/BenefitsWidget").then((m) => ({
    default: m.BenefitsWidget,
  })),
);

// Esqueleto minimalista
const WidgetSkeleton = () => (
  <div className="space-y-4 pt-2 animate-pulse">
    <div className="h-16 rounded-xl bg-white/5 border border-white/5" />
    <div className="h-32 rounded-xl bg-white/5 border border-white/5" />
  </div>
);

export const NavbarQuickAccess = () => {
  return (
    <aside className="w-50 shrink-0 h-full hidden lg:flex flex-col p-4 overflow-y-auto custom-scrollbar bg-itec-sidebar border-l border-white/5">
      <Suspense fallback={<WidgetSkeleton />}>
        
        <div className="flex flex-col gap-6 w-full">
          {/* 1. Catálogo de Beneficios (Mantenemos tu widget original) */}
          <BenefitsWidget />

          {/* Separador Flat */}
          <div className="h-px w-full bg-white/5" />

          {/* 2. Enlaces agrupados (SIU, Campus, Aulas) */}
          <QuickLinksWidget />

          {/* Separador Flat */}
          <div className="h-px w-full bg-white/5" />

          {/* 3. Calendario Dinámico (Próximos 3 eventos) */}
          <CalendarWidget />
        </div>

        {/* Footer Minimalista */}
        <div className="mt-auto pt-8 pb-2 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-itec-muted/40">
            iTEC BA © {new Date().getFullYear()}
          </p>
        </div>
      </Suspense>
    </aside>
  );
};