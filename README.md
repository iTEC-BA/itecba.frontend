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

* Elemento base: `bg-itec-box border border-itec-border/50`
* Elemento superpuesto (Modal/Toast): `bg-itec-card border border-itec-border/50`
* Ningún componente de la carpeta `@components/ui/` o
  `@components/organisms/` tiene excepciones a esta regla.

> **Nota — deuda de diseño detectada:** hoy hay usos reales de `shadow-*`
> incumpliendo esta regla (ej. `TutoriasSection.tsx` usa `shadow-lg` en su
> `<Card>`, `HamburgerButton.tsx` usa `shadow-[0_12px_30px_rgba(...)]`,
> `PointsActivityManager` referencia `shadow-inner`). Si tocás alguno de
> esos archivos, corregilo como parte del mismo cambio.

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
| `alert(...)` / `confirm(...)` | `useToast()` (ver 2.7)            |

**Limitación conocida de `CustomSelect`:** no tiene búsqueda ni filtro por
texto, es un dropdown que lista todas las opciones al abrir. Para listas
largas (30+ ítems, ej. materias de una carrera completa) la experiencia se
degrada. En esos casos evaluar `@components/molecules/AutocompleteInput`, o
agrupar/paginar las opciones dentro del propio `CustomSelect`.

> **Nota — deuda detectada en `admin/`:** varias páginas del panel de admin
> (`NewsFeed`, `UserSearchBox`, `BenefitManagement`, `PageAccessManagement`,
> `ContentModeration`) todavía usan `window.confirm(...)` nativo para
> confirmaciones destructivas. Si
> tocás alguno de esos archivos, migrarlo al mismo tiempo.

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

> **Nota:** `admin/pages/PageAccessManagement.tsx` tiene `KNOWN_PAGES`
> (array de rutas conocidas de la plataforma) hardcodeado inline — es un
> caso claro de la regla anterior, mover a `admin/data.ts` cuando se toque
> ese archivo.

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

> **Nota — deuda detectada:** `admin.service.ts` y `useAdminData.ts` no
> siguen este patrón al pie de la letra: llaman a `auth.currentUser?.getIdToken()`
> directo (sin `authStateReady()` primero) y no siempre validan `if (!token)`
> antes de usarlo. Alinear cuando se toquen.

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

`useToast()` devuelve un objeto `toast` con un método por variante
(`success`, `error`, `warning`, `info`) — no un único `showToast(msg, tipo)`:

```tsx
import { useToast } from "@features/notifications/components/atoms/Toast";

const { toast } = useToast();
// ...
catch (err) {
  toast.error(err instanceof Error ? err.message : "Error al guardar");
}
```

Si encontrás un `alert(...)` o `confirm(...)` en código existente al tocar
ese archivo, migrarlo a `useToast()` como parte del mismo cambio (para
confirmaciones destructivas, mientras no exista un modal de confirmación
propio, `window.confirm(...)` sigue siendo tolerado — pero el feedback de
resultado siempre va por `toast`, nunca por `alert`).

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
contextos de React y no estado global (ver 3.4).

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

El modelo de roles es explícito y no debe derivarse en los componentes:

* `admin`: administrador pleno (`isAdmin === true`).
* `moderator`: puede acceder al panel administrativo, pero no se considera
  administrador pleno (`canAccessAdminPanel === true`, `isAdmin === false`).
* `student`, `ingresante`, `afiliado` y `profesor`: usuarios sin acceso al
  panel administrativo.

Las rutas privadas se protegen con `ProtectedRoute` y `/admin/*` agrega un
guard de roles (`AdminRoute`). Ocultar el enlace del panel en el sidebar es
solo una mejora de UX; la autorización real debe permanecer en el guard y en
el backend.

El campo canónico de autorización es `authorized`. El store lee también el
campo legado mal escrito `authtorized` para mantener compatibilidad con
documentos existentes, pero todo dato nuevo debe persistirse como
`authorized`. Para cuentas externas, la existencia del documento no alcanza:
el listener de Firebase exige que uno de esos campos sea `true`, por lo que
revocar la autorización impide iniciar sesión.

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

