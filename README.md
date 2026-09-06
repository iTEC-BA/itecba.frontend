# 🎓 iTEC BA — Frontend & PWA

> **Nota para agentes de IA:** este documento es la fuente de verdad de
> convenciones del proyecto. Leelo completo antes de generar o modificar
> código. Ante cualquier duda entre "cómo lo haría por defecto" y "qué dice
> este README", **gana el README**. Si vas a introducir un patrón nuevo que
> no está documentado acá, agregalo a este archivo en el mismo cambio.

Bienvenido al repositorio oficial del frontend de **iTEC BA**, la plataforma
colaborativa e independiente exclusiva para estudiantes de la UTN FRBA.

Este proyecto está construido como una **Single Page Application (SPA)**
altamente interactiva y configurada como una **Progressive Web App (PWA)**,
optimizada para ofrecer una experiencia nativa tanto en escritorio como en
dispositivos móviles.

## Stack tecnológico

| Capa                  | Tecnología                                      |
|------------------------|-------------------------------------------------|
| Framework              | React 19 + TypeScript                           |
| Build tool             | Vite 7 (`@vitejs/plugin-react-swc`)             |
| Routing                | React Router 7 (`react-router-dom`)             |
| Estado de UI/cliente   | **Zustand**                                     |
| Estado de servidor     | **TanStack Query** (`@tanstack/react-query`)    |
| Estilos                | Tailwind CSS 4 (`@tailwindcss/vite`)            |
| Autenticación / datos  | Firebase (Auth + Firestore)                     |
| Backend propio         | API REST (Express, ver `VITE_API_URL`)          |
| PWA                    | `vite-plugin-pwa` + Workbox                     |
| Analítica              | `react-ga4` (Google Analytics)                  |
| Markdown / LaTeX       | `react-markdown`, `remark-math`, `rehype-katex`, `katex` |
| IA                     | `@google/generative-ai` (usado en `faqs` / chatbot) |
| Otros                  | `@supabase/supabase-js`, `react-qr-code`        |

Cada tecnología de esta tabla tiene una responsabilidad fija y **no se
mezclan entre sí** (ver sección 3). Antes de agregar una librería nueva,
confirmar que ninguna de las existentes ya resuelve el problema.

---

## 1. Sistema de Diseño (UI/UX)

La plataforma utiliza un diseño **Dark Theme por defecto**, enfocado en el
**Flat Design Institucional**. El objetivo es transmitir seriedad, orden y
velocidad, simulando un sistema de gestión universitaria moderno.

### 1.1 Reglas Visuales y Restricciones

* **Paleta de Colores Estricta:** no se deben usar colores arbitrarios de
  Tailwind. Se deben usar las variables CSS globales definidas en
  `index.css`.
* **Prohibido el uso de sombras y degradados:** para mantener un diseño
  limpio y rápido (Flat), no se deben utilizar clases como `shadow-lg`,
  `shadow-[...]`, `bg-gradient-to-...` ni desenfoques (`blur`).
* **Componentes Modales:** todas las interacciones complejas deben
  renderizarse usando la plantilla global `<LayoutModal/>` para mantener la
  consistencia móvil/escritorio.

### 1.2 Simulación de Profundidad (Estricto Flat Design)

Queda **completamente prohibido** el uso de `shadow-*`, `drop-shadow-*` o
`backdrop-blur-*` en cualquier componente (incluyendo Modales, Toasts,
Loaders y Banners). Para separar visualmente elementos superpuestos, se debe
utilizar la superposición de colores de fondo combinada con bordes sutiles:

* Elemento base: `bg-itec-box border border-itec-border`
* Elemento superpuesto (Modal/Toast): `bg-itec-card border border-white/10`
* Ningún componente de la carpeta `@components/ui/` o
  `@components/organisms/` tiene excepciones a esta regla.

### 1.3 Colores por Módulo (Feature Colors)

