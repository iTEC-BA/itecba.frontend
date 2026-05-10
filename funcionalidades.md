# iTEC BA — Propósito de cada página

> Contexto general del stack: **Frontend** React 19 + Vite 7 + TailwindCSS 4 + Firebase Auth (PWA).  
> **Backend** Express + MongoDB (cursos, grupos, recursos, recompensas, beneficios, FAQs) + Supabase (materias, calendario, perfil extendido) + Turso/SQLite (foro anónimo, push subscriptions) + Firebase Firestore (usuarios, puntos, roles).  
> Los roles válidos son `student`, `moderator` y `admin`.

---

## 1. HomePage — `/`

Página de entrada pública de la plataforma. Actúa como dashboard general: muestra anuncios activos del backend (`GET /api/announcements/active`, con soporte de `isCritical` que dispara push), acceso rápido a las secciones principales (cursos, grupos, recursos, calendario), widgets de novedades y shortcuts de navegación. Es el primer punto de contacto tanto para usuarios autenticados como anónimos.

**Mejoras sugeridas:**
- Mostrar anuncios críticos con un banner destacado diferenciado visualmente del resto.
- Lazy-load de widgets secundarios para acelerar el First Contentful Paint.
- Todo debe ser 100% responsive con skeleton loaders mientras carga los anuncios.

---

## 2. LoginPage — `/login`

Página de autenticación pública. Permite el ingreso mediante Google (Firebase Auth). No tiene formulario de registro propio; el alta de usuario ocurre automáticamente en Firestore con rol `student` al primer login. Redirige al destino previo o a `/` tras autenticarse.

**Consideraciones backend:**
- El token JWT de Firebase es verificado en cada ruta privada por `verifyToken`.
- El rol se lee desde `Firestore > users > {uid} > role`.

---

## 3. CoursesPage — `/cursos`

Catálogo público de cursos. Consume `GET /api/courses` que devuelve exclusivamente cursos con `status: "approved"`. Permite filtrar por `materia` y `categoria` via query params. Incluye búsqueda local, filtros por categoría/materia y grid de tarjetas.

**Con estudiantes:** Navegan el catálogo, ven precio, instructor, temario y pueden inscribirse. Si ya están inscriptos, se muestra el progreso.  
**Con administradores y creadores:** Acceden a todos los cursos (incluyendo `draft` y `archived`) mediante `GET /api/courses/all` desde el panel de admin.

**Mejoras sugeridas:**
- Skeleton loaders en las tarjetas mientras carga el catálogo.
- Indicador de progreso visual en la tarjeta si el usuario ya está inscripto.
- Breadcrumbs y mejor jerarquía visual en las tarjetas (precio, duración, nivel).
- Mejorar los filtros con selects accesibles y reset de filtros con un botón claro.
- Todo debe ser 100% responsive.

---

## 4. CourseDetail — `/cursos/:id`

Vista de detalle de un curso individual. Consume `GET /api/courses/:id`. Muestra descripción enriquecida (HTML renderizado de forma segura), playlist de videos con reproductor embebido (YouTube), recursos adjuntos, progreso del usuario y opción de inscripción. Los estudiantes pueden reportar videos rotos (`POST /api/courses/:id/videos/:videoId/report`).

**Mejoras sugeridas:**
- Breadcrumbs (`Cursos > [nombre del curso]`) para navegación clara.
- Skeleton loader para la cabecera y el reproductor.
- Indicador de progreso visual (barra o porcentaje) al costado de la playlist.
- El renderizado del contenido enriquecido debe ser sanitizado y responsive.
- Botón de reporte de video accesible y claro, sin bloquear la navegación.

---

## 5. CourseEditDetail — `/cursos/editar/:id` _(privada)_

Panel de edición completa de un curso. Exclusiva para `admin` y `moderator`. Permite modificar todos los campos del curso: título, descripción (editor enriquecido), imagen, materia, categoría, estado (`draft` / `approved` / `archived`), módulos, clases (video o texto) y recursos. Consume `PUT /api/courses/:id` y rutas relacionadas de videos/recursos.

