# ROADMAP TECNICO - PLATAFORMA ITEC.BA

Este documento detalla el estado actual, requerimientos tecnicos y estrategia de notificaciones de la plataforma. La infraestructura esta diseñada para operar bajo capas gratuitas (Free Tier) utilizando MongoDB Atlas, Firebase y Vercel.

---

## 1. INFRAESTRUCTURA Y CORE (BACKEND/FRONTEND)

[✅] [SISTEMA DE AUTENTICACION]: Implementacion robusta con Firebase Auth y sincronizacion en MongoDB.
 - Estado: Funcional e integrado.
 - Ubicacion: `src/context/AuthContext.tsx` y `src/modules/users/`.
 - Justificacion: Centraliza la identidad y permite el uso de roles (admin/estudiante) para proteccion de rutas.
 - Notificaciones:
   - Email: Alumno (Bienvenida y cambio de contraseña).
   - Web: Alumno (Confirmacion de inicio de sesion en dispositivo nuevo).

[✅] [ARQUITECTURA DE DISEÑO]: Estilo Bento Grid y Glassmorphism unificado.
 - Estado: Funcional.
 - Ubicacion: `tailwind.config.js` y componentes de `ui/`.
 - Justificacion: Proporciona una experiencia de usuario moderna y limpia, optimizada para PWA con fuentes Jakarta Sans y Syne.

---

## 2. MODULO DE PERFIL Y CREDENCIAL DIGITAL

[✅] [TARJETEC - CREDENCIAL QR]: Generacion de identificacion digital unica.
 - Estado: Funcional.
 - Ubicacion: `features/profile/components/organisms/TarjeTec.tsx`.
 - Justificacion: Reemplaza la necesidad de carnets fisicos mediante un SVG dinamico basado en el legajo del usuario.
 - Notificaciones: No requiere.

[✅] [GESTION DE DATOS ACADEMICOS]: Soporte multi-carrera y edicion de perfil.
 - Estado: Funcional.
 - Ubicacion: `features/profile/hooks/useEditProfile.ts` y backend `updateUserProfile`.
 - Justificacion: Permite al backend manejar arrays de carreras y años de ingreso para segmentar informacion futura.
 - Notificaciones:
   - Email: Alumno (Aviso de modificacion de datos sensibles como DNI o Legajo).

---

## 3. GAMIFICACION Y ECONOMIA DE PUNTOS

[🟧] [SISTEMA DE PUNTOS]: Motor de asignacion por acciones.
 - Estado: Interfaz funcional, logica de triggers incompleta.
 - Ubicacion: `features/admin/components/organisms/RewardsManagement.tsx`.
 - Justificacion: Incentiva la participacion. Requiere transacciones ACID en MongoDB para evitar duplicacion de puntos durante canjes simultaneos.
 - Notificaciones:
   - Web: Alumno (Al recibir puntos por subir material o participar en tutorias).
   - Web: Alumno (Confirmacion de canje exitoso).

---

## 4. GESTION DE RECURSOS Y ACADEMICO

[🟧] [REPOSITORIO COLABORATIVO]: Sistema de carga y descarga de apuntes.
 - Estado: Estructura de materias funcional, carga de archivos incompleta.
 - Ubicacion: `features/courses/` (Frontend) y `modules/courses/` (Backend).
 - Justificacion: Debe integrarse con Firebase Storage para no saturar los 512MB de MongoDB Atlas. MongoDB solo guarda metadatos y URLs.
 - Notificaciones:
   - Web: Alumnos de la carrera (Aviso de nuevo apunte disponible en una materia seguida).

[🟧] [SISTEMA DE TUTORIAS]: Coordinacion de clases de apoyo.
 - Estado: Gestion administrativa creada, falta interfaz de solicitud para el alumno.
 - Ubicacion: `features/admin/components/organisms/TutoriasSection.tsx`.
 - Justificacion: Implementar un sistema de turnos con estados (Pendiente, Confirmada, Finalizada).
 - Notificaciones:
   - Web y Email: Alumno y Tutor (Confirmacion de turno y recordatorio 2 horas antes).
   - Web: Admin (Al recibir una nueva solicitud de tutoria).

---

## 5. BENEFICIOS Y COMERCIO

[✅] [CATALOGO DE BENEFICIOS]: Listado de descuentos para la comunidad.
 - Estado: Funcional.
 - Ubicacion: `features/admin/components/organisms/BenefitsManagement.tsx`.
 - Justificacion: CRUD administrable que permite activar/desactivar beneficios segun convenios vigentes.
 - Notificaciones:
   - Web: Todos los roles (Notificacion de 'Nuevo Beneficio' en comercios cercanos).

---

## 6. COMUNICACION Y ADMINISTRACION

[✅] [CARTELERA DE AVISOS (NEWS)]: Comunicados oficiales.
 - Estado: Funcional.
 - Ubicacion: `features/admin/components/organisms/NewsManagement.tsx`.
 - Justificacion: Reemplaza los grupos de WhatsApp masivos, centralizando la info oficial.
 - Notificaciones:
   - Web: Todos los roles (Push global para avisos de alta prioridad o urgentes).

[✅] [PANEL DE ADMINISTRACION]: Dashboard central de operaciones.
 - Estado: Funcional.
 - Ubicacion: `pages/AdminPanel.tsx` y `AdminDashboard.tsx`.
 - Justificacion: Proporciona una vista bento con KPIs en tiempo real consumiendo agregaciones de MongoDB.
 - Notificaciones:
   - Email: Admin (Reporte semanal de usuarios nuevos y canjes realizados).
   - Web: Admin (Alerta de canjes de recompensas de alto valor que requieran entrega fisica).

---

## 7. FUNCIONALIDADES FALTANTES (BACKLOG)

[🟥] [BOLSA DE TRABAJO IT]: Tablon de anuncios laborales.
 - Estado: Pendiente.
 - Ubicacion propuesta: `features/jobs/`.
 - Justificacion: Vincular a los estudiantes con empresas del sector tecnológico.
 - Notificaciones:
   - Web: Alumno (Segun tags de interes configurados en el perfil).

[🟥] [CALENDARIO ACADEMICO]: Agenda de fechas criticas.
 - Estado: Pendiente.
 - Ubicacion propuesta: `features/calendar/`.
 - Justificacion: Evita la desinformacion sobre fechas de finales, parciales e inscripciones.
 - Notificaciones:
   - Web: Alumno (Recordatorio de inicio de inscripcion a materias).

---

## ESTRATEGIA DE BASE DE DATOS (CAPA GRATUITA)

1. Firebase Authentication: Gestion de identidad (Gratis).
2. MongoDB Atlas (M0): Usuarios, News, Benefits, Rewards, Materias, Tutorships (Gratis < 512MB).
3. Firebase/Supabase Storage: Almacenamiento de PDFs de apuntes e imagenes de beneficios (Gratis < 1GB/5GB).
4. Web Push API: Notificaciones de navegador nativas via Service Workers (Gratis).
5. Resend/SendGrid: Envio de correos transaccionales (Capa gratuita limitada a 100-300 envios/dia).
