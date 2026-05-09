Aquí tenés la documentación unificada, estructurada y mejorada. Combiné tu README original con el nuevo análisis técnico de la PWA para crear un documento maestro, ideal para cualquier desarrollador que se sume a tu equipo.

Podés copiar este bloque y guardarlo directamente como tu nuevo `README.md` en la raíz de `itecba-frontend`.

---

# Documentación del Proyecto iTEC.BA (Frontend & PWA)

Este repositorio contiene el código fuente del frontend de la plataforma **iTEC.BA**. Desarrollado como una Single Page Application (SPA) y configurado como una Progressive Web App (PWA), interactúa con nuestro [backend de gestión](https://github.com/iTEC-BA/itecba.backend). Este documento detalla la arquitectura, el entorno local, la configuración de la PWA y las guías de contribución.

---

## 🏛️ Arquitectura y Estructura del Proyecto

El frontend utiliza una arquitectura híbrida altamente escalable que combina el **Patrón de Diseño Atómico (Atomic Design)** para componentes globales, con una **Arquitectura Orientada a Funcionalidades (Feature-Driven Architecture)** para encapsular la lógica de negocio.

### Estructura de Directorios

* **`src/components/`**: Contiene componentes de interfaz gráfica reutilizables y agnósticos, organizados bajo Atomic Design (`atoms`, `molecules`, `organisms`, `templates`).
* **`src/features/`**: El núcleo de la aplicación. Cada funcionalidad (ej. `about`, `courses`, `forum`, `rewards`) encapsula sus propios componentes, hooks, servicios y tipos. Esto aísla el alcance y facilita las refactorizaciones.
* **`src/pages/`**: Componentes de alto nivel que componen las vistas principales mapeadas a las rutas de la aplicación.
* **`src/context/`**: Contextos globales de React (ej. `AuthContext.tsx`).
* **`src/lib/`**: Instancias y configuraciones de clientes externos (Firebase, Supabase).

---

## 🛠️ Stack Tecnológico

* **Core:** React 19 & TypeScript. Tipado estático estricto para reducir errores en tiempo de ejecución.
* **Build Tool:** Vite. Entorno de desarrollo ultra rápido y optimización para producción.
* **Estilos:** Tailwind CSS (v4).
* **Enrutamiento:** React Router DOM (v7).
* **Fetching & Estado:** `@tanstack/react-query`. Herramienta fundamental para el caché y sincronización del estado del servidor.
* **BaaS:** Firebase (Autenticación y DB en tiempo real) y Supabase (Base de datos relacional Postgres).
* **Librerías Especializadas:** `@xyflow/react` (diagramas de correlatividades) y `@google/generative-ai` junto a `React Markdown` (para el chatbot de IA).

---

## 📱 Progressive Web App (PWA) y Caché

El proyecto está configurado como una PWA instalable gracias al script `instalador-PWA.sh`. Este módulo depende de `vite-plugin-pwa` (con actualización automática) y `workbox-window`.

### Archivos Generados por el Instalador

| Archivo | Propósito |
| --- | --- |
| `src/hooks/useInstallPWA.ts` | Gestiona el ciclo de vida del prompt nativo (`beforeinstallprompt`) y detecta el estado de instalación. |
| `src/components/molecules/InstallPWABanner.tsx` | Banner fijo en la parte inferior para incitar a la instalación cuando la app corre en navegador. |
| `src/components/molecules/UpdatePWAToast.tsx` | Toast superior que avisa cuando hay una nueva versión del Service Worker disponible. |
| `public/_redirects` & `vercel.json` | Reglas de redirección de rutas a `index.html` para despliegues en Netlify y Vercel. |

### Estrategias de Caché (Workbox)

La PWA utiliza las siguientes estrategias para optimizar la carga y permitir el funcionamiento offline parcial:

| Recurso / URL | Estrategia | TTL (Tiempo de vida) | Entradas Máx. |
| --- | --- | --- | --- |
| **Google Fonts** (`fonts.googleapis.com`) | `CacheFirst` | 365 días | 20 |
| **API Backend** (`*.itec.ba/api/*`) | `NetworkFirst` | 5 minutos (Timeout: 10s) | 100 |
| **BaaS** (`*.supabase.co` / `*.firebaseio.com`) | `StaleWhileRevalidate` | 1 hora | 50 |
| **Imágenes** (`png|jpg|svg|webp`) | `CacheFirst` | 30 días | 60 |
| **Assets estáticos** (`js`, `css`, `html`) | `Precache` | - | Todos |

---

## 🚀 Guías de Integración para Desarrolladores

### 1. Requisitos Previos

* Node.js (versión 20.x o superior).
* Gestor de paquetes NPM.
* Instancia local o remota de MongoDB.
* Credenciales del archivo `.env` (Firebase, Supabase, Google Generative AI).

### 2. Configuración Local

1. Clonar el repositorio.
2. Navegar al directorio: `cd itecba-frontend`.
3. Instalar dependencias: `npm install`.
4. Configurar el archivo `.env` en la raíz con las URLs y claves correspondientes.
5. Iniciar el servidor: `npm run dev`.

### 3. Pasos Manuales Post-Instalación PWA

Si ejecutas el `instalador-PWA.sh` desde cero, debes asegurar los siguientes pasos:

1. **Generar Íconos:** Asegurate de tener un `public/logo.png` y utiliza `npx pwa-asset-generator` para crear las imágenes de las tiendas y el favicon en `public/icons/`.
2. **Inyectar Componentes UI:** Importar `<InstallPWABanner />` y `<UpdatePWAToast />` dentro del retorno principal en `src/App.tsx`.

### 4. Flujo de Trabajo y Git Flow

Para mantener un código limpio y estable, todos los colaboradores deben seguir estas reglas:

* **Ramas (Branches):** La rama `main` (o `master`) está protegida. No se permiten *pushes* directos. Utiliza Feature Branches:
* `feature/nombre-de-la-funcionalidad`
* `fix/descripcion-del-bug`
* `refactor/descripcion-de-mejora`


* **Pull Requests (PRs):** Todo código nuevo ingresa mediante PR. Debe incluir un título descriptivo y superar las reglas de linting locales ejecutando `npm run lint`.
* **Arquitectura Estricta:** Prioriza la arquitectura *Feature-Driven*. Si un componente pertenece únicamente a "Cursos", créalo en `src/features/courses/components/`. Reserva las carpetas globales en `src/components/` solo para elementos genéricos y reutilizables en toda la aplicación.