**Con administradores y creadores:** Gestionan la estructura de módulos, añaden y reordenan clases, suben recursos y publican/archivan el curso. También acceden al panel de videos rotos (`GET /api/courses/:id/broken-videos`) para eliminarlos o corregirlos.

**Mejoras sugeridas:**
- Sistema de acordeones o drag-and-drop liviano para gestionar módulos sin perder el scroll.
- Creación de clases en modales independientes para limpiar la vista principal.
- Feedback visual claro (toast/banner) tras guardar o publicar, coordinado con las rutas del backend.
- Panel de videos rotos integrado con acciones de eliminar y modificar URL.
- Todo debe ser 100% responsive.

---

## 6. ResourcesPage — `/recursos` _(privada)_

Repositorio colaborativo de materiales de estudio. Los usuarios autenticados ven recursos aprobados (`GET /api/resources`) y pueden subir nuevos aportes que quedan pendientes de moderación (`POST /api/resources`, `isApproved: false`). Soporta filtros por carrera, materia, nivel, tipo y formato.

**Con estudiantes:** Buscan y descargan apuntes, resúmenes, ejercicios.  
**Con administradores:** Aprueban o rechazan recursos pendientes desde el panel admin.

**Mejoras sugeridas:**
- Skeleton loaders en la lista.
- Filtros claros con indicador de filtros activos.
- Feedback inmediato al subir un recurso ("Tu aporte está pendiente de aprobación").
- 100% responsive.

---

## 7. FaqsPage — `/faqs`

Preguntas frecuentes. Consume `GET /api/faqs` (MongoDB, con campo `popularity` que se incrementa con `PATCH /api/faqs/:id/use`). Incluye búsqueda (`GET /api/faqs/search?q=`) y muestra las más consultadas primero. Los admins pueden crear, editar y eliminar preguntas desde el admin panel.

**Mejoras sugeridas:**
- Acordeón accesible para expandir/colapsar respuestas.
- Búsqueda con debounce para no golpear el backend en cada tecla.
- 100% responsive.

---

## 8. GroupsPage — `/grupos`

Directorio de grupos de estudio (WhatsApp, Discord, Telegram, etc.). Muestra los grupos aprobados (`GET /api/groups`, `isApproved: true`) con filtros por carrera, materia y nivel. Cualquier usuario puede proponer un nuevo grupo (`POST /api/groups`) que queda pendiente. Los usuarios pueden reportar grupos (`PATCH /api/groups/:id/report`); si el `reportCount` supera el umbral, el admin lo revisa.

**Mejoras sugeridas:**
- Skeleton loaders en las tarjetas.
- Indicador claro de que el grupo enviado está "pendiente de aprobación".
- Filtros accesibles y 100% responsive.

---

## 9. AdmissionPage — `/ingreso`

Página informativa sobre el proceso de ingreso a la UTN FRBA. Contenido estático o semi-estático. No tiene rutas de backend dedicadas; posiblemente consuma datos del módulo de materias o links. Sirve de guía para ingresantes.

**Mejoras sugeridas:**
- Secciones bien diferenciadas con navegación interna (anchors).
- 100% responsive.

---

## 10. GradePage — `/grado`

Información sobre el plan de estudios y carrera de grado. Puede cruzar datos con `GET /api/materias` (Supabase) para mostrar materias por nivel y carrera. Orientada a estudiantes que ya ingresaron y quieren planificar su avance académico.

**Mejoras sugeridas:**
- Visualización del plan de estudios por año/nivel, potencialmente usando el `CareerGraph` existente.
- Filtro por carrera (`Sistemas`, `Electrónica`, etc.).
- 100% responsive.

---

## 11. AboutPage — `/nosotros`

Página institucional sobre el equipo de iTEC BA. Contenido estático que describe el proyecto, sus creadores y la misión. No consume rutas de backend.

---

## 12. ProfilePage — `/perfil` y `/perfil/:username` _(privada)_