> La migración a TanStack Query en `admin` está completa:
> `useAdminData.ts` es el hook único de datos administrativos para
> `AdminDashboard`, `UserManagement` y `NewsManagement`. No agregar hooks
> paralelos con `useState` + `useEffect` para esas entidades: duplican caché,
> estados de carga y mutaciones. Los hooks legacy `useAdminUsers.ts` y
> `useAnnouncements.ts` fueron eliminados porque no tenían consumidores.

### 3.4 `PageAccessContext`: por qué sigue siendo Context y no Zustand

`PageAccessContext` (`@features/pageAccess`) es la única excepción
deliberada: se mantiene como React Context porque expone un hook
(`usePageAccessState(path)`) pensado para que cada componente se
re-renderice **solo** cuando cambia el estado de esa página puntual, algo
que ya resuelve bien con `useMemo` + Context. No migrarlo a Zustand sin una
razón concreta — no es deuda técnica, es una decisión de diseño.

### 3.5 Autorización por capacidades de negocio

Los componentes no deben decidir permisos con combinaciones de estado como
`isAdmin && !noEditar`. Esa forma mezcla el rol global con reglas propias de
la feature y hace que la lógica se copie en varias pantallas.

La capa común es [`useAuthorization`](./src/hooks/useAuthorization.ts), que
expone capacidades de negocio mediante `can(permission)`. Las capacidades
actuales son:

| Capacidad | Roles |
|-----------|-------|
| `admin.panel` | `admin`, `moderator` |
| `courses.edit` | `admin`, `moderator` |
| `courses.manage` | `admin` |
| `resources.manage` | `admin` |
| `users.manage` | `admin`, `moderator` |

Las reglas que dependen del recurso viven junto a la feature. Por ejemplo,
Cursos agrega [`useCoursePermissions`](./src/features/courses/hooks/useCoursePermissions.ts)
y [`coursePermissions.ts`](./src/features/courses/utils/coursePermissions.ts):

```tsx
const { canManageCourses, canEditCourse } = useCoursePermissions();

{canManageCourses && <CourseAdminBar ... />}

{canEditCourse(course) && (
  <Button onClick={() => setEditOpen(true)}>Editar</Button>
)}
```

`canEditCourses` permite a `admin` y `moderator` editar cursos que no estén
protegidos. `canManageCourses` expresa la capacidad exclusiva de `admin`
para crear cursos, revisar videos reportados y administrar recursos.
`canDeleteCourse(course)` usa esa capacidad y aplica la misma protección para
la eliminación. `canEditCourse(course)` además aplica la regla del dominio:
los cursos oficiales y los IDs protegidos
(`arquitectura`, `podcast`, `seminario` y `analisis`) no se pueden editar ni
eliminar desde la grilla o el detalle.

Al agregar una acción nueva:

1. Definir una capacidad con nombre de negocio en `useAuthorization` solo si
   aplica a más de una feature.
2. Crear un hook/policy dentro de la feature si necesita inspeccionar el
   recurso o sus datos.
3. Consumir el resultado en el componente: `canEditCourse(course)`,
   `canManageCourses`, etc.
4. Mantener la validación equivalente en el backend o en las reglas de
   Firebase; ocultar un botón nunca constituye autorización de seguridad.

`isAdmin` y `canAccessAdminPanel` siguen disponibles en `useAuthStore` para
compatibilidad y guards globales. En componentes nuevos se debe preferir la
API de capacidades. No crear condiciones alternativas basadas en emails,
nombres de rol o flags locales.

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
  cuando se necesita `Promise.allSettled`/`Promise.all` sobre varios
  endpoints en paralelo (ver `useAdminData.ts` y `ContentModeration.tsx`), y
  ahí igual cada `fetch` sigue el patrón de headers de 2.5.
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

### 7.1 Reglas de Firestore

Las reglas desplegadas deben incluir el archivo [`firestore.rules`](./firestore.rules).
La colección `users_autorized` no puede quedar sin un bloque `match`: por
defecto Firestore deniega toda lectura y escritura. Las reglas incluidas
permiten que `admin` y `moderator` gestionen autorizaciones y que una cuenta
externa lea únicamente su propio registro autorizado durante el login.
Las consultas de autenticación deben filtrar por `email` y
`authorized == true`; esto permite que Firestore demuestre que la consulta es
compatible con sus reglas de seguridad.

