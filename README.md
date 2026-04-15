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