Vista del perfil del usuario autenticado (o de un usuario específico por username). Muestra avatar, nombre, legajo, DNI, carrera, puntos acumulados, estadísticas de uso (cursos inscriptos, recursos subidos, etc.) y la TarjeTEC (tarjeta digital del estudiante con QR). Consume `GET /api/users/:uid` y `PATCH /api/users/:uid/profile`.

El perfil propio permite editar displayName, DNI, legajo, especialidad, carreras, año de ingreso y teléfono (campos allowlist en el backend). El campo `points` es solo lectura para el estudiante (el backend lo controla vía Firebase Firestore).

**Mejoras sugeridas:**
- Skeleton loader para la cabecera del perfil.
- La TarjeTEC debe tener diseño de tarjeta física (ya existe el SVG `SvgTarjeTec`) y ser descargable.
- Mostrar historial de canjes de recompensas.
- 100% responsive.

---

## 13. AdminPanel — `/admin` _(privada, solo admin)_

Panel de administración central. Agrupa la gestión de todas las entidades del sistema en un dashboard con sidebar propio (`AdminSidebar`). Secciones internas:

- **Dashboard:** métricas generales (usuarios, cursos, grupos pendientes, recursos pendientes).
- **Usuarios:** lista paginada de usuarios, búsqueda por email, cambio de rol y ajuste de puntos (`GET/PATCH /api/users`).
- **Cursos:** vista de todos los cursos con cualquier estado, acceso a edición.
- **Recursos pendientes:** aprobación/rechazo de aportes (`PUT /api/resources/:id/approve`).
- **Grupos pendientes:** aprobación/rechazo de grupos (`PUT /api/groups/:id/approve`).
- **Noticias/Anuncios:** crear y desactivar anuncios (`POST /api/announcements`, `DELETE /api/announcements/:id`). Los anuncios críticos disparan push a todos los suscriptores.
- **Beneficios:** gestión de descuentos y beneficios estudiantiles (`POST/PATCH/DELETE /api/benefits`).
- **Recompensas:** creación y gestión de recompensas canjeables con puntos (`POST/PUT/DELETE /api/rewards`), vista de canjes pendientes (`GET /api/rewards/redemptions`).
- **Materias:** ABM de materias en Supabase (`POST/PUT/DELETE /api/materias`).
- **Calendario:** creación y eliminación de eventos académicos (`POST/DELETE /api/calendar`).
- **IA (contexto):** configuración del chatbot: personalidad, reglas y costo en puntos por consulta (`PATCH /api/ai/context`).
- **FAQs:** ABM de preguntas frecuentes.

**Mejoras sugeridas:**
- Cada sección debería tener feedback claro de loading y error.
- Las acciones destructivas (eliminar, rechazar) deben tener confirmación modal.
- 100% responsive para gestión desde mobile.

---

## 14. ProgressPage — `/progreso` _(privada)_

Seguimiento del progreso académico del usuario autenticado. Muestra los cursos en los que está inscripto con su porcentaje de avance, clases completadas vs. totales, y estadísticas generales. Los datos de progreso se persisten por usuario en el backend MongoDB (`Course.inscriptions` o estructura similar en Firestore).

**Mejoras sugeridas:**
- Gráfica o barra de progreso visual por curso.
- Ordenamiento por "más reciente" o "más avanzado".
- Skeleton loaders.
- 100% responsive.

---

## 15. BuscaTECPage — `/buscatec`

Buscador de materias. Consume `GET /api/materias` (Supabase) con filtros por carrera y nivel. Permite al estudiante explorar el plan de estudios completo, buscar correlatividades y encontrar qué materia cursar a continuación. También puede consumir `GET /api/materias/carreras` para poblar el select de carreras.

**Mejoras sugeridas:**
- Búsqueda con debounce sobre el nombre de la materia.
- Agrupar resultados por nivel.
- 100% responsive.

---

## 16. AulasPage — `/aulas`

Mapa o directorio de aulas y espacios físicos del campus. Probablemente contenido estático o semi-estático. No tiene módulo de backend dedicado.

---

## 17. GuiaTECPage — `/guiatec`

