// src/routes/publicRoutes.tsx
// Rutas accesibles sin sesión iniciada. Las que tienen sección propia en el
// sidebar principal (ver src/hooks/useSidebarLinks.ts) están envueltas en
// <PageGate path="..."> para poder activarlas/desactivarlas/marcarlas
// "Próximamente" desde /admin/paginas. Rutas con parámetros dinámicos
// (:id, :slug, :postId, :carreraId) y páginas institucionales fijas
// (/, /login, /ingreso, /nosotros, /terminos) quedan sin gate a propósito:
// bloquear una ruta paramétrica es una decisión de producto aparte.
import { Route } from "react-router-dom";
import { PageGate } from "@features/pageAccess/components/PageGate";
import { PageSuspense } from "./PageSuspense";
import {
  PadronPage,
  HomePage,
  ForumPage,
  ForumThreadPage,
  LoginPage,
  CoursesPage,
  CourseDetail,
  FaqsPage,
  AdmissionPage,
  GradePage,
  GradeDetailPage,
  AboutPage,
  GroupsPage,
  AulasPage,
  AulaDetallePage,
  GuiaTECPage,
  CalendarioPage,
  PluginsPage,
  TerminosPage,
} from "./lazyPages";

export const PublicRoutes = (
  <>
    <Route path="/padron" element={<PadronPage />} />
    <Route path="/" element={<PageSuspense><HomePage /></PageSuspense>} />
    <Route path="/foro" element={<PageSuspense><PageGate path="/foro"><ForumPage /></PageGate></PageSuspense>} />
    <Route path="/foro/:postId" element={<PageSuspense><ForumThreadPage /></PageSuspense>} />
    <Route path="/login" element={<PageSuspense><LoginPage /></PageSuspense>} />
    <Route path="/cursos" element={<PageSuspense><PageGate path="/cursos"><CoursesPage /></PageGate></PageSuspense>} />
    <Route path="/cursos/:id" element={<PageSuspense><CourseDetail /></PageSuspense>} />
    <Route path="/faqs" element={<PageSuspense><PageGate path="/faqs"><FaqsPage /></PageGate></PageSuspense>} />
    <Route path="/ingreso" element={<PageSuspense><AdmissionPage /></PageSuspense>} />
    <Route path="/grado" element={<PageSuspense><PageGate path="/grado"><GradePage /></PageGate></PageSuspense>} />
    <Route path="/grado/:carreraId" element={<GradeDetailPage />} />
    <Route path="/nosotros" element={<PageSuspense><AboutPage /></PageSuspense>} />
    <Route path="/grupos" element={<PageSuspense><PageGate path="/grupos"><GroupsPage /></PageGate></PageSuspense>} />
    <Route path="/aulas" element={<PageSuspense><PageGate path="/aulas"><AulasPage /></PageGate></PageSuspense>} />
    <Route path="/aulas/:slug" element={<PageSuspense><AulaDetallePage /></PageSuspense>} />
    <Route path="/guiatec" element={<PageSuspense><PageGate path="/guiatec"><GuiaTECPage /></PageGate></PageSuspense>} />
    <Route path="/calendario" element={<PageSuspense><PageGate path="/calendario"><CalendarioPage /></PageGate></PageSuspense>} />
    <Route path="/plugins" element={<PageSuspense><PageGate path="/plugins"><PluginsPage /></PageGate></PageSuspense>} />
    <Route path="/terminos" element={<PageSuspense><TerminosPage /></PageSuspense>} />
  </>
);
