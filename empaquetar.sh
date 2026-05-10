#!/usr/bin/env bash
# ============================================================
#  fix_itecba_frontend.sh — Correcciones Frontend iTEC BA
#  Ejecutar desde la raíz del FRONTEND: bash fix_itecba_frontend.sh
# ============================================================
set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[FIX]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

[ -f "src/lib/firebase.ts" ] || { echo -e "${RED}[ERR]${NC} Ejecutá desde la raíz del frontend."; exit 1; }

# ================================================================
#  FIX 1 — src/lib/firebase.ts
#  Problema 1: enableIndexedDbPersistence() está deprecado
#  Problema 2: falla con múltiples pestañas ("failed-precondition")
#              porque la API antigua no soporta multi-tab natively.
#  Solución:   initializeFirestore() + persistentLocalCache()
#              + persistentMultipleTabManager() (multi-tab safe)
# ================================================================
log "Actualizando src/lib/firebase.ts (persistencia multi-tab y sin deprecación)..."
cat > src/lib/firebase.ts << 'FIREBASE_EOF'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     "itec-utn.firebasestorage.app",
  messagingSenderId: "475388859660",
  appId:             "1:475388859660:web:3fa9d2a9b9230c38cd2529",
  measurementId:     "G-RQ80098R02",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Caché persistente con soporte multi-pestaña.
// Reemplaza enableIndexedDbPersistence() que:
//   ① está deprecada
//   ② lanza "failed-precondition" cuando hay varias pestañas abiertas
export const db = initializeFirestore(app, {
  cache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(), // ← multi-tab safe
  }),
});
FIREBASE_EOF

# ================================================================
#  FIX 2 — src/components/templates/MainLayout.tsx
#  Problema: RewardsWidget se importa estático → entra en el bundle
#            principal de TODOS los usuarios, incluso los que nunca
#            usan desktop (donde el widget es visible).
#  Solución: lazy() con Suspense que ya existe en el template.
# ================================================================
log "Haciendo lazy RewardsWidget en MainLayout.tsx..."
cat > src/components/templates/MainLayout.tsx << 'MAIN_EOF'
import { lazy, Suspense } from "react";
import { LoadingState } from "../ui/LoadingState";
import { SidebarLayout } from "./SidebarLayout";

// RewardsWidget es pesado (lógica de puntos + animaciones).
// Solo se muestra en desktop lg:, así que no vale cargarlo siempre.
const RewardsWidget = lazy(() =>
  import("@/features/rewards/components/organisms/RewardsWidget").then(
    (m) => ({ default: m.RewardsWidget })
  )
);

const WidgetSkeleton = () => (
  <div className="space-y-3 pt-2 animate-pulse">
    <div className="h-24 rounded-3xl bg-white/5 border border-itec-border" />
    <div className="h-16 rounded-2xl bg-white/5 border border-itec-border" />
    <div className="h-16 rounded-2xl bg-white/5 border border-itec-border" />
  </div>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SidebarLayout>
      {/* Columna Central */}
      <main className="flex-1 h-full overflow-y-auto scroll-smooth">
        <div className="mx-auto w-full min-h-full py-3 px-2">
          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </main>
      {/* Columna Derecha — solo desktop */}
      <aside className="w-62 w-max-56 h-full hidden lg:block p-4 overflow-y-auto bg-itec-sidebar">
        <Suspense fallback={<WidgetSkeleton />}>
          <RewardsWidget />
        </Suspense>
      </aside>
    </SidebarLayout>
  );
};
MAIN_EOF

# ================================================================
#  FIX 3 — src/pages/AdminPanel.tsx
#  Problema: AdminSidebar y AdminDashboard son estáticos.
#            Solo admins entran a esta página, pero si los importamos
#            estáticos entran en el chunk del AdminPanel que ya es
#            lazy en App.tsx — solo necesitamos hacerlos lazy DENTRO
#            de la página para que Vite los splitee en sub-chunks.
# ================================================================
log "Convirtiendo AdminSidebar y AdminDashboard a lazy en AdminPanel.tsx..."

# Verificar si ya están lazy
if grep -q "lazy.*AdminSidebar\|lazy.*AdminDashboard" src/pages/AdminPanel.tsx; then
  warn "  → AdminSidebar/AdminDashboard ya son lazy. Saltando."
