A partir del análisis de los chats proporcionados y del código de tu proyecto que hemos trabajado anteriormente, he estructurado todas las funcionalidades solicitadas por las distintas áreas de la agrupación. 

El proyecto actualmente cuenta con una arquitectura muy sólida (React/Vite en el frontend y Node.js/Express en el backend). Para mantener todo en la **capa gratuita (Free Tier)**, la estrategia óptima es:
* **Autenticación y Sesiones:** Firebase Authentication (Gratis e ilimitado para usuarios activos mensuales básicos).
* **Datos Relacionales y Metadatos:** MongoDB Atlas (Tier M0 gratuito ofrece 512MB, suficiente para cientos de miles de registros de texto, beneficios, usuarios y transacciones).
* **Archivos pesados (PDFs, Imágenes de apuntes):** Firebase Storage o Supabase Storage (ofrecen entre 1GB y 5GB gratuitos). En MongoDB solo se guardará la URL del archivo.

A continuación, el detalle técnico y estado de cada funcionalidad para tu `README.md`.

***

### [✅] AUTENTICACIÓN Y GESTIÓN DE PERFILES
Esta sección centraliza el acceso y la identidad de los estudiantes dentro de la plataforma, requisito fundamental mencionado por "Santiago" y "Códigotec".

- [✅] [VISTA DE LOGIN / RUTAS PROTEGIDAS]: Integración con Firebase Auth.
  * Requerimiento Técnico: Permitir acceso prioritario con correo institucional. Manejo de sesiones persistentes y protección de rutas en React (ProtectedRoutes).
  * Implementación actual: Implementado en el contexto `AuthContext` y middleware del backend.
  * Base de Datos: Firebase Auth maneja las credenciales; MongoDB Atlas almacena el rol del usuario (estudiante, admin) y sus referencias.
- [✅] [SECCIÓN PROFILE / FORMULARIO DE ALTA]: Perfil extendido del estudiante.
  * Requerimiento Técnico: Capturar y permitir edición de nombre, legajo, especialidad/carreras (soporte multi-carrera) y año de ingreso. Debe ser responsivo y usar diseño Bento.
  * Implementación actual: Implementado en `features/profile/components/organisms/ProfileHeader` y `ProfileForm`.
  * Base de Datos: MongoDB Atlas (Colección `users`). Muy económico en capa gratuita al ser solo cadenas de texto.

### [✅] CREDENCIAL VIRTUAL (TarjeTEC) Y BENEFICIOS
Núcleo del proyecto impulsado por la "Lista 10" para digitalizar los beneficios en comercios locales.

- [✅] [SECCIÓN PROFILE / TARJETEC]: Credencial digital con código QR.
  * Requerimiento Técnico: Generación en cliente de un QR escaneable (`react-qr-code`) que contenga el legajo o ID del usuario. Diseño UI con efecto cristal que simule una tarjeta física.
  * Implementación actual: Implementado en `features/profile/components/organisms/TarjeTec`.
  * Base de Datos: No requiere base de datos adicional. El QR se genera al vuelo con los datos del usuario ya traídos de MongoDB/Firebase.
- [✅] [VISTA DE BENEFICIOS / CATÁLOGO]: Listado de descuentos en comercios.
  * Requerimiento Técnico: Visualización de tarjetas de comercios adheridos con filtrado.
  * Implementación actual: Se encuentra estructurado en el frontend y gestionado desde el `AdminPanel`.
  * Base de Datos: MongoDB Atlas (Colección `benefits`). Almacena título, descripción, % de descuento y URL de imagen.

### [🟧] GAMIFICACIÓN Y RECOMPENSAS
Propuesta de "Códigotec" para incentivar la participación (subir apuntes, asistir a tutorías) mediante puntos canjeables.

- [✅] [SECCIÓN REWARDS / CATÁLOGO DE CANJES]: Visualización de recompensas disponibles.
  * Requerimiento Técnico: Listado de ítems canjeables por puntos. UI de confirmación de canje verificando saldo del usuario.
  * Implementación actual: Interfaz y gestión básica en `features/admin/components/organisms/RewardsManagement`.
  * Base de Datos: MongoDB Atlas (Colecciones `rewards` y `redemptions` para historial).
- [🟧] [LÓGICA DE ASIGNACIÓN DE PUNTOS]: Motor de gamificación.
  * Requerimiento Técnico: Endpoints en el backend que sumen puntos automáticamente cuando un usuario realiza una acción (ej. aportar un archivo).
  * Implementación actual: Existen las insignias visuales (PointsBadgeProfile), pero falta automatizar los disparadores ("triggers") en el backend cuando se sube un recurso.
  * Base de Datos: MongoDB Atlas. Se actualiza el campo `points` en el documento del usuario. Transacciones ACID requeridas para evitar inconsistencias en canjes.

### [🟧] ÁREA ACADÉMICA Y RECURSOS
Mencionado extensamente por "Asuntos académicos" y "Lista 10" para centralizar material de estudio.

- [🟧] [VISTA DE MATERIAS / APUNTES]: Repositorio colaborativo.
  * Requerimiento Técnico: Grid de materias. Dentro de cada materia, lista de recursos (PDFs, resúmenes) subidos por los alumnos, con sistema de validación o "votos".
  * Implementación actual: Existe el esqueleto de materias (`CourseGrid`), pero falta la vista pública detallada para listar y subir archivos (`EmptyResources` / `ResourceFilters`).
  * Base de Datos: MongoDB Atlas para estructurar las materias y los metadatos de los apuntes (título, autor, fecha). Los archivos físicos (PDFs) DEBEN ir obligatoriamente a Firebase Storage o Supabase Storage (capa gratuita) para no saturar la base de datos.
- [🟧] [SECCIÓN TUTORÍAS]: Gestión de clases de apoyo.
  * Requerimiento Técnico: Formulario para solicitar o postularse como tutor, y un calendario/lista de turnos disponibles.
  * Implementación actual: Existe la gestión en `AdminPanel` (`TutoriasSection`), falta la interfaz pública para el alumno (el equivalente al Google Form mencionado en el chat).
  * Base de Datos: MongoDB Atlas (Colección `tutorships` o `appointments`).

### [🟥] COMUNIDAD Y HERRAMIENTAS ADICIONALES
Funcionalidades secundarias solicitadas por las distintas áreas para mejorar la comunicación.

- [✅] [VISTA DE AVISOS / NEWS]: Cartelera digital.
  * Requerimiento Técnico: Sistema de noticias globales o por carrera para comunicados oficiales de la agrupación.
  * Implementación actual: Componentes de UI creados y administrados desde `NewsManagement`.
  * Base de Datos: MongoDB Atlas.
- [🟧] [CHATBOT DE CONSULTAS / FAQS]: Asistente virtual institucional.
  * Requerimiento Técnico: Interfaz de chat flotante o sección dedicada para responder dudas frecuentes sobre trámites, horarios, etc.
  * Implementación actual: Existen los componentes de UI (`ChatInputs`), falta integrar la lógica de respuesta (puede ser un simple motor de búsqueda de palabras clave o conexión a un LLM ligero).
  * Base de Datos: MongoDB Atlas (Colección `faqs` predefinidas).
- [🟥] [SECCIÓN BOLSA DE TRABAJO]: Ofertas laborales para estudiantes.
  * Requerimiento Técnico: Tablón de anuncios donde se puedan publicar y filtrar pasantías o empleos IT.
  * Implementación actual: Falta por completo (No existen componentes ni rutas).
  * Base de Datos: MongoDB Atlas.
- [🟥] [CALENDARIO ACADÉMICO / EVENTOS]: Fechas importantes.
  * Requerimiento Técnico: Vista tipo calendario o línea de tiempo con fechas de exámenes, feriados e inscripciones.
  * Implementación actual: Hay rastros de botones para "Guardar Fecha" en eventos, pero no una vista de calendario consolidada para el usuario final.
  * Base de Datos: MongoDB Atlas (Colección `events`).

### [✅] PANEL DE ADMINISTRACIÓN (BACKOFFICE)
El núcleo de gestión para los miembros de la agrupación I-TEC.

- [✅] [LAYOUT / ADMIN DASHBOARD]: Centro de control.
  * Requerimiento Técnico: Interfaz protegida solo para roles "admin". Diseño modular (Bento) con accesos rápidos y KPIs globales. Sidebar responsivo.
  * Implementación actual: Totalmente implementado, refactorizado y estilizado en `AdminPanel` y `AdminDashboard`.
  * Base de Datos: Consultas de agregación (Count) en MongoDB Atlas para generar las estadísticas del Dashboard.
- [✅] [MÓDULOS DE GESTIÓN]: CRUDs del sistema.
  * Requerimiento Técnico: Tablas de administración para Usuarios (cambio de roles), Noticias, Beneficios, Recompensas y Canjes.
  * Implementación actual: Secciones creadas e integradas en el Sidebar (`UserManagement`, `BenefitsManagement`, etc.).
  * Base de Datos: Conexión directa a todas las colecciones de MongoDB Atlas mediante endpoints protegidos.