Cada sección principal de la plataforma tiene asignado un color sólido
representativo para mantener coherencia e identidad visual sin saturar la
interfaz general. Si el color no existe todavía en `index.css`, se define
ahí como variable de tema con el patrón `--color-itec-section-[SECCION]:
#....`. Para fondos y bordes de cosas importantes, jugar únicamente con la
opacidad de Tailwind sobre esa variable — nunca con colores nuevos sueltos.

Ejemplos de uso: `[bg/text/border/etc]-itec-section-[SECCION]/10`,
`.../60`, `.../90`.

Colores asignados actualmente:

* **TruekeTEC:** `#ff493b`
* **Admission / Ingreso:** `#C27AFF`

### 1.4 Escala de opacidad por uso

La sintaxis del punto anterior explica **cómo** se compone la clase, pero no
**cuándo** usar cada nivel. Esta tabla es la convención a seguir para que
cada feature nueva no invente su propia escala:

| Opacidad  | Uso recomendado                                                                    |
|-----------|-------------------------------------------------------------------------------------|
| `/10`     | Fondo de bloques destacados (banners, tarjetas de match, alertas informativas)      |
| `/20–/30` | Borde de esos mismos bloques (acompaña al fondo `/10`)                             |
| `/40`     | Borde de badges de estado                                                           |
| `/60`     | Borde con énfasis medio-alto (acordeones importantes, avisos que requieren atención)|
| `/80–/90` | Texto o fondo casi sólido (hover states, botones "solid" del color de sección)      |

### 1.5 Dark theme: ¿hay soporte de modo claro planeado?

`index.css` conserva valores de modo claro comentados (ej.
`--color-itec-bg: #ffffff`). Antes de tocar esas líneas, confirmar si son:

- (a) residuo de una prueba descartada → se pueden eliminar, o
- (b) un modo claro planeado a futuro → no borrar, y documentar acá el
  criterio para cuándo se retomaría.

*(Estado actual: sin decisión tomada. No borrar esas líneas hasta que se
defina explícitamente acá.)*

---

## 2. Arquitectura y Convenciones de Código

### 2.1 Alias de imports (paths)

Definidos en `tsconfig.app.json` y espejados en `vite.config.ts` (sección
`resolve.alias`) — si se agrega un alias nuevo, **actualizar los dos
archivos**. Usar siempre alias, nunca rutas relativas largas (`../../../`):

```
@/*            → src/*
@components/*  → src/components/*
@features/*    → src/features/*
@pages/*       → src/pages/*
@assets/*      → src/assets/*
@hooks/*       → src/hooks/*
@services/*    → src/services/*
@context/*     → src/context/*
@lib/*         → src/lib/*
@data/*        → src/data/*
```

> `@context/*` queda como alias reservado para contextos de React que sigan
> vivos (ver 2.6 — no todo se migra a Zustand). No usarlo para nada que
> debería ser un store.

### 2.2 Componentes de UI obligatorios (no usar HTML nativo)

Para mantener consistencia visual y de comportamiento, estos componentes
son de uso obligatorio en lugar de sus equivalentes nativos:

| En vez de...             | Usar siempre...                     |
|---------------------------|---------------------------------------|
| `<button>`                | `@components/ui/Button`               |
| `<select>`                | `@components/ui/CustomSelect`         |
| `<input>`                 | `@components/ui/Input`                |
| `fixed` + overlay manual  | `@components/templates/LayoutModal`   |
| `alert(...)`              | `useToast()` (ver 2.7)                |

**Limitación conocida de `CustomSelect`:** no tiene búsqueda ni filtro por
texto, es un dropdown que lista todas las opciones al abrir. Para listas
largas (30+ ítems, ej. materias de una carrera completa) la experiencia se
degrada. En esos casos evaluar `@components/molecules/AutocompleteInput`, o
agrupar/paginar las opciones dentro del propio `CustomSelect`.

### 2.3 Estructura obligatoria de una feature (`src/features/<nombre>/`)

Toda feature nueva debe seguir esta estructura (ya usada en `trueketec` y
`notifications`):

