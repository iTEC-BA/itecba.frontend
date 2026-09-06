// src/features/courses/hooks/useCourseProgress.ts
import { useShallow } from "zustand/shallow";
//
// Encapsula toda la lógica de progreso (marcar vistos, persistir, leer)
// que antes vivía dentro de CourseDetail.tsx (264 líneas).
// Usa el store Zustand para el estado y sincroniza con localStorage.

import { useEffect } from "react";
import { useCourseStore, selectPlayer } from "../store/useCourseStore";
import type { CourseData } from "../services/coursesService";

export const useCourseProgress = (course: CourseData | null | undefined, userId: string | undefined) => {
  const {
    watchedVideos,
    currentVideoIndex,
    setCurrentVideoIndex,
    toggleWatched,
    loadWatchedFromStorage,
    persistWatched,
  } = useCourseStore(useShallow(selectPlayer));

  const courseId = course?.id || (course as any)?._id || "";
  const watchedForCourse = courseId ? (watchedVideos[courseId] ?? new Set<string>()) : new Set<string>();

  // Cargar progreso guardado cuando llegue el curso y el usuario
  useEffect(() => {
    if (courseId && userId) {
      loadWatchedFromStorage(courseId, userId);
    }
  }, [courseId, userId]);

  const handleToggleWatched = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!courseId || !userId) return;
    toggleWatched(courseId, videoId);
    // Persistir de forma diferida para no bloquear el click
    setTimeout(() => persistWatched(courseId, userId), 0);
  };

  const progressPercent = (() => {
    const lessons = course?.sections?.length
      ? course.sections.flatMap((s) => s.lessons || [])
      : course?.videos || [];
    const total = lessons.length;
    if (total === 0) return 0;
    const watched = lessons.filter(
      (l: any) => watchedForCourse.has(l.youtubeId || l._id || l.id || "")
    ).length;
    return Math.round((watched / total) * 100);
  })();

  return {
    watchedVideos: watchedForCourse,
    currentVideoIndex,
    setCurrentVideoIndex,
    handleToggleWatched,
    progressPercent,
  };
};
