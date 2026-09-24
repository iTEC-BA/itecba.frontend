// src/routes/lazyPages.ts
// Todos los imports lazy de páginas, centralizados. Antes vivían sueltos en
// App.tsx junto con la config de rutas; separarlos deja cada archivo con una
// sola responsabilidad (qué páginas existen vs. cómo se enrutan).
import { lazy } from "react";

export const BenefitsPage = lazy(() => import("@features/benefits").then((m) => ({ default: m.BenefitsPage })));
export const HomePage = lazy(() => import("@features/home").then((m) => ({ default: m.HomePage })));
export const CoursesPage = lazy(() => import("@features/courses").then((m) => ({ default: m.CoursesPage })));
export const CourseLandingPage = lazy(() => import("@features/courses").then((m) => ({ default: m.CourseLandingPage })));
export const CourseDetail = lazy(() => import("@features/courses").then((m) => ({ default: m.CourseDetail })));
export const ResourcesPage = lazy(() => import("@features/resources").then((m) => ({ default: m.ResourcesPage })));
export const FaqsPage = lazy(() => import("@features/faqs").then((m) => ({ default: m.FaqsPage })));
export const GroupsPage = lazy(() => import("@features/groups").then((m) => ({ default: m.GroupsPage })));
export const AdmissionPage = lazy(() => import("@features/admission").then((m) => ({ default: m.AdmissionPage })));
export const GradePage = lazy(() => import("@features/grade").then((m) => ({ default: m.GradePage })));
export const AboutPage = lazy(() => import("@features/about").then((m) => ({ default: m.AboutPage })));
export const ProfilePage = lazy(() => import("@features/profile").then((m) => ({ default: m.ProfilePage })));
export const AdminPanel = lazy(() => import("@features/admin").then((m) => ({ default: m.AdminPanel })));
export const ProgressPage = lazy(() => import("@features/progress").then((m) => ({ default: m.ProgressPage })));
export const ErrorPage = lazy(() => import("@features/error").then((m) => ({ default: m.ErrorPage })));
export const LoginPage = lazy(() => import("@features/login").then((m) => ({ default: m.LoginPage })));
export const AulasPage = lazy(() => import("@features/aulas").then((m) => ({ default: m.AulasPage })));
export const AulaDetallePage = lazy(() => import("@features/aulas").then((m) => ({ default: m.AulaDetallePage })));
export const GuiaTECPage = lazy(() => import("@pages/GuiaTECPage").then((m) => ({ default: m.GuiaTECPage })));
export const CalendarioPage = lazy(() => import("@features/calendar").then((m) => ({ default: m.CalendarioPage })));
export const PluginsPage = lazy(() => import("@features/plugins").then((m) => ({ default: m.PluginsPage })));
export const TerminosPage = lazy(() => import("@pages/TerminosPage").then((m) => ({ default: m.TerminosPage })));
export const ForumPage = lazy(() => import("@features/forum").then((m) => ({ default: m.ForumPage })));
export const ForumThreadPage = lazy(() => import("@features/forum").then((m) => ({ default: m.ForumThreadPage })));
export const TruekeTECPage = lazy(() => import("@features/trueketec").then((m) => ({ default: m.TruekeTECPage })));
export const NotificationsPage = lazy(() => import("@features/notifications").then((m) => ({ default: m.NotificationsPage })));

export { GradeDetailPage } from "@features/grade";
export { PadronPage } from "@features/padron";