```
src/features/<nombre>/
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── hooks/
│   └── use<Nombre>.ts        # lógica de estado + llamadas a services
├── services/
│   └── <nombre>.service.ts   # fetch a la API, nunca dentro de componentes
├── store/                    # opcional — solo si la feature necesita
│   └── use<Nombre>Store.ts   # estado de UI propio (ver sección 3)
├── types/
│   └── <nombre>.types.ts     # interfaces que reflejan el shape real de la DB
└── data.ts                   # info dura: textos largos, listas, mensajes, config
```

**Regla de `data.ts`:** ningún texto de negocio (mensajes de error, textos
largos, listas de opciones, datos de contacto) debe vivir hardcodeado dentro
de un `.tsx`. Siempre extraer a `data.ts` de la feature correspondiente. Si
una página fuera de `features/` (dentro de `src/pages/`) tiene datos
estáticos grandes (listas, tablas de datos fijos), crear igualmente un
`data.ts` junto a esa página en vez de dejarlos inline — es la misma regla,
aplicada también fuera de `features/`.

### 2.4 Capa de datos: quién llama a qué

El proyecto combina tres fuentes de datos con responsabilidades separadas:

1. **Backend propio (API REST)** — vía `fetch`, siguiendo el patrón de
   autenticación de 2.5. Es la fuente principal para todo lo que es lógica
   de negocio de iTEC BA (cursos, foro, beneficios, progreso, etc.).
2. **Firebase** — Auth (sesión institucional) y Firestore (datos que
   necesitan tiempo real, como `pageAccess` o el perfil de usuario).
3. **Supabase** (`@supabase/supabase-js`) — uso puntual, confirmar contra el
   servicio específico antes de asumir que reemplaza a Firebase o al
   backend propio en una feature nueva.

No inventar una cuarta forma de traer datos. Si una feature nueva necesita
algo que no encaja en ninguna de las tres, plantearlo antes de implementar.

### 2.5 Patrón de autenticación en `*.service.ts`

Todo servicio que llame a la API del backend debe seguir este patrón (visto
en `trueketec.service.ts`), no inventar uno nuevo:

```ts
const getHeaders = async (): Promise<HeadersInit> => {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sesión caducada o no disponible.");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};
```

`API_URL` se resuelve siempre igual en cada servicio, leyendo la env var:

```ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
```

> Si en algún momento se centraliza esto en un cliente HTTP común (ej.
> `@lib/apiClient`), este README se actualiza primero con el nuevo patrón
> antes de migrar servicios — hasta entonces, replicar el patrón de arriba
> tal cual, sin variaciones (mismo orden de headers, mismo mensaje de
> error).

### 2.6 Restricción de dominio institucional

Ciertas páginas/funcionalidades son exclusivas para cuentas
`@frba.utn.edu.ar` (ej. TruekeTEC). Es una regla de negocio transversal, no
algo específico de una sola página. Patrón estándar de verificación:

```ts
if (!user?.email?.endsWith("@frba.utn.edu.ar")) { /* bloquear acceso */ }
```

Al crear una feature nueva restringida por dominio, replicar este mismo
patrón en vez de reinventar la validación.

### 2.7 Feedback al usuario: Toasts, no `alert()`

El proyecto tiene un `ToastProvider` propio (`@features/notifications`,
montado en `App.tsx`) para mostrar errores, confirmaciones y avisos.
**No usar `alert()` ni `confirm()` nativos** en código nuevo — rompen el
diseño flat y bloquean el hilo principal.

```tsx
import { useToast } from "@features/notifications/components/atoms/Toast";

const { showToast } = useToast();
// ...
catch (err) {
  showToast(err instanceof Error ? err.message : "Error al guardar", "error");
}
```

Si encontrás un `alert(...)` en código existente al tocar ese archivo,
migrarlo a `useToast()` como parte del mismo cambio.

---

## 3. Estado: Zustand (cliente) + TanStack Query (servidor)

