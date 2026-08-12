Aquí tenés un `README.md` completo, detallado y estructurado, ideal para que cualquier desarrollador que se sume al proyecto entienda exactamente cómo está armada la plataforma, qué reglas visuales y de código debe respetar, y qué herramientas se utilizan.

Podés copiar y pegar este contenido directamente en el archivo `README.md` en la raíz de tu frontend.

---

# 🎓 iTEC BA — Frontend & PWA

Bienvenido al repositorio oficial del frontend de **iTEC BA**, la plataforma colaborativa e independiente exclusiva para estudiantes de la UTN FRBA.

Este proyecto está construido como una **Single Page Application (SPA)** altamente interactiva y configurada como una **Progressive Web App (PWA)**, optimizada para ofrecer una experiencia nativa tanto en escritorio como en dispositivos móviles.

---

## 🎨 1. Sistema de Diseño (UI/UX)

La plataforma utiliza un diseño **Dark Theme por defecto**, combinando el estilo **Flat Design** con toques sutiles de **Glassmorphism**. El objetivo es transmitir seriedad, modernidad y velocidad.

### Reglas Visuales y Restricciones

* **Paleta de Colores Estricta:** No se deben usar colores arbitrarios de Tailwind. Se deben usar las variables CSS globales definidas en `index.css`:
* `bg-itec-bg` / `bg-itec-box` / `bg-itec-surface`: Jerarquía de fondos oscuros.
* `border-itec-border`: Para todos los delineados sutiles (`#171717`).
* `text-itec-text` / `text-itec-muted`: Para textos primarios y secundarios.
* *Acentos:* `itec-blue-skye` (Primario), `itec-red` (Peligro/Acción), `itec-emerald` (Éxito/Gratis), `itec-amber` / `itec-rewards` (Premium/Puntos).


* **Sin Sombras Excesivas:** Evitar el uso abusivo de `shadow-lg` o brillos intensos. Privilegiar los bordes finos (`border-white/10`) y fondos semi-transparentes (`bg-white/5`).
* **Íconos:** Toda la iconografía utiliza `lucide-react`, centralizada a través del componente `<Icons/>` (`src/components/ui/icons/Icons.tsx`). No instalar otras librerías de íconos.
* **Componentes Modales:** Todas las interacciones complejas (formularios de creación, detalles, etc.) deben renderizarse usando la plantilla global `<LayoutModal/>` para mantener la consistencia móvil/escritorio.

---

## 🏛️ 2. Estructura y Arquitectura

El proyecto emplea una arquitectura híbrida y escalable que combina el **Atomic Design** (para la UI global) con el patrón **Feature-Driven Architecture** (para la lógica de negocio).

### Árbol de Directorios Principal

```text
src/
├── assets/          # Imágenes estáticas, logos y SVGs.
├── components/      # Componentes UI globales (Agnósticos al negocio - Atomic Design)
│   ├── atoms/       # Elementos indivisibles (Botones, Badges, Inputs)
│   ├── molecules/   # Combinaciones simples (SearchBars, Tarjetas simples)
│   ├── organisms/   # Bloques complejos (Sidebars, Navbars, Widgets)
│   └── templates/   # Estructuras de página (MainLayout, LayoutModal, ProtectedRoute)
├── features/        # MÓDULOS DE NEGOCIO (¡El núcleo de la app!)
│   ├── about/       # Ej: Lógica y componentes de la página "Sobre Nosotros"
│   ├── admin/       # Ej: Panel de administración, métricas y gestión.
│   ├── trueketec/   # Ej: Intercambio de comisiones (hooks, types, services propios)
│   └── ...          
├── pages/           # Vistas enrutables. Solo ensamblan layouts y features.
├── data/            # Datos estáticos o diccionarios (ej. careers.ts, projects.data.ts).
├── context/         # Estados globales de React (AuthContext, PageAccessContext).
├── hooks/           # Custom Hooks globales (useInstallPWA, usePagination).
├── lib/             # Instancias de terceros (Firebase, Supabase, axios/fetch utils).
└── index.css        # Variables globales de CSS y directivas base de Tailwind.

```

