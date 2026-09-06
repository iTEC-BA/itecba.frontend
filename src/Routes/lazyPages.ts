// src/routes/lazyPages.ts
// Todos los imports lazy de páginas, centralizados. Antes vivían sueltos en
// App.tsx junto con la config de rutas; separarlos deja cada archivo con una
// sola responsabilidad (qué páginas existen vs. cómo se enrutan).
import { lazy } from "react";

export const BenefitsPage      = lazy(() => import("@pages/BenefitsPage").then(m => ({ default: m.BenefitsPage })));
export const CourseEditDetail  = lazy(() => import("@/features/courses/pages/CourseEditDetail").then(m => ({ default: m.CourseEditDetail })));
export const HomePage          = lazy(() => import("@pages/HomePage").then(m => ({ default: m.HomePage })));
export const CoursesPage       = lazy(() => import("@pages/CoursesPage").then(m => ({ default: m.CoursesPage })));
export const CourseLandingPage = lazy(() => import("@/features/courses/pages/CourseLandingPage").then(m => ({ default: m.CourseLandingPage })));
export const CourseDetail      = lazy(() => import("@/features/courses/pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
export const ResourcesPage     = lazy(() => import("@pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
export const FaqsPage          = lazy(() => import("@pages/FaqsPage").then(m => ({ default: m.FaqsPage })));
export const GroupsPage        = lazy(() => import("@pages/GroupsPage").then(m => ({ default: m.GroupsPage })));
export const AdmissionPage     = lazy(() => import("@pages/AdmissionPage").then(m => ({ default: m.AdmissionPage })));
export const GradePage         = lazy(() => import("@pages/GradePage").then(m => ({ default: m.GradePage })));
export const AboutPage         = lazy(() => import("@pages/AboutPage").then(m => ({ default: m.AboutPage })));
export const ProfilePage       = lazy(() => import("@pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
export const AdminPanel        = lazy(() => import("@pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
export const ProgressPage      = lazy(() => import("@pages/ProgressPage").then(m => ({ default: m.ProgressPage })));
export const ErrorPage         = lazy(() => import("@pages/ErrorPage").then(m => ({ default: m.ErrorPage })));
export const LoginPage         = lazy(() => import("@pages/LoginPage").then(m => ({ default: m.LoginPage })));
export const AulasPage         = lazy(() => import("@pages/AulasPage").then(m => ({ default: m.AulasPage })));
export const AulaDetallePage   = lazy(() => import("@pages/AulaDetallePage").then(m => ({ default: m.AulaDetallePage })));
export const GuiaTECPage       = lazy(() => import("@pages/GuiaTECPage").then(m => ({ default: m.GuiaTECPage })));
export const CalendarioPage    = lazy(() => import("@pages/CalendarioPage").then(m => ({ default: m.CalendarioPage })));
export const PluginsPage       = lazy(() => import("@pages/PluginsPage").then(m => ({ default: m.PluginsPage })));
export const TerminosPage      = lazy(() => import("@pages/TerminosPage").then(m => ({ default: m.TerminosPage })));
export const ForumPage         = lazy(() => import("@pages/ForumPage").then(m => ({ default: m.ForumPage })));
export const ForumThreadPage   = lazy(() => import("@pages/ForumThreadPage").then(m => ({ default: m.ForumThreadPage })));
export const TruekeTECPage     = lazy(() => import("@/pages/TrueketecPage").then(m => ({ default: m.TruekeTECPage })));
export const NotificationsPage = lazy(() => import("@/pages/NotificationsPage").then(m => ({ default: m.NotificationsPage })));

// GradeDetailPage y PadronPage no son lazy en el original (import directo,
// no code-split) — se mantienen así para no cambiar el comportamiento de
// carga existente.
export { default as GradeDetailPage } from "@pages/gradeDetailPage";
export { default as PadronPage } from "@pages/PadronPage";