El proyecto separa el estado en dos capas con responsabilidades que **no se
solapan**. Esta separación ya está en uso real (ver
`features/courses/store/useCourseStore.ts`) y es la convención a seguir en
toda feature nueva:

* **TanStack Query (`@tanstack/react-query`)** → estado de servidor: todo
  dato que viene de la API o de Firestore, su caché, loading/error states y
  mutaciones. Si el dato se puede volver a pedir con un fetch, va acá — no a
  un store de Zustand.
* **Zustand** → estado de cliente: sesión de auth, UI (filtros activos,
  modal abierto/cerrado, tab seleccionado, índice de video actual), y
  cualquier dato derivado que dependa de otro estado de cliente (ej.
  `isAdmin` calculado a partir de `user.role`).

Regla simple para decidir dónde va un dato nuevo: **¿sobrevive a un
refresh de la página sin volver a pedirse al backend?** Si no, es TanStack
Query. Si es efímero y vive solo en esta sesión de UI, es Zustand.

El proyecto **ya completó la migración** de React Context a Zustand para
estado global de sesión — `AuthContext` no existe más. `@context/*` (el
alias) sigue reservado para contextos puntuales que son legítimamente
contextos de React y no estado global (ver 3.3).

### 3.1 `useAuthStore` (Autenticación y Reglas de Negocio)

Gestiona la sesión de Firebase y calcula el estado derivado global en base a
los datos del usuario, para no ensuciar los componentes visuales con esa
lógica.

```tsx
import { useAuthStore } from '@/stores/authStore';

// hasTarjetec, isAdmin y needsProfileCompletion se calculan automáticamente
// dentro del store cada vez que cambia el usuario.
const { user, isAuthenticated, hasTarjetec, isAdmin, loginWithGoogle, logout } = useAuthStore();
```

El listener de Firebase (`initAuthListener`) se inicializa una sola vez, en
`App.tsx`. No volver a llamarlo desde ningún componente.

### 3.2 `usePointsStore` (Puntos del usuario)

Store chico, de una sola responsabilidad: sumar puntos y sincronizarlos con
Firestore, reinyectando el resultado en `useAuthStore` (los puntos viven
lógicamente en el usuario, no en un store aparte).

```tsx
import { usePointsStore } from '@/stores/pointsStore';

const addPoints = usePointsStore((s) => s.addPoints);
await addPoints(10, /* updateDatabase */ true);
```

### 3.3 Stores por feature (`src/features/<nombre>/store/`)

Cuando una feature tiene estado de UI propio y no trivial (más de 2-3
`useState` relacionados, o estado que varios componentes hermanos necesitan
compartir), crear un store dedicado ahí en vez de siquiera considerar
Context o prop-drilling:

```tsx
// src/features/courses/store/useCourseStore.ts
// Este store maneja ÚNICAMENTE estado de UI de la feature courses.
// El estado del servidor (lista de cursos, caché) vive en TanStack Query
// (ver hooks/useCourses.ts).
export const useCourseStore = create<CourseUIState>((set, get) => ({
  searchQuery: "",
  selectedMateria: "",
  isAddModalOpen: false,
  // ...
}));
```

No crear un store global nuevo en `src/stores/` para esto — si el estado es
de una sola feature, el store vive dentro de esa feature.

### 3.4 `PageAccessContext`: por qué sigue siendo Context y no Zustand

`PageAccessContext` (`@features/pageAccess`) es la única excepción
deliberada: se mantiene como React Context porque expone un hook
(`usePageAccessState(path)`) pensado para que cada componente se
re-renderice **solo** cuando cambia el estado de esa página puntual, algo
que ya resuelve bien con `useMemo` + Context. No migrarlo a Zustand sin una
razón concreta — no es deuda técnica, es una decisión de diseño.

---

## 4. TanStack Query: convenciones

* `QueryClient` se crea una única vez en `main.tsx`, con `staleTime` de 5
  minutos y `retry: 1` por defecto. No crear otra instancia en ningún otro
  lado.
