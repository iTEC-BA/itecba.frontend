import { useState, useMemo } from "react";
import { useAuth } from "@context/AuthContext";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import type { ProfileStat } from "@features/profile/components/atoms/ProfileStatStrip";
import type { MetaTag } from "@features/profile/components/atoms/ProfileMetaRow";
import type { ProfileTab } from "@features/profile/components/atoms/ProfileTabBar";
import type {
  StudyGroup,
  UpcomingDate,
  FriendSuggestion,
  NewsItem,
} from "@features/profile/components/molecules/ProfileRightPanel";
import type { ActivityCard } from "@features/profile/components/molecules/ProfileActivityGrid";
import type { ProgressSubject } from "@features/profile/components/molecules/ProfileProgressCard";
import type { RewardItem } from "@features/profile/components/molecules/ProfileRewardsCard";

export type ProfileTabId =
  | "todo"
  | "datos"
  | "progreso"
  | "recompensas"
  | "actividad";

export const PROFILE_TABS: ProfileTab[] = [
  { id: "todo", label: "Todo" },
  { id: "datos", label: "Datos personales" },
  { id: "progreso", label: "Progreso académico" },
  { id: "recompensas", label: "Recompensas" },
  { id: "actividad", label: "Actividad" },
];

// ── datos mock del panel lateral ─────────────────────────────────────────────
const MOCK_GROUPS: StudyGroup[] = [
  {
    name: "AM2 — Comisión A",
    members: "47 miembros · activo ahora",
    iconClass: "ti ti-math",
    iconColor: "text-itec-amber",
    bgClass: "bg-itec-amber/10",
    status: "activo",
  },
  {
    name: "PDEP — Comisión B",
    members: "31 miembros · activo hoy",
    iconClass: "ti ti-code",
    iconColor: "text-itec-sky",
    bgClass: "bg-itec-sky/10",
    status: "activo hoy",
  },
  {
    name: "Física I — Mecánica",
    members: "22 miembros",
    iconClass: "ti ti-atom",
    iconColor: "text-itec-purple",
    bgClass: "bg-itec-purple/10",
  },
];

const MOCK_DATES: UpcomingDate[] = [
  {
    day: "16",
    month: "Jun",
    title: "1.° turno de finales",
    subtitle: "AM2, Física I, Álgebra",
    color: "bg-itec-accent",
  },
  {
    day: "03",
    month: "Jun",
    title: "Elecciones estudiantiles",
    subtitle: "Campus y Medrano",
    color: "bg-itec-emerald",
  },
  {
    day: "30",
    month: "Abr",
    title: "Cierre Becas Progresar",
    subtitle: "Mi Argentina",
    color: "bg-itec-sky",
  },
];

const MOCK_FRIENDS: FriendSuggestion[] = [
  {
    initials: "RM",
    name: "Ramón Martínez",
    shared: "AM2, Física I · Sistemas",
  },
  { initials: "GN", name: "Gabi Niz", shared: "AM1, Álgebra · Sistemas" },
];

const MOCK_NEWS: NewsItem[] = [
  {
    title: "Becas Progresar 2026 — inscripción abierta",
    meta: "UTN FRBA · Hace 2 hs",
    dotColor: "bg-itec-sky",
  },
  {
    title: "Visita técnica a Tenaris — junio",
    meta: "ITEC · Mecánica, Ind.",
    dotColor: "bg-itec-emerald",
  },
  {
    title: "SIU historia académica — resuelto",
    meta: "Sistemas · Hace 3 días",
    dotColor: "bg-itec-amber",
  },
];

const MOCK_ACTIVITY: ActivityCard[] = [
  {
    iconClass: "ti ti-video",
    iconColor: "text-itec-sky",
    title: "GuíaTEC — AM2",
    subtitle: "6 clases · 4.9 ★ (38)",
  },
  {
    iconClass: "ti ti-users",
    iconColor: "text-itec-emerald",
    title: "Grupos creados",
    subtitle: "AM2 Comisión A · 47 miembros",
  },
  {
    iconClass: "ti ti-library",
    iconColor: "text-itec-purple",
    title: "Material compartido",
    subtitle: "12 apuntes subidos",
  },
];

const MOCK_SUBJECTS: ProgressSubject[] = [
  { name: "AM1", pct: 100, status: "aprobada", grade: 8 },
  { name: "AM2", pct: 55, status: "cursando" },
  { name: "Física I", pct: 25, status: "cursando" },
  { name: "PDEP", pct: 100, status: "aprobada", grade: 9 },
  { name: "Álgebra", pct: 100, status: "aprobada", grade: 7 },
];

const MOCK_REWARDS: RewardItem[] = [
  { icon: "ti ti-phone", label: "Llamada académica personalizada", cost: 200 },
  {
    icon: "ti ti-discount",
    label: "Descuento en clases particulares",
    cost: 150,
  },
  { icon: "ti ti-certificate", label: "Desbloquear curso premium", cost: 100 },
];

// ── hook ──────────────────────────────────────────────────────────────────────
export const useProfileDesktop = () => {
  const { user } = useAuth();
  const { careers, isDoubleMajor, startYear } = useMultiCareer();

  const [activeTab, setActiveTab] = useState<ProfileTabId>("todo");

  // Estadísticas de la franja
  const stats: ProfileStat[] = useMemo(
    () => [
      {
        value: user?.points ?? 0,
        label: "puntos",
        accentClass: "text-itec-amber",
      },
      {
        value: MOCK_SUBJECTS.filter((s) => s.status === "aprobada").length,
        label: "materias aprobadas",
        accentClass: "text-itec-emerald",
      },
      {
        value: MOCK_GROUPS.length,
        label: "grupos activos",
        accentClass: "text-itec-sky",
      },
      { value: 957, label: "publicaciones" },
      { value: 734, label: "seguidores" },
      { value: 185, label: "siguiendo" },
    ],
    [user],
  );

  // Meta tags del encabezado
  const metaTags: MetaTag[] = useMemo(() => {
    const tags: MetaTag[] = [
      { icon: "ti ti-map-pin", label: "Buenos Aires" },
      { icon: "ti ti-school", label: "UTN FRBA" },
    ];
    if (careers[0])
      tags.push({
        icon: "ti ti-building-bank",
        label: `Ing. ${careers[0].name}`,
      });
    if (isDoubleMajor && careers[1])
      tags.push({
        icon: "ti ti-building-bank",
        label: `Ing. ${careers[1].name}`,
      });
    if (startYear)
      tags.push({ icon: "ti ti-calendar", label: `Desde ${startYear}` });
    return tags;
  }, [careers, isDoubleMajor, startYear]);

  return {
    // tab
    activeTab,
    setActiveTab,
    // datos del panel lateral
    groups: MOCK_GROUPS,
    dates: MOCK_DATES,
    friends: MOCK_FRIENDS,
    news: MOCK_NEWS,
    // contenido de tabs
    activity: MOCK_ACTIVITY,
    subjects: MOCK_SUBJECTS,
    rewards: MOCK_REWARDS,
    // header
    stats,
    metaTags,
  };
};