Después de publicar cambios en las reglas, verificar en Firebase Console que
el proyecto seleccionado coincida con `VITE_FIREBASE_PROJECT_ID`. Las reglas
del repositorio no se aplican automáticamente hasta desplegarlas con Firebase
CLI o copiarlas en la sección Firestore Database > Rules.

El primer usuario configurado en `VITE_SUPER_ADMIN_EMAIL` debe tener creado
manualmente su documento en `users/{uid}` con `role: "admin"` (el UID se
obtiene desde Firebase Authentication). Esto es un bootstrap intencional:
las reglas no deben permitir que el cliente cree arbitrariamente usuarios
administradores.

---

## 8. Scripts

```bash
npm run dev       # servidor de desarrollo (Vite)
npm run build     # tsc -b && vite build — chequea tipos antes de buildear
npm run lint      # ESLint sobre todo el proyecto
npm run preview   # sirve el build de producción localmente
```

## 9. Puesta en marcha local

### 9.1 Requisitos

- Node.js compatible con Vite 7 y npm.
- Un proyecto Firebase con Authentication (Google) y Firestore habilitados.
- Acceso a la API REST de iTEC BA, o una instancia local equivalente.

### 9.2 Instalación

```bash
npm install
copy .env.example .env.local
npm run dev
```

El repositorio no incluye un `.env.example` actualmente. Si no existe en tu
copia, crea `.env.local` manualmente usando la tabla de variables de la
sección 7. Nunca subas `.env` ni `.env.local` al repositorio.

Vite expone al navegador únicamente variables que comienzan con `VITE_`.
Las claves de Firebase no deben considerarse secretos: la protección real
depende de Firebase Authentication, las reglas de Firestore y las
restricciones del backend.

### 9.3 Verificación antes de abrir un PR

Ejecutar, en este orden:

```bash
npm run lint
npm run build
```

`npm run build` ejecuta primero `tsc -b`, por lo que también funciona como
verificación de tipos. Si falla por una deuda preexistente, no ocultar el
error: indicar los archivos afectados en la descripción del cambio y
confirmar que los archivos modificados no agregan errores nuevos.

## 10. Mapa del proyecto

```
src/
├── components/       # UI reutilizable y layouts globales
├── features/         # módulos de negocio, organizados por dominio
├── hooks/             # hooks compartidos entre features
├── lib/               # integraciones base, como Firebase
├── routes/            # árbol de rutas públicas, privadas y de error
├── services/          # servicios compartidos
├── stores/            # estado global de sesión y puntos
├── types/             # tipos compartidos
└── App.tsx            # providers globales e inicialización de la aplicación
```

Las features disponibles actualmente son:

`about`, `admin`, `admission`, `aulas`, `benefits`, `calendar`, `courses`,
`error`, `faqs`, `forum`, `grade`, `groups`, `home`, `login`,
`notifications`, `padron`, `pageAccess`, `plugins`, `points`, `profile`,
`progress`, `resources` y `trueketec`.

Las features que tienen `index.ts` en su raíz pueden consumirse desde el
alias `@features/<feature>` sin importar archivos internos. Los componentes
internos siguen siendo privados salvo que se exporten explícitamente desde
ese índice.

### 10.1 Rutas principales

El árbol se define en `src/routes/index.tsx` y se divide en:

- **Públicas:** `/`, `/login`, `/foro/*`, `/cursos`, `/faqs`, `/ingreso`,
  `/grado`, `/nosotros`, `/grupos`, `/aulas`, `/guiatec`, `/calendario`,
  `/plugins`, `/terminos` y sus rutas paramétricas.
- **Privadas:** se montan dentro de `ProtectedRoute` y requieren una sesión
  de Firebase.
- **Administración:** `/admin/*` requiere `AdminRoute`; pueden entrar
  `admin` y `moderator`, aunque solo `admin` tiene `isAdmin === true`.

`PageGate` controla si una sección está habilitada desde la configuración de
acceso a páginas. No reemplaza a `ProtectedRoute`, `AdminRoute` ni a las
reglas de seguridad del backend.