* `queryKey` en array, siempre empezando por un string identificador de la
  entidad: `["adminUsers"]`, `["courses", courseId]`. Si dos queries de
  features distintas piden lo mismo, usar la misma key para compartir
  caché.
* Las `queryFn` llaman siempre a una función de `services/`, nunca a
  `fetch` directo dentro del hook — la única excepción tolerada hoy es
  cuando se necesita `Promise.allSettled` sobre varios endpoints en
  paralelo (ver `useAdminData.ts`), y ahí igual cada `fetch` sigue el patrón
  de headers de 2.5.
* Mutaciones (`useMutation`) invalidan las queries relacionadas con
  `queryClient.invalidateQueries({ queryKey: [...] })` en su `onSuccess` —
  no actualizar el estado a mano combinando `useState` con la respuesta de
  la mutación.

---

## 5. PWA

Configurada con `vite-plugin-pwa` (`vite.config.ts`) en modo
`registerType: "autoUpdate"`. Puntos a tener en cuenta al tocar esta parte:

* El manifest (nombre, íconos, shortcuts, screenshots) vive todo en
  `vite.config.ts`, no se edita un `manifest.json` aparte.
* Estrategias de caché por tipo de recurso (Workbox `runtimeCaching`):
  Google Fonts → `CacheFirst`; API del backend → `NetworkFirst` (datos
  frescos primero, con timeout de 10s); Firebase/Supabase → `StaleWhileRevalidate`;
  imágenes → `CacheFirst`. Si se agrega un nuevo tipo de recurso externo,
  elegir la estrategia según si prioriza frescura (`NetworkFirst`) o
  velocidad (`CacheFirst`/`StaleWhileRevalidate`), no copiar una al azar.
* `devOptions.enabled: true` mantiene la PWA activa en desarrollo para
  poder testear el service worker sin buildear — si genera ruido en
  `dev-dist/`, es esperado, esa carpeta no se commitea.
* `UpdatePWAToast` y `BannerInstallPWA` (montados en `App.tsx`) son la
  única UI permitida para avisar actualizaciones/instalación — no agregar
  un segundo mecanismo de prompt de instalación en una feature puntual.

---

## 6. Analítica (Google Analytics vía `react-ga4`)

`ReactGA.initialize(GA_MEASUREMENT_ID)` corre una sola vez en `App.tsx`,
leyendo `VITE_GA_MEASUREMENT_ID` del entorno. El tracking de pageviews en
cada cambio de ruta lo resuelve `<AnalyticsTracker />`, montado dentro del
`<BrowserRouter>` — no llamar a `ReactGA.send(...)` manualmente por cada
página nueva, ya está cubierto automáticamente por el router.

Si una interacción puntual necesita trackearse como evento (no pageview),
usar `ReactGA.event(...)` directamente en el handler correspondiente, sin
pasar por `AnalyticsTracker`.

---

## 7. Variables de entorno

| Variable                     | Uso                                              |
|-------------------------------|---------------------------------------------------|
| `VITE_FIREBASE_API_KEY`       | Config de Firebase                                |
| `VITE_FIREBASE_AUTH_DOMAIN`   | Config de Firebase                                |
| `VITE_FIREBASE_PROJECT_ID`    | Config de Firebase                                |
| `VITE_API_URL`                | Base URL del backend propio (incluye `/api`)      |
| `VITE_GA_MEASUREMENT_ID`      | ID de Google Analytics                            |
| `VITE_SUPER_ADMIN_EMAIL`      | Email que recibe rol `admin` automáticamente al crear su usuario por primera vez |

`.env` y `.env.local` no se commitean (ver `.gitignore`). Al agregar una
variable nueva, documentarla en esta tabla en el mismo cambio.

---

## 8. Scripts

```bash
npm run dev       # servidor de desarrollo (Vite)
npm run build     # tsc -b && vite build — chequea tipos antes de buildear
npm run lint      # ESLint sobre todo el proyecto
npm run preview   # sirve el build de producción localmente
```