### 🚫 Restricción de Arquitectura:

**Aislamiento de Features:** Si estás creando un componente, hook o tipo que *sólo* se usa en la sección "TruekeTEC", **debe** ir dentro de `src/features/trueketec/`. La carpeta `src/components/` está estrictamente reservada para elementos genéricos que se usan a lo largo de toda la plataforma (como `<Button/>`, `<Input/>`, `<CustomSelect/>`).

---

## 🛠️ 3. Stack Tecnológico & Librerías

El ecosistema está elegido para maximizar el rendimiento bajo capas gratuitas (Free Tiers) y mantener el bundle final ligero.

* **Core:** React 19 + TypeScript (Tipado estricto obligatorio).
* **Build Tool:** Vite 7 (Rendimiento ultra rápido).
* **Estilos:** Tailwind CSS 4 (Configurado vía variables CSS puras).
* **Enrutamiento:** React Router DOM v7 (`BrowserRouter`).
* **Sincronización y Caché de Datos:** `@tanstack/react-query` v5 (Manejo de estado del servidor, reintentos, refetching).
* **Notificaciones In-App:** Sistema propio mediante Context API (`<ToastProvider/>`).
* **BaaS (Backend as a Service):**
* `firebase`: Autenticación, Firestore (Usuarios, Puntos, Configuración global).
* `@supabase/supabase-js`: PostgreSQL Serverless (Foro anónimo, Materias, Calendario).


* **PWA & Service Workers:** `vite-plugin-pwa` y `workbox-window`.
* **Markdown & Renderizado Matemático:** `react-markdown`, `remark-math`, `rehype-katex` y `katex` (usados en el Chatbot IA y recursos).

---

## 📱 4. PWA (Progressive Web App) y Modo Offline

La app está diseñada con un enfoque **Mobile-First**. El Service Worker (`sw.js`) gestiona el caché de la aplicación mediante políticas de Workbox:

1. **`NetworkFirst` (Prioridad Red):** Para todas las consultas a la API del backend (`*.itec.ba/api/*`). Si no hay internet, muestra los últimos datos cacheados.
2. **`StaleWhileRevalidate`:** Para consultas al BaaS (Firebase y Supabase).
3. **`CacheFirst` (Prioridad Caché):** Para imágenes locales, Google Fonts y assets estáticos.

**Safe Areas:** El CSS incluye variables (`env(safe-area-inset-bottom)`) para evitar que el contenido colisione con el "notch" o la barra inferior de los iPhones. Al desarrollar vistas móviles, utilizá la clase utilitaria `pb-safe`.

---

## 🚀 5. Flujo de Trabajo (Git Flow) y Contribuciones

Para mantener la base de código estable, seguimos un proceso estricto:

1. **Ramas Protegidas:** La rama `main` (o `master`) está bloqueada para push directos.
2. **Nomenclatura de Ramas:**
* Nuevas funcionalidades: `feature/nombre-de-la-funcionalidad`
* Solución de errores: `fix/nombre-del-error`
* Refactorizaciones: `refactor/nombre-del-refactor`


3. **Pull Requests (PRs):** Todos los cambios deben integrarse a través de un PR. Debe ser revisado y aprobado.
4. **Linting:** Antes de subir código, asegurate de no tener errores de tipado o de linter ejecutando `npm run lint` y `npm run build`.

---

## 💻 6. Entorno de Desarrollo Local

### Requisitos previos

* **Node.js**: v20.x o superior.
* Archivo `.env` proporcionado por un administrador con las credenciales de Firebase, Supabase, y la URL del Backend local.

### Instalación y ejecución

```bash
# 1. Clonar el proyecto
git clone https://github.com/iTEC-BA/itecba-frontend.git
cd itecba-frontend

# 2. Instalar dependencias
npm install

# 3. Levantar el entorno de desarrollo (con hot-reload)
npm run dev

```

El servidor arrancará (típicamente en `http://localhost:5173`). Para probar funcionalidades completas, asegúrese de tener el backend de iTEC BA ejecutándose simultáneamente en el puerto `5001`.