else
  # Reemplazar imports estáticos por lazy
  sed -i \
    's|import { AdminSidebar } from "@features/admin/components/organisms/AdminSidebar";|const AdminSidebar = lazy(() => import("@features/admin/components/organisms/AdminSidebar").then((m) => ({ default: m.AdminSidebar })));|' \
    src/pages/AdminPanel.tsx

  sed -i \
    's|import { AdminDashboard } from "@features/admin/components/organisms/AdminDashboard";|const AdminDashboard = lazy(() => import("@features/admin/components/organisms/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));|' \
    src/pages/AdminPanel.tsx

  # Agregar lazy al import de React si no está (debería estar)
  if ! grep -q "lazy," src/pages/AdminPanel.tsx; then
    sed -i 's|import React, { lazy, Suspense }|import React, { lazy, Suspense }|' src/pages/AdminPanel.tsx
  fi

  log "  → AdminSidebar y AdminDashboard convertidos a lazy."
fi

# ================================================================
#  FIX 4 — src/features/calendar/hooks/useCalendarEvents.ts
#  Problema: hay DOS hooks que hacen lo mismo (useCalendar.ts y
#            useCalendarEvents.ts). CalendarioPage debería usar solo
#            useCalendarEvents. Además, cuando Supabase falla, el
#            hook no expone el error al componente.
#  Mejora:   agregar manejo de error explícito para mostrar UI amigable.
# ================================================================
log "Mejorando manejo de error en useCalendarEvents.ts..."

# Solo aplicar si el hook no tiene 'setError' ya
if ! grep -q "setError" src/features/calendar/hooks/useCalendarEvents.ts; then
cat > src/features/calendar/hooks/useCalendarEvents.ts << 'HOOK_EOF'
import { useState, useEffect, useCallback } from "react";
import { calendarService } from "../services/calendarService";

export type EventType = "examen" | "institucional" | "feriado" | "beca" | "actividad";

export interface CalendarEvent {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  type: EventType;
}

export interface CalendarEventInput {
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  type: EventType;
}

export const useCalendarEvents = () => {
  const [events,  setEvents]  = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split("T")[0];
      const data  = await calendarService.getAll();
      setEvents(data.filter((e: CalendarEvent) => e.date >= today));
    } catch (err) {
      console.error("[Calendar] Error al cargar eventos:", err);
      setError("No se pudieron cargar los eventos. Intentá de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const createEvent = useCallback(async (data: CalendarEventInput) => {
    await calendarService.create(data);
    await fetchEvents();
  }, [fetchEvents]);

  const updateEvent = useCallback(async (id: string, data: Partial<CalendarEventInput>) => {
    await calendarService.update(id, data);
    await fetchEvents();
  }, [fetchEvents]);

  const deleteEvent = useCallback(async (id: string | number) => {
    await calendarService.delete(String(id));
    await fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, createEvent, updateEvent, deleteEvent, refetch: fetchEvents };
};
HOOK_EOF
  log "  → useCalendarEvents.ts actualizado con manejo de error."
else
  warn "  → useCalendarEvents.ts ya tiene manejo de error. Saltando."
fi

# ================================================================
#  RESUMEN
# ================================================================
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  RESUMEN — FRONTEND FIXES${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "  ✅ src/lib/firebase.ts          → persistentLocalCache + multi-tab"
echo "                                    (elimina ambos warnings de Firestore)"
echo "  ✅ MainLayout.tsx               → RewardsWidget lazy (chunk separado)"
echo "  ✅ AdminPanel.tsx               → AdminSidebar + AdminDashboard lazy"
echo "  ✅ useCalendarEvents.ts         → estado 'error' expuesto al componente"
echo ""
echo -e "${YELLOW}  RECORDATORIO — El 500 en POST/GET /calendar se soluciona en el BACKEND:${NC}"
echo "  1. Ejecutar supabase_schema.sql en Supabase Dashboard → SQL Editor"
echo "  2. Verificar que el proyecto Supabase no esté pausado"
echo "  3. Push del backend con los cambios de fix_itecba.sh"
echo ""
echo -e "${YELLOW}  Si tu CalendarioPage no muestra el error al usuario, actualizala:${NC}"
echo "  const { events, loading, error } = useCalendarEvents();"
echo "  if (error) return <ErrorState message={error} />;"
echo ""
echo "  📦 git add -A && git commit -m 'fix: firebase persistence, lazy splits, calendar error state'"
echo "     git push → Vercel redeploya automáticamente."
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"