## 11. Foro

El foro usa la API REST propia para publicaciones, respuestas, votos,
reposts, borrado y banners. La UI mantiene el estilo visual de iTEC y usa
una línea temporal para relacionar publicaciones y respuestas.

Las rutas de hilo son anidadas:

```text
/foro                  # feed
/foro/10               # publicación 10
/foro/10/22            # respuesta 22 dentro de la publicación 10
/foro/10/22/35         # siguiente nivel de respuesta
```

Al abrir una respuesta se agrega su ID a la URL. Al publicar una respuesta,
la aplicación navega al nuevo nivel del hilo. `ForumThreadPage` carga cada
ancestro para mostrar breadcrumbs y usa el último ID como publicación activa.

Responsabilidades principales:

- `ForumFeed`: tabs, carga incremental, creación de publicaciones y feed.
- `PostCard`: representación de una publicación, acciones y reposts.
- `ThreadView`: publicación activa, respuestas y composición de respuestas.
- `ReplyCard`: respuesta navegable hacia el siguiente nivel.
- `forumService.ts`: contrato con la API; no mover llamadas `fetch` a los
  componentes.

El backend debe aceptar IDs de respuestas en `getThread` y `createReply`.
Si la API devuelve solo publicaciones raíz, la navegación visual puede abrir
la URL pero no podrá reconstruir correctamente el hilo.

## 12. Autenticación y usuarios externos

El acceso comienza con Google Authentication. Después, `authStore` resuelve
el perfil en `users/{uid}`. Las cuentas que no terminan en
`@frba.utn.edu.ar` solo pueden ingresar si tienen una autorización activa en
`users_autorized`.

Flujo de una cuenta externa:

1. Un `admin` o `moderator` crea una autorización con el email normalizado.
2. El documento conserva `authorized: true` como campo canónico.
3. El usuario inicia sesión con Google.
4. El listener consulta la autorización por `email` y `authorized == true`.
5. Se crea o completa `users/{uid}` con rol `student` si todavía no existe.
6. Revocar `authorized` impide futuros accesos.

`authtorized` es un nombre legado que se lee únicamente por compatibilidad.
No debe utilizarse al crear o actualizar documentos nuevos. El cliente no
puede autoasignarse los roles `admin` o `moderator`; el primer administrador
debe configurarse manualmente en Firestore y las reglas deben estar
publicadas antes de probar el panel.

## 13. Despliegue y caché

La configuración de Vercel está en `vercel.json`. El build de producción
genera los assets de Vite y el service worker mediante
`vite-plugin-pwa`. `dev-dist/` y `dist/` son artefactos generados: no deben
editarse manualmente ni utilizarse como fuente de código.

Después de publicar una nueva versión:

1. Verificar que el build terminó correctamente.
2. Confirmar que el service worker recibió la actualización.
3. Probar una navegación directa a rutas profundas, especialmente
   `/foro/10/22`, para confirmar el fallback SPA del hosting.
4. Verificar en Firebase Console que las reglas publicadas coincidan con
   [`firestore.rules`](./firestore.rules).

## 14. Estado técnico conocido

El repositorio contiene deuda técnica que no debe confundirse con fallos
introducidos por cada cambio:

- `points`: hay firmas desalineadas entre hooks y servicios, incluyendo una
  referencia a `getActivityFromCache` que no está exportada.
- `profile`: `useEditProfile.ts` referencia un `useAuth` que no existe en el
  estado actual basado en Zustand.
- `resources`: `useResourceMaterias.ts` importa un servicio inexistente y
  tiene parámetros sin tipar.
- Algunas superficies antiguas del panel admin todavía usan
  `window.confirm`; migrarlas a `LayoutModal`/`useToast` cuando se modifiquen.
- Persisten usos de `shadow-*` y `backdrop-blur-*` en componentes existentes,
  aunque el diseño institucional nuevo los prohíbe.

Estas incidencias deben resolverse en cambios separados o junto con el
archivo directamente afectado. No silenciar errores con casts amplios,
`catch` vacíos ni desactivar reglas de TypeScript o ESLint.