Guía para estudiantes: instructivos, tutoriales internos, tips sobre el uso de la plataforma y la vida universitaria. Contenido estático o alimentado por FAQs especiales. No tiene rutas de backend exclusivas.

---

## 18. CalendarioPage — `/calendario`

Calendario de eventos académicos. Consume `GET /api/calendar` (Supabase, tabla `calendar_events`). Muestra fechas de parciales, finales, inscripciones y eventos institucionales. Los eventos de tipo recordatorio disparan notificaciones push automáticas el día anterior mediante un cron job en el backend. Los admins pueden crear y eliminar eventos desde el AdminPanel.

**Mejoras sugeridas:**
- Vista mensual/semanal con indicador del tipo de evento (color o ícono por `type`).
- Countdown al próximo evento relevante (el `CalendarCountdown` ya existe).
- Modal de detalle al hacer click en un evento (`CalendarDetailModal` ya existe).
- 100% responsive.

---

## 19. PluginsPage — `/plugins`

Colección de herramientas y extensiones útiles para el estudiante (calculadoras, converters, links a recursos externos, etc.). Contenido mayormente estático o de links curados.

---

## 20. TerminosPage — `/terminos`

Términos y condiciones de uso de la plataforma. Contenido estático legal. No consume rutas de backend.

---

## 21. RewardsPage — `/beneficios` _(privada)_

Sistema de recompensas y puntos. El usuario ve su saldo de puntos (Firebase Firestore) y el catálogo de recompensas activas (`GET /api/rewards`, `isActive: true`). Puede canjear recompensas (`POST /api/rewards/redeem`) si tiene puntos suficientes; el backend descuenta los puntos en Firestore y registra el canje en MongoDB (`Redemption`). Al canjear se dispara una push notification al usuario.

También muestra los beneficios estudiantiles (`GET /api/benefits`, descuentos en comercios) con filtro por categoría.

**Mejoras sugeridas:**
- Feedback inmediato al canjear (modal de confirmación + toast de éxito).
- Mostrar historial de canjes del usuario.
- Skeleton loaders para el catálogo.
- 100% responsive.

---

## 22. ForumPage — `/foro`

Foro anónimo de estudiantes. Almacenado en **Turso (SQLite)** — no MongoDB — para garantizar el anonimato. Cada usuario autenticado recibe un pseudónimo determinista (`AdjetivoNombre#XXXX`) generado con SHA-256 sobre su UID + salt, de modo que el mismo usuario siempre tiene el mismo pseudónimo pero no es rastreable. Los posts expiran automáticamente a los 6 meses.

Permite publicar posts, responder (replies), votar (`upvote`/`downvote`) y paginar (`GET /api/forum?page=N`). Filtra malas palabras en el backend antes de guardar. Los posts nuevos disparan notificaciones push a los suscriptores.

**Mejoras sugeridas:**
- Indicador de voto del usuario en cada post (ya viene en la respuesta del backend como `user_vote`).
- Lazy load de replies al expandir un post.
- Filtro de posts propios (identificados por el pseudónimo propio del usuario).
- 100% responsive.

---

## 23. ErrorPage — `*`

Página 404 genérica para rutas no encontradas. Incluye navegación de regreso y el personaje Raccoon (`SvgRaccoon`).

---

## Componentes globales (no son páginas pero afectan a todas)

- **ChatbotWidget:** Asistente IA flotante. Consume `POST /api/ai/chat` con historial de conversación. Cuesta puntos al usuario (`PATCH /api/ai/deduct-points`). El costo es configurable desde el panel admin. Solo disponible para usuarios autenticados.
- **NotificationPanel:** Panel de notificaciones push. Gestiona la suscripción/baja del usuario (`POST/DELETE /api/notifications/subscribe`).
- **BannerInstallPWA:** Prompt de instalación de la PWA. Se activa con el evento `beforeinstallprompt`.
- **UpdatePWAToast:** Toast que aparece cuando el Service Worker detecta una nueva versión disponible.
- **RewardsWidget:** Widget de puntos en el sidebar derecho (solo desktop). Muestra el saldo actual y acceso rápido al catálogo de recompensas.