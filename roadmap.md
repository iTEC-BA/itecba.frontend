# ROADMAP TÉCNICO Y FUNCIONAL - PLATAFORMA ITEC.BA
Este documento detalla el estado actual, los requerimientos técnicos, la arquitectura y la estrategia de notificaciones de la plataforma ITEC.BA. La infraestructura ha sido diseñada rigurosamente para operar bajo capas gratuitas (Free Tier), garantizando alta disponibilidad sin costos operativos iniciales mediante la combinación de MongoDB Atlas, Firebase, Supabase y Vercel.
## 1. INFRAESTRUCTURA Y CORE (BACKEND/FRONTEND)
[✅] [SISTEMA DE AUTENTICACIÓN]: Implementación robusta y seguridad.
 * Requerimiento Técnico: Permitir acceso prioritario con correo institucional, manejo de sesiones persistentes y protección de rutas en React (ProtectedRoutes).
 * Estado: Funcional e integrado.
 * Ubicación: src/context/AuthContext.tsx y src/modules/users/ (Backend).
 * Base de Datos: Firebase Auth maneja las credenciales y JWT; MongoDB Atlas almacena el rol del usuario (estudiante, admin) y metadatos.
 * Notificaciones:
   * Email: Alumno (Bienvenida y validación de cambio de contraseña).
   * Web: Alumno (Confirmación de inicio de sesión en dispositivo nuevo).

[✅] [ARQUITECTURA DE DISEÑO]: Estilo Bento Grid y Glassmorphism unificado.
 * Requerimiento Técnico: Proporcionar una interfaz moderna, limpia y modular optimizada para PWA, sin bibliotecas pesadas de UI, utilizando fuentes Jakarta Sans y Syne.
 * Estado: Funcional.
 * Ubicación: tailwind.config.js y componentes base en src/components/ui/.
 * Base de Datos: No aplica.
 * Notificaciones: No aplica.

[✅] [LEGAL Y TÉRMINOS DE USO]: Protección jurídica y limitación de responsabilidad.
 * Requerimiento Técnico: Documento legal extenso sin vacíos ("AS IS"), cubriendo retención de datos, exención de garantías por uso de capa gratuita, y pseudonimato condicionado.
 * Estado: Funcional.
 * Ubicación: src/pages/TyCPage.tsx.
 * Base de Datos: No aplica (Estático).
 * Notificaciones:
   * Web y Email: Todos los roles (Aviso obligatorio ante actualización de Términos y Condiciones).
## 2. MÓDULO DE PERFIL Y CREDENCIAL DIGITAL
[✅] [TARJETEC - CREDENCIAL QR]: Generación de identificación digital única.
 * Requerimiento Técnico: Reemplazar el carnet físico mediante un código QR dinámico generado en el cliente (react-qr-code), renderizado sobre una UI con efecto cristal.
 * Estado: Funcional.
 * Ubicación: features/profile/components/organisms/TarjeTec.tsx.
 * Base de Datos: No requiere almacenamiento extra; el QR se genera al vuelo con el legajo del usuario autenticado.
 * Notificaciones: No requiere.

[✅] [GESTIÓN DE DATOS ACADÉMICOS]: Soporte multi-carrera y edición de perfil.
 * Requerimiento Técnico: Capturar y actualizar nombre, legajo, DNI, carreras simultáneas y año de ingreso mediante el endpoint updateUserProfile.
 * Estado: Funcional.
 * Ubicación: features/profile/hooks/useEditProfile.ts y backend user.controller.js.
 * Base de Datos: MongoDB Atlas (Colección users). Altamente eficiente en almacenamiento al ser solo strings.
 * Notificaciones:
   * Email: Alumno (Alerta de seguridad por modificación de datos sensibles como DNI o Legajo).
## 3. BENEFICIOS Y COMERCIO
[✅] [CATÁLOGO DE BENEFICIOS]: Listado de descuentos para la comunidad.
 * Requerimiento Técnico: Visualización de tarjetas de comercios adheridos con filtrado. CRUD administrable desde el panel.
 * Estado: Funcional.
 * Ubicación: features/admin/components/organisms/BenefitsManagement.tsx y vista pública.
 * Base de Datos: MongoDB Atlas (Colección benefits). Almacena título, descripción, porcentaje de descuento y URL de imagen.
 * Notificaciones:
   * Web: Todos los roles (Notificación push de "Nuevo Beneficio" agregado a la red).
## 4. GAMIFICACIÓN Y ECONOMÍA DE PUNTOS
[✅] [SECCIÓN REWARDS / CATÁLOGO DE CANJES]: Visualización de recompensas.
 * Requerimiento Técnico: Listado de ítems canjeables. UI de confirmación que verifica el saldo actual del usuario en la base de datos.
 * Estado: Interfaz y gestión funcional.
 * Ubicación: features/admin/components/organisms/RewardsManagement.tsx.
 * Base de Datos: MongoDB Atlas (Colecciones rewards y redemptions).
 * Notificaciones:
   * Web y Email: Alumno (Confirmación de canje exitoso y pasos para retirar el premio).
  

[🟧] [LÓGICA DE ASIGNACIÓN DE PUNTOS]: Motor de gamificación automatizado.
 * Requerimiento Técnico: Endpoints que sumen puntos mediante "triggers" (ej. subir apuntes). Requiere transacciones ACID en MongoDB para evitar vulnerabilidades de duplicación.
 * Estado: Incompleto. UI de insignias creada (PointsBadgeProfile), lógica de triggers backend pendiente.
 * Ubicación: Backend (user.controller.js).
 * Base de Datos: MongoDB Atlas (Actualización del campo points).
 * Notificaciones:
   * Web: Alumno (Al recibir puntos automáticos por aportar a la comunidad).

## 5. GESTIÓN DE RECURSOS Y ÁREA ACADÉMICA
[🟧] [REPOSITORIO COLABORATIVO]: Carga y descarga de apuntes.
 * Requerimiento Técnico: Grid de materias con repositorio de PDFs subidos por alumnos, incluyendo sistema de validación (upvotes).
 * Estado: Incompleto. Esqueleto frontend listo (CourseGrid), falta integración de subida de archivos y vista pública.
 * Ubicación: features/courses/ (Frontend) y modules/courses/ (Backend).
 * Base de Datos: MongoDB Atlas (Metadatos: título, autor, validación). Firebase/Supabase Storage (Almacenamiento del archivo físico para no agotar la capa gratuita de MongoDB).
 * Notificaciones:
   * Web: Alumnos suscritos a la materia (Aviso de nuevo apunte disponible).
 
[🟧] [SISTEMA DE TUTORÍAS]: Coordinación de clases de apoyo.
 * Requerimiento Técnico: Formulario para solicitar turnos de tutoría y panel de coordinación.
 * Estado: Incompleto. Gestión administrativa creada (TutoriasSection), falta interfaz del alumno.
 * Ubicación: features/admin/components/organisms/TutoriasSection.tsx.
 * Base de Datos: MongoDB Atlas (Colección tutorships).
 * Notificaciones:
   * Web y Email: Alumno y Tutor (Confirmación de turno, cambio de estado y recordatorio 2 horas antes).
   * Web: Admin (Alerta de nueva solicitud pendiente de aprobación).

## 6. COMUNIDAD, FOROS Y COMUNICACIÓN
[✅] [CARTELERA DE AVISOS (NEWS)]: Comunicados oficiales.
 * Requerimiento Técnico: Sistema de noticias globales o segmentadas para reemplazar la dependencia de WhatsApp.
 * Estado: Funcional.
 * Ubicación: features/admin/components/organisms/NewsManagement.tsx.
 * Base de Datos: MongoDB Atlas (Colección news).
 * Notificaciones:
   * Web: Todos los roles (Push global para avisos críticos o de alta prioridad).

[✅] [CHATBOT DE CONSULTAS / IA]: Asistente virtual institucional.
 * Requerimiento Técnico: Chatbot potenciado por IA para resolver FAQs institucionales. Integración mediante el middleware verifyToken para asegurar peticiones.
 * Estado: Funcional. Rutas reparadas en ai.routes.js y controlador vinculado.
 * Ubicación: src/modules/ais/ (Backend).
 * Base de Datos: MongoDB Atlas (Contexto del usuario y logs de consulta).
 * Notificaciones: No requiere.

[🟥] [FORO ANÓNIMO (MICRO-REDDIT)]: Discusiones estudiantiles sin fricción.
 * Requerimiento Técnico: Hilos de publicación y respuestas anidadas. Generación de pseudónimos deterministas mediante hash (Email + Legajo + Salt). Filtro estricto de malas palabras en backend. Auto-eliminación a los 6 meses.
 * Estado: Pendiente.
 * Ubicación propuesta: features/forum/.
 * Base de Datos: Supabase (PostgreSQL). Se utilizará un clúster separado por su capacidad para manejar Adjacency Lists (parent_id), borrado en cascada (ON DELETE CASCADE) y tareas cron nativas (pg_cron) para la limpieza a los 6 meses.
 * Notificaciones:
   * Web: Alumno (Cuando su publicación anónima recibe una respuesta).
## 7. BACKOFFICE / PANEL DE ADMINISTRACIÓN
[✅] [LAYOUT / ADMIN DASHBOARD]: Centro de control y métricas.
 * Requerimiento Técnico: Interfaz protegida para administradores. UI estilo Bento con accesos rápidos, KPIs globales y sidebar que funciona como Drawer lateral.
 * Estado: Funcional, refactorizado y optimizado.
 * Ubicación: pages/AdminPanel.tsx y AdminDashboard.tsx.
 * Base de Datos: Consultas de agregación en MongoDB Atlas.
 * Notificaciones:
   * Email: Admin (Reporte automatizado semanal de métricas del sistema).
  
[✅] [MÓDULOS DE GESTIÓN]: CRUDs del sistema.
 * Requerimiento Técnico: Control total sobre Usuarios, Noticias, Beneficios, Recompensas, Canjes y Materias.
 * Estado: Funcional.
 * Ubicación: Diferentes organismos dentro de features/admin/components/.
 * Base de Datos: Conexión directa de lectura/escritura a MongoDB Atlas.
 * Notificaciones: No aplica (Acciones directas del usuario).
## 8. BACKLOG Y FUTURAS IMPLEMENTACIONES
[🟥] [BOLSA DE TRABAJO IT]: Tablón de anuncios laborales.
 * Requerimiento Técnico: Publicación y filtrado de pasantías o empleos IT para conectar a estudiantes con empresas.
 * Estado: Pendiente.
 * Ubicación propuesta: features/jobs/.
 * Base de Datos: MongoDB Atlas.
 * Notificaciones:
   * Web y Email: Alumno (Match de ofertas según tags/carreras configuradas en el perfil).

[🟥] [CALENDARIO ACADÉMICO]: Agenda de fechas críticas.
 * Requerimiento Técnico: Línea de tiempo con fechas de finales, feriados e inscripciones.
 * Estado: Pendiente.
 * Ubicación propuesta: features/calendar/.
 * Base de Datos: MongoDB Atlas (Colección events).
 * Notificaciones:
   * Web: Alumno (Recordatorio de inicio de apertura de inscripciones o exámenes).

## ESTRATEGIA DE BASES DE DATOS Y SERVICIOS (FREE TIER)
Para mantener la viabilidad financiera del proyecto a escala masiva sin incurrir en costos iniciales, la arquitectura fragmenta las responsabilidades:
 1. **Autenticación (Firebase Auth):** Gestión de identidad segura e ilimitada en usuarios activos mensuales básicos.
 2. **Core Relacional (MongoDB Atlas - M0):** Almacena Usuarios, News, Benefits, Rewards, Materias, Tutorships. Sus 512MB son suficientes para albergar cientos de miles de documentos JSON puros.
 3. **Archivos Pesados (Firebase Storage):** Almacenamiento exclusivo para PDFs (apuntes) e imágenes (beneficios). Evita la saturación rápida de la cuota de MongoDB.
 4. **Foro Anónimo (Supabase - PostgreSQL):** Base de datos secundaria (500MB extra). Elegida por su manejo nativo de relaciones padre-hijo (respuestas anidadas) y la extensión pg_cron para eliminar posts viejos automáticamente sin requerir procesamiento extra en Node.js.
 5. **Comunicaciones (Web Push API & Resend):** Notificaciones de navegador nativas (cero costo) y correos transaccionales mediante Resend (capa gratuita de hasta 300 correos diarios).