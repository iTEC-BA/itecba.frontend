# Documentacion del Proyecto ITEC.BA

Este repositorio contiene el codigo fuente de la plataforma ITEC.BA, dividida en dos aplicaciones principales: un frontend interactivo y un backend para la gestion de datos y logica de negocio. Este documento esta disenado para proporcionar a los desarrolladores que se integren al proyecto toda la informacion necesaria para entender la arquitectura, configurar el entorno local y comenzar a contribuir.

## Arquitectura y Estructura del Proyecto

El proyecto esta dividido en dos directorios principales: `itecba-frontend` y [`itecba-backend`](https://github.com/iTEC-BA/itecba.backend). Cada uno posee una arquitectura estructurada para favorecer la escalabilidad y el mantenimiento.

### Frontend (`itecba-frontend`)

El frontend es una Single Page Application (SPA) desarrollada con React y TypeScript, empaquetada con Vite. Utiliza una arquitectura hibrida que combina el Patron de Diseno Atomico (Atomic Design) para componentes globales, con una Arquitectura Orientada a Funcionalidades (Feature-Driven Architecture) para encapsular la logica especifica del dominio.

**Estructura de directorios:**
* `src/components/`: Contiene componentes de interfaz grafica reutilizables y agnosticos al contexto, organizados bajo la metodologia Atomic Design (`atoms`, `molecules`, `organisms`, `templates`).
* `src/features/`: El nucleo de la aplicacion. Cada funcionalidad principal (ej. `about`, `admission`, `courses`, `faqs`, `home`, `progress`) tiene su propia carpeta que encapsula sus propios componentes especificos, hooks, servicios y tipos. Esto aisla el alcance y facilita las refactorizaciones.
* `src/pages/`: Componentes de alto nivel que componen las vistas principales mediante el uso de "features" y "components". Estan directamente mapeados a las rutas de la aplicacion.
* `src/context/`: Contextos globales de React (ej. `AuthContext.tsx`).
* `src/lib/`: Instancias y configuraciones de clientes externos, como Firebase y Supabase.

**Librerias principales y su uso:**
* **React 19 & TypeScript:** Base del desarrollo web con un tipado estatico estricto para reducir errores en tiempo de ejecucion.
* **Vite:** Herramienta de compilacion que ofrece un entorno de desarrollo ultra rapido y optimizacion de assets para produccion.
* **Tailwind CSS (v4):** Framework de utilidades CSS utilizado para el diseno responsivo y la estilizacion rapida de los componentes.
* **React Router DOM (v7):** Enrutador utilizado para la navegacion y definicion de vistas dentro de la SPA.
* **@tanstack/react-query:** Herramienta fundamental para el fetching, cacheo y sincronizacion del estado del servidor. Se utiliza para consumir la API de backend de manera eficiente.
* **Firebase & Supabase:** Ambos SDKs estan presentes. Firebase suele emplearse para autenticacion rapida y base de datos en tiempo real (o almacenamiento local), mientras que Supabase ofrece funcionalidades robustas similares a una base de datos relacional de Postgres.
* **@xyflow/react:** Libreria avanzada para la construccion de interfaces basadas en nodos y grafos interactivos, utilizada comunmente para renderizar diagramas de correlatividades o flujos de progreso academico.
* **@google/generative-ai & React Markdown:** Utilizados en conjunto en el frontend para procesar consultas de inteligencia artificial y renderizar respuestas formateadas (ej. para el widget del chatbot).

## Guias de Integracion para Nuevos Desarrolladores

### Requisitos Previos

Para ejecutar este proyecto, tu entorno de desarrollo debe contar con lo siguiente:
* Node.js (version 20.x o superior recomendada).
* Gestor de paquetes NPM.
* Instancia local o remota de MongoDB.
* Credenciales y variables de entorno para Firebase, Supabase y Google Generative AI.

### Configuracion del Entorno de Desarrollo Local

1.  **Clonar el repositorio.**

2.  **Configurar el Frontend:**
    * En una nueva terminal, navegar al directorio: `cd itecba-frontend`
    * Instalar dependencias: `npm install`
    * Configurar el archivo `.env` en la raiz del frontend con las URLs base de la API, claves publicas de Firebase/Supabase, etc.
    * Iniciar el servidor de Vite: `npm run dev`

### Flujo de Trabajo en GitHub

Para mantener un codigo limpio y estable, se sugiere a todos los colaboradores seguir este flujo de trabajo tecnico:

* **Ramas (Branches):** El proyecto utiliza una rama `main` o `master` protegida. Ningun desarrollador debe hacer *push* directo a esta rama. Se debe utilizar un modelo tipo Feature Branch:
    * Nuevas funcionalidades: `feature/nombre-de-la-funcionalidad`
    * Correccion de errores: `fix/descripcion-del-bug`
    * Refactorizaciones: `refactor/descripcion-de-mejora`
* **Pull Requests (PRs):** Todo codigo nuevo debe integrarse mediante un PR. Los PRs deben tener un titulo descriptivo y explicar que problema resuelve o que nueva caracteristica anade. Es necesario que el codigo este alineado con las reglas de linting del proyecto (`npm run lint` en el frontend).
* **Dependencias de Modulos:** Al desarrollar una nueva vista en el frontend, priorice la arquitectura "Feature-Driven". Si un componente solo pertenece a "Cursos", creelo dentro de `src/features/courses/components/` en lugar de abarrotar la carpeta global `src/components/`. Reserve los atomos y moleculas globales unicamente para elementos visuales genericos (botones, inputs reutilizables, etc.).


Ahora tengo todo lo que necesito. Procedo a redactar el análisis técnico completo y el README.Ahora tengo todo el contexto. Procedo directamente a escribir el análisis y el README.

---

## Análisis Técnico: `instalador-PWA.sh`

---

### Tecnologías instaladas (vía `npm`)

El script instala exactamente dos dependencias de desarrollo:

- **`vite-plugin-pwa`** — Plugin de Vite que integra el manifiesto web, el registro automático del Service Worker y las estrategias de caché Workbox. El script lo configura con `registerType: 'autoUpdate'`.
- **`workbox-window`** — Librería de Google que permite comunicarse desde el código de la app con el Service Worker (usado internamente por `vite-plugin-pwa` para detectar actualizaciones disponibles).

Adicionalmente menciona (pero **no instala automáticamente**) `tailwindcss-safe-area` y `pwa-asset-generator`, que quedan como pasos manuales opcionales.

---

### Archivos creados y modificados

#### Archivos modificados (con backup automático)

| Archivo | Backup generado | Cambios realizados |
|---|---|---|
| `vite.config.ts` | `vite.config.ts.bak` | Reescritura completa: agrega `VitePWA()` con manifiesto, íconos, shortcuts, screenshot, y estrategias Workbox |
| `index.html` | `index.html.bak` | Reescritura completa: agrega todas las meta tags PWA, Open Graph, Apple touch, safe-area CSS |

#### Archivos nuevos creados

| Archivo | Propósito |
|---|---|
| `src/hooks/useInstallPWA.ts` | Hook React que gestiona el ciclo de vida del prompt de instalación nativo del navegador (`beforeinstallprompt`), detecta si la app ya está instalada via `display-mode: standalone`, y expone `{ canInstall, isInstalled, isInstalling, install }` |
| `src/components/molecules/InstallPWABanner.tsx` | Componente React (banner fijo en bottom) que muestra el botón "Instalar" solo cuando la app no está instalada. Usa el hook anterior. Diseño fijo: fondo `#1A1A1A`, acento rojo `#D41313`, soporte para safe-area de iPhone |
| `src/components/molecules/UpdatePWAToast.tsx` | Componente React (toast fijo en top-center) que detecta cuando hay una nueva versión del Service Worker disponible, usando `useRegisterSW` de `virtual:pwa-register/react`. Muestra botones "Más tarde" / "Actualizar" |
| `src/vite-pwa.d.ts` | Archivo de declaración TypeScript con dos referencias: `vite-plugin-pwa/react` y `vite-plugin-pwa/info`, necesarias para que TS reconozca el módulo virtual `virtual:pwa-register/react` |
| `public/icons/README.md` | Instrucciones para el desarrollador sobre qué íconos PNG generar y con qué comando (`pwa-asset-generator`) |
| `public/_redirects` | Regla `/* /index.html 200` para **Netlify**: redirige todas las rutas al `index.html` para que funcione el historyAPI en producción |
| `public/vercel.json` | Regla de rewrites `"/(.*)" → "/index.html"` para **Vercel**: mismo propósito |

#### Archivos/directorios creados condicionalmente

| Condición | Resultado |
|---|---|
| Si `public/logo.png` existe | Ejecuta `npx pwa-asset-generator` para generar los 8 íconos PNG automáticamente en `public/icons/` |
| Si no existe `public/logo.png` | Crea los directorios `public/icons/` y `public/screenshots/` vacíos con el README de instrucciones |
| Si hay un CSS global (`src/index.css`, `src/App.css`, o `src/styles/global.css`) | Agrega al final un bloque de estilos móviles (safe-area, tap highlight, zoom en inputs, scroll iOS, scrollbar hidden) |
| Si no hay CSS global | Crea `src/styles/mobile-pwa.css` con esos estilos y avisa que hay que importarlo manualmente |

---

### Configuración Workbox (estrategias de caché)

El `vite.config.ts` generado configura cuatro reglas de caché en tiempo de ejecución:

| Patrón de URL | Estrategia | Cache name | Detalle |
|---|---|---|---|
| `fonts.googleapis.com` / `fonts.gstatic.com` | `CacheFirst` | `google-fonts` | 365 días, 20 entradas |
| `*.itec.ba/api/*` | `NetworkFirst` | `api-cache` | 5 min, 100 entradas, timeout 10s |
| `*.supabase.co` / `*.firebaseio.com` | `StaleWhileRevalidate` | `backend-cache` | 1h, 50 entradas |
| `*.png|jpg|jpeg|svg|gif|webp` | `CacheFirst` | `images-cache` | 30 días, 60 entradas |

---

### Lo que el script **NO** hace (pasos manuales requeridos)

El script detecta si `src/App.tsx` ya tiene los componentes PWA importados y, si no, **imprime instrucciones** pero no modifica el archivo. El desarrollador debe agregar manualmente:

```tsx
import { InstallPWABanner } from '@components/molecules/InstallPWABanner';
import { UpdatePWAToast }  from '@components/molecules/UpdatePWAToast';
// ...dentro del JSX retornado:
<InstallPWABanner />
<UpdatePWAToast />
```

---

## README.md

```markdown
# iTEC BA — PWA Setup

Manual técnico para desarrolladores del proyecto iTEC BA (UTN FRBA).

---

## Descripción

`instalador-PWA.sh` convierte el proyecto React + Vite + TypeScript en una Progressive Web App instalable. Se ejecuta una sola vez desde la raíz del repositorio y configura automáticamente el manifiesto, el Service Worker, las estrategias de caché y los componentes de instalación/actualización.

---

## Requisitos previos

- Node.js instalado y accesible en el PATH
- npm instalado
- El script debe ejecutarse desde la **raíz del proyecto** (donde vive `package.json`)
- El proyecto debe ser una app Vite + React + TypeScript con Tailwind (la configuración asume `@vitejs/plugin-react-swc` y `@tailwindcss/vite`)

---

## Uso

```bash
bash instalador-PWA.sh
```

El script imprimirá en consola el estado de cada paso con colores. Al finalizar muestra un resumen de archivos modificados y los próximos pasos manuales.

---

## Dependencias instaladas

El script instala automáticamente:

- `vite-plugin-pwa` (devDependency) — integración PWA para Vite
- `workbox-window` (devDependency) — comunicación con el Service Worker

---

## Archivos generados y modificados

### Modificados (se generan backups automáticos)

| Archivo | Backup | Descripción |
|---|---|---|
| `vite.config.ts` | `vite.config.ts.bak` | Agrega el plugin `VitePWA` con manifiesto completo y estrategias Workbox |
| `index.html` | `index.html.bak` | Agrega meta tags PWA, Open Graph, Apple touch y safe-area CSS |

### Nuevos archivos

| Archivo | Descripción |
|---|---|
| `src/hooks/useInstallPWA.ts` | Hook que gestiona el prompt de instalación nativo y el estado `isInstalled` |
| `src/components/molecules/InstallPWABanner.tsx` | Banner de instalación (bottom-fixed), visible solo si la app no está instalada |
| `src/components/molecules/UpdatePWAToast.tsx` | Toast de actualización (top-fixed), visible cuando hay un nuevo Service Worker esperando |
| `src/vite-pwa.d.ts` | Declaraciones TypeScript para el módulo virtual `virtual:pwa-register/react` |
| `public/icons/README.md` | Instrucciones para generar los íconos PNG requeridos |
| `public/_redirects` | Regla de fallback para Netlify (`/* /index.html 200`) |
| `public/vercel.json` | Regla de rewrite para Vercel |

---

## Pasos manuales post-instalación

### 1. Generar los íconos PWA

Si no existe `public/logo.png`, el script no puede generarlos automáticamente. Creá los siguientes archivos en `public/icons/`:

| Archivo | Tamaño | Uso |
|---|---|---|
| `pwa-64.png` | 64×64 | Favicon |
| `pwa-192.png` | 192×192 | Android home screen |
| `pwa-512.png` | 512×512 | Splash screen / tiendas |
| `pwa-512-maskable.png` | 512×512 | Ícono adaptativo Android |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `shortcut-tarjetec.png` | 96×96 | Shortcut TarjeTEC |
| `shortcut-buscatec.png` | 96×96 | Shortcut BuscaTEC |
| `shortcut-cursos.png` | 96×96 | Shortcut Cursos |

Comando recomendado (requiere `public/logo.png`):

```bash
npx pwa-asset-generator public/logo.png public/icons --background "#1A1A1A" --padding "15%"
```

También se requiere `public/screenshots/mobile.png` (390×844 px) para el prompt de instalación enriquecido en Android/iOS.

### 2. Agregar los componentes PWA a `src/App.tsx`

El script detecta si los componentes ya están importados. Si no lo están, editá `src/App.tsx` manualmente:

```tsx
// Imports a agregar al inicio del archivo
import { InstallPWABanner } from '@components/molecules/InstallPWABanner';
import { UpdatePWAToast }  from '@components/molecules/UpdatePWAToast';
```

Luego, dentro del JSX retornado (idealmente justo antes del cierre del provider raíz):

```tsx
return (
  <AuthProvider>
    <BrowserRouter>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          {/* ...tus rutas... */}
        </Routes>
      </Suspense>
    </BrowserRouter>
    <InstallPWABanner />
    <UpdatePWAToast />
  </AuthProvider>
);
```

### 3. (Opcional) Safe area con clases Tailwind

Para usar clases como `pb-safe` o `pt-safe` directamente en JSX:

```bash
npm install --save-dev tailwindcss-safe-area
```

En `tailwind.config.js`, agregar en el array `plugins`:

```js
require('tailwindcss-safe-area')
```

---

## Estrategias de caché Workbox

| URL | Estrategia | TTL | Entradas máx. |
|---|---|---|---|
| Google Fonts | CacheFirst | 365 días | 20 |
| `*.itec.ba/api/*` | NetworkFirst | 5 min | 100 |
| Supabase / Firebase | StaleWhileRevalidate | 1 hora | 50 |
| Imágenes (png, jpg, svg…) | CacheFirst | 30 días | 60 |
| Assets estáticos (js, css, html) | Precache Workbox | — | Todos |

---

## Cómo testear la PWA

### En desarrollo

```bash
npm run dev
```

Abrir Chrome → DevTools (`F12`) → pestaña **Application** → **Service Workers**.

> El plugin tiene `devOptions.enabled: true`, por lo que el Service Worker también se activa en modo dev.

### En producción (test completo de instalación)

```bash
npm run build && npm run preview
```

Abrir en Chrome → DevTools → **Lighthouse** → categoría **PWA** para validar el manifiesto, íconos y Service Worker.

### En móvil

- **Android (Chrome):** menú ⋮ → "Agregar a pantalla de inicio"
- **iOS (Safari):** botón Compartir □↑ → "Agregar a pantalla de inicio"

---

## Aliases de path configurados

El `vite.config.ts` generado incluye los siguientes aliases (requeridos por los componentes PWA):

| Alias | Ruta |
|---|---|
| `@` | `src/` |
| `@components` | `src/components/` |
| `@hooks` | `src/hooks/` |
| `@features` | `src/features/` |
| `@pages` | `src/pages/` |
| `@assets` | `src/assets/` |
| `@services` | `src/services/` |
| `@context` | `src/context/` |
| `@lib` | `src/lib/` |
| `@data` | `src/data/` |

---

## Rollback

Si algo sale mal, los backups se restauran con:

```bash
cp vite.config.ts.bak vite.config.ts
cp index.html.bak index.html
```

Los archivos nuevos creados por el script pueden eliminarse manualmente.

---

## Despliegue

Los archivos de redirección ya están generados para los dos hosts más comunes:

- **Netlify:** `public/_redirects` — regla `/* /index.html 200`
- **Vercel:** `public/vercel.json` — rewrite de todas las rutas a `/index.html`

Estos archivos aseguran que el historyAPI de React Router funcione correctamente al navegar directamente a una URL